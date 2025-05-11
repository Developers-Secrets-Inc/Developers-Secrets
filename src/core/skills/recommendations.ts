'use server'

import type {
  Challenge,
  Concept,
  ImplementationConcept,
  Skill,
  UserConceptProgression,
  UserImplementationConceptProgression,
  UserChallengeProgression,
} from '@/payload-types' // Assurez-vous que les types sont à jour
import config from '@payload-config'
import { getPayload } from 'payload'
import type { Payload } from 'payload' // Import Payload type

// --- Constantes de Configuration (Ajuster si nécessaire) ---
const RECENT_ACTIVITY_THRESHOLD_DAYS = 30 // Considérer une skill active si travaillée dans les X derniers jours
const MIN_PROGRESS_FOR_TARGET = 30 // Seuil min pour considérer un concept "en cours"
const MAX_PROGRESS_FOR_TARGET = 80 // Seuil max pour considérer un concept "en cours"
const MAX_ACTIVE_SKILLS_TO_RECOMMEND = 3 // Nombre max de skills pour lesquelles on génère des recommandations
const MAX_CHALLENGES_PER_SKILL = 3 // Nombre max de challenges à recommander par skill

interface RecommendationOptions {
  countPerSkill?: number
  // Ajouter d'autres options si besoin
}

interface RecommendationsBySkill {
  [skillName: string]: Challenge[] // Utiliser le nom de la skill comme clé pour l'affichage
}

/**
 * Helper function to retrieve a random challenge not yet completed by the user.
 * @param userId - The ID of the user (Supabase).
 * @param payload - Payload client instance.
 * @returns A random uncompleted Challenge object or null if none found.
 */
export async function getRandomUncompletedChallenge(
  userId: string,
  payload?: Payload, // Make payload optional, get it if not provided
): Promise<Challenge | null> {
  console.log(`Attempting to find a random uncompleted challenge for user ${userId}...`)
  const currentPayload = payload || (await getPayload({ config })) // Get payload if not passed

  try {
    // 1. Get IDs of completed challenges
    const completedProgressions = await currentPayload.find({
      collection: 'userChallengeProgression',
      where: {
        userId: { equals: userId },
        completionStatus: { equals: 'completed' },
      },
      limit: 0,
      depth: 0,
      select: { challenge: true },
      pagination: false,
    })

    const completedChallengeIds = new Set<number>(
      completedProgressions.docs
        .map((p: { challenge?: number | { id: number } | null }) => {
          if (typeof p.challenge === 'number') return p.challenge
          if (typeof p.challenge === 'object' && p.challenge !== null) return p.challenge.id
          return null
        })
        .filter((id): id is number => id !== null),
    )
    console.log(`  User has ${completedChallengeIds.size} completed challenges.`)

    // 2. Fetch a sample of potential challenges (adjust limit as needed)
    const potentialChallengesResult = await currentPayload.find({
      collection: 'challenges',
      limit: 100, // Fetch a sample
      depth: 2, // Depth 2 should include concepts, difficulty etc. needed for display
      pagination: false,
      // Optionally add where clause to exclude specific types if needed
    })

    // 3. Filter out completed challenges
    const uncompletedChallenges = (potentialChallengesResult.docs as Challenge[]).filter(
      (challenge) => !completedChallengeIds.has(challenge.id),
    )

    console.log(
      `  Found ${potentialChallengesResult.docs.length} potential, ${uncompletedChallenges.length} uncompleted challenges in the sample.`,
    )

    // 4. Select randomly if any remain
    if (uncompletedChallenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * uncompletedChallenges.length)
      const randomChallenge = uncompletedChallenges[randomIndex]
      console.log(
        `  Selected random challenge: ${randomChallenge.title} (ID: ${randomChallenge.id})`,
      )
      return randomChallenge
    } else {
      console.log(`  No uncompleted challenges found in the sample for user ${userId}.`)
      // Optional: Could try fetching ALL challenges if the sample fails, but might be slow.
      return null
    }
  } catch (error) {
    console.error(`Error fetching random uncompleted challenge for user ${userId}:`, error)
    return null
  }
}

/**
 * Récupère les challenges recommandés pour un utilisateur, groupés par skill active.
 * Se base sur les concepts en cours d'apprentissage dans les skills récemment travaillées.
 *
 * @param userId - L'ID de l'utilisateur (Supabase).
 * @param options - Options de configuration pour les recommandations.
 * @returns Un objet où les clés sont les noms des skills actives et les valeurs sont des listes de challenges recommandés.
 */
export async function getRecommendedChallenges(
  userId: string,
  options: RecommendationOptions = {},
): Promise<RecommendationsBySkill> {
  const payload = await getPayload({ config })
  const { countPerSkill = MAX_CHALLENGES_PER_SKILL } = options
  const recommendations: RecommendationsBySkill = {}
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - RECENT_ACTIVITY_THRESHOLD_DAYS)

  console.log(`Getting recommendations for user ${userId}, cutoff: ${cutoffDate.toISOString()}`)

  let activeSkillMap = new Map<number, { name: string; lastActivity: Date }>() // Initialize here

  try {
    // +++ Get IDs of challenges already completed by the user +++
    const completedProgressions = await payload.find({
      collection: 'userChallengeProgression',
      where: {
        userId: { equals: userId },
        completionStatus: { equals: 'completed' },
      },
      limit: 0,
      depth: 0,
      select: { challenge: true },
      pagination: false,
    })

    const completedChallengeIds = new Set<number>(
      completedProgressions.docs
        .map((p: { challenge?: number | { id: number } | null }) => {
          if (typeof p.challenge === 'number') return p.challenge
          if (typeof p.challenge === 'object' && p.challenge !== null) return p.challenge.id
          return null
        })
        .filter((id): id is number => id !== null),
    )
    console.log(`User ${userId} has completed ${completedChallengeIds.size} challenges.`)
    // --- End completed challenges fetch ---

    // 1. Récupérer les progressions sur les concepts implémentés pour identifier les skills actives
    const implProgressions = await payload.find({
      collection: 'userImplementationConceptProgressions',
      where: {
        user: { equals: userId },
        progressValue: { greater_than: 0, less_than: 100 }, // Progression en cours
        updatedAt: { greater_than_equal: cutoffDate.toISOString() }, // Utiliser updatedAt comme proxy de récence
      },
      limit: 0, // Tout récupérer
      depth: 2, // Important: Récupérer ImplementationConcept -> Skill
      sort: '-updatedAt', // Trier par les plus récents d'abord
    })

    // 2. Identifier les Skills Actives (les plus récentes)
    activeSkillMap = new Map<number, { name: string; lastActivity: Date }>()
    for (const prog of implProgressions.docs as UserImplementationConceptProgression[]) {
      if (activeSkillMap.size >= MAX_ACTIVE_SKILLS_TO_RECOMMEND) break // Limiter le nombre de skills traitées

      const implConcept = prog.implementationConcept
      if (
        implConcept &&
        typeof implConcept === 'object' &&
        implConcept.implementationSkill &&
        typeof implConcept.implementationSkill === 'object'
      ) {
        const skill = implConcept.implementationSkill as Skill // Type assertion
        if (!activeSkillMap.has(skill.id)) {
          activeSkillMap.set(skill.id, { name: skill.name, lastActivity: new Date(prog.updatedAt) })
        }
      }
    }

    if (activeSkillMap.size === 0) {
      console.log(`No recent active skills found for user ${userId}.`)
      return {} // Pas de recommandations si aucune skill active
    }

    console.log(
      'Active Skills identified:',
      Array.from(activeSkillMap.values()).map((s) => s.name),
    )

    // 3. Récupérer TOUTE la progression (base et implémentée) pour l'utilisateur
    // On pourrait optimiser en ne récupérant que la progression pour les concepts liés aux skills actives, mais c'est plus complexe
    const [allConceptProgressions, allImplConceptProgressions] = await Promise.all([
      payload.find({
        collection: 'userConceptProgressions',
        where: { user: { equals: userId } },
        limit: 0,
        depth: 0,
      }),
      payload.find({
        collection: 'userImplementationConceptProgressions',
        where: { user: { equals: userId } },
        limit: 0,
        depth: 1, // Need depth 1 to get implementationConcept -> concept link
      }),
    ])

    // Créer des maps pour un accès rapide à la progression
    const conceptProgressMap = new Map<number, number | null | undefined>(
      (allConceptProgressions.docs as UserConceptProgression[]).map((p) => [
        typeof p.concept === 'number' ? p.concept : p.concept.id, // Handle populated concept
        p.progressValue,
      ]),
    )
    const implConceptProgressMap = new Map<number, number | null | undefined>(
      (allImplConceptProgressions.docs as UserImplementationConceptProgression[]).map((p) => [
        typeof p.implementationConcept === 'number'
          ? p.implementationConcept
          : p.implementationConcept.id, // Handle populated impl concept
        p.progressValue,
      ]),
    )

    // --- Boucle principale : Recommandations par Skill Active ---
    for (const [skillId, skillInfo] of activeSkillMap.entries()) {
      console.log(`\nProcessing recommendations for Skill: ${skillInfo.name} (ID: ${skillId})`)

      // 4. Identifier les concepts cibles "en cours" pour CETTE skill
      const implConceptsForThisSkill = await payload.find({
        collection: 'implementationConcepts',
        where: {
          implementationSkill: { equals: skillId },
        },
        limit: 0,
        depth: 1, // Need the parent concept ID
      })

      const targetImplConceptIdsForThisSkill: number[] = []
      const targetParentConceptIds = new Set<number>()

      for (const implConcept of implConceptsForThisSkill.docs as ImplementationConcept[]) {
        const progress = implConceptProgressMap.get(implConcept.id) ?? 0 // Use map, default to 0
        if (progress >= MIN_PROGRESS_FOR_TARGET && progress < MAX_PROGRESS_FOR_TARGET) {
          targetImplConceptIdsForThisSkill.push(implConcept.id)
          // Add parent concept ID to target set if implementation is in progress
          const parentConceptId =
            typeof implConcept.concept === 'number' ? implConcept.concept : implConcept.concept?.id
          if (parentConceptId) {
            targetParentConceptIds.add(parentConceptId)
          }
        }
      }

      // Additionally, find Base Concepts 'in progress' that might be relevant (using the map)
      const targetConceptIdsForThisSkill = Array.from(conceptProgressMap.entries())
        .filter(([conceptId, progress]) => {
          const pVal = progress ?? 0
          // Include if in target range OR if it's a parent of an in-progress implementation concept
          return (
            (pVal >= MIN_PROGRESS_FOR_TARGET && pVal < MAX_PROGRESS_FOR_TARGET) ||
            targetParentConceptIds.has(conceptId)
          )
        })
        .map(([conceptId]) => conceptId)

      if (
        targetImplConceptIdsForThisSkill.length === 0 &&
        targetConceptIdsForThisSkill.length === 0
      ) {
        console.log(`  No concepts 'in progress' found for skill ${skillInfo.name}. Skipping.`)
        continue
      }

      console.log(`  Target ImplConcepts for ${skillInfo.name}:`, targetImplConceptIdsForThisSkill)
      console.log(`  Target BaseConcepts for ${skillInfo.name}:`, targetConceptIdsForThisSkill)

      // 5. Récupérer les challenges potentiels
      const potentialChallengesResult = await payload.find({
        collection: 'challenges',
        limit: 500, // Limite pour la performance
        depth: 3, // Nécessaire pour les impacts
        pagination: false,
      })

      // --- Filter out already completed challenges ---
      const uncompletedPotentialChallenges = (potentialChallengesResult.docs as Challenge[]).filter(
        (challenge) => !completedChallengeIds.has(challenge.id),
      )
      console.log(
        `  Filtered potential challenges: ${potentialChallengesResult.docs.length} -> ${uncompletedPotentialChallenges.length} (uncompleted)`,
      )
      // --- End completed filter ---

      // 6. Filtrer les challenges pertinents pour CETTE skill et concepts cibles (using uncompleted list)
      const relevantChallenges = uncompletedPotentialChallenges.filter((challenge) => {
        if (!challenge.skillImpacts) return false

        const impactSetForThisSkill = challenge.skillImpacts.find((iset) => {
          const isetSkillId = typeof iset.skill === 'object' ? iset.skill.id : iset.skill
          return isetSkillId === skillId
        })

        if (!impactSetForThisSkill || !impactSetForThisSkill.impacts) return false

        // Vérifier si au moins un impact correspond à un concept cible
        for (const impactBlock of impactSetForThisSkill.impacts) {
          if (impactBlock.blockType === 'skillConceptImpact') {
            const implConceptId =
              typeof impactBlock.implementationConcept === 'object'
                ? impactBlock.implementationConcept.id
                : impactBlock.implementationConcept
            if (
              typeof implConceptId === 'number' &&
              targetImplConceptIdsForThisSkill.includes(implConceptId)
            )
              return true
          } else if (impactBlock.blockType === 'baseConceptImpact') {
            const conceptId =
              typeof impactBlock.concept === 'object' ? impactBlock.concept.id : impactBlock.concept
            if (typeof conceptId === 'number' && targetConceptIdsForThisSkill.includes(conceptId))
              return true
          }
        }
        return false // Aucun impact pertinent trouvé pour ce challenge et cette skill
      })

      console.log(
        `  Found ${relevantChallenges.length} relevant (and uncompleted) challenges for skill ${skillInfo.name}.`,
      )

      // 7. Ordonner (simpliste) et sélectionner
      // TODO: Améliorer l'ordonnancement (difficulté, etc.)
      if (relevantChallenges.length > 0) {
        // Only add if relevant challenges were found for the skill
        recommendations[skillInfo.name] = relevantChallenges
          .sort((a: Challenge, b: Challenge) =>
            (a.difficulty || '').localeCompare(b.difficulty || ''),
          ) // Tri simple par difficulté
          .slice(0, countPerSkill)
      }
    } // Fin de la boucle sur les skills actives

    // --- FALLBACK LOGIC --- Moved outside the loop
    if (Object.keys(recommendations).length === 0) {
      // Check if NO recommendations were added in the loop
      console.log(
        `No relevant skill-based recommendations found for user ${userId} across active skills. Attempting fallback...`,
      )
      const randomChallenge = await getRandomUncompletedChallenge(userId, payload)
      if (randomChallenge) {
        recommendations['general_recommendation'] = [randomChallenge]
        console.log(`Fallback successful: Added random challenge ${randomChallenge.id}`)
      } else {
        console.log('Fallback failed: No random uncompleted challenge could be found.')
      }
    }

    return recommendations
  } catch (error) {
    console.error(`Error getting recommendations for user ${userId}:`, error)
    return {} // Retourner un objet vide en cas d'erreur
  }
}
