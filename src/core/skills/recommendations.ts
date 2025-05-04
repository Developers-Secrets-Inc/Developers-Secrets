'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type {
  Challenge,
  Concept,
  ImplementationConcept,
  Skill,
  UserConceptProgressions,
  UserImplementationConceptProgressions,
} from '@/payload-types' // Assurez-vous que les types sont à jour

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

  try {
    // +++ Get IDs of challenges already completed by the user +++
    const completedProgressions = await payload.find({
      collection: 'userChallengeProgression',
      where: {
        userId: { equals: userId },
        completionStatus: { equals: 'completed' },
      },
      limit: 0, // Get all completed
      depth: 0, // No need for relations
      select: ['challenge'], // Only need the challenge ID
      pagination: false,
    })

    const completedChallengeIds = new Set(
      completedProgressions.docs
        .map((p) => (typeof p.challenge === 'number' ? p.challenge : p.challenge?.id))
        .filter((id): id is number => id != null), // Ensure only valid numbers
    )
    console.log(`User ${userId} has completed ${completedChallengeIds.size} challenges.`)
    // --- End completed challenges fetch ---

    // 1. Récupérer les progressions sur les concepts implémentés pour identifier les skills actives
    const implProgressions = await payload.find({
      collection: 'userImplementationConceptProgressions',
      where: {
        user: { equals: userId },
        progressValue: { greater_than: 0, less_than: 100 }, // Progression en cours
        // Filtrer par date si 'lastActivityAt' est fiable et indexé
        updatedAt: { greater_than_equal: cutoffDate.toISOString() }, // Utiliser updatedAt comme proxy de récence
      },
      limit: 0, // Tout récupérer
      depth: 2, // Important: Récupérer ImplementationConcept -> Skill
      sort: '-updatedAt', // Trier par les plus récents d'abord
    })

    // 2. Identifier les Skills Actives (les plus récentes)
    const activeSkillMap = new Map<number, { name: string; lastActivity: Date }>()
    for (const prog of implProgressions.docs) {
      if (activeSkillMap.size >= MAX_ACTIVE_SKILLS_TO_RECOMMEND) break // Limiter le nombre de skills traitées

      const implConcept = prog.implementationConcept as ImplementationConcept // Type assertion
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
        depth: 0, // Pas besoin de depth ici, on a déjà les infos de skill
      }),
    ])

    // Créer des maps pour un accès rapide à la progression
    const conceptProgressMap = new Map(
      allConceptProgressions.docs.map((p) => [p.concept, p.progressValue]),
    )
    const implConceptProgressMap = new Map(
      allImplConceptProgressions.docs.map((p) => [p.implementationConcept, p.progressValue]),
    )

    // --- Boucle principale : Recommandations par Skill Active ---
    for (const [skillId, skillInfo] of activeSkillMap.entries()) {
      console.log(`\nProcessing recommendations for Skill: ${skillInfo.name} (ID: ${skillId})`)

      // 4. Identifier les concepts cibles "en cours" pour CETTE skill
      const targetImplConceptsForSkill = allImplConceptProgressions.docs.filter((p) => {
        // Filtrer pour garder seulement les concepts de la skill actuelle
        // ET dont la progression est dans la bonne fourchette
        const implConceptDoc = p.implementationConcept as ImplementationConcept // Suppose que l'ID suffit ? Sinon depth 1 ici. Ou vérifier dans les données déjà chargées
        // Note: This assumes we have the ImplementationConcept documents or can filter by skillId if stored directly
        // This part might need adjustment based on actual data structure access
        const progress = implConceptProgressMap.get(p.implementationConcept) || 0 // Utiliser la map
        // We need a way to link p.implementationConcept ID back to its skill ID if not populated
        // Let's re-fetch just the ImplConcepts linked to this skill for clarity
        // This is less efficient but clearer without complex joins
        return progress >= MIN_PROGRESS_FOR_TARGET && progress < MAX_PROGRESS_FOR_TARGET // Placeholder filter logic
      })
      // TODO: Need to properly filter implConceptProgressions based on skillId

      const targetConceptsForSkill = allConceptProgressions.docs.filter((p) => {
        const progress = conceptProgressMap.get(p.concept) || 0
        return progress >= MIN_PROGRESS_FOR_TARGET && progress < MAX_PROGRESS_FOR_TARGET
        // TODO: Filter concepts potentially linked to this skill via parentSkill? Or just global concepts?
      })

      // Simplification: pour l'instant, utilisons les IDs récupérés plus tôt des progressions actives
      const targetImplConceptIdsForThisSkill = implProgressions.docs
        .filter((p) => {
          const implConcept = p.implementationConcept as ImplementationConcept
          return (
            typeof implConcept === 'object' &&
            typeof implConcept.implementationSkill === 'object' &&
            implConcept.implementationSkill.id === skillId
          )
        })
        .map((p) =>
          typeof p.implementationConcept === 'object'
            ? p.implementationConcept.id
            : p.implementationConcept,
        )

      // TODO: Get related target base concept IDs more intelligently
      const targetConceptIdsForThisSkill =
        targetImplConceptIdsForThisSkill.length > 0
          ? [
              /* Get parent IDs */
            ]
          : []

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
        // TODO: Consider more targeted fetching if possible (e.g., only challenges linked to target concepts?)
      })

      // --- Filter out already completed challenges ---
      const uncompletedPotentialChallenges = potentialChallengesResult.docs.filter(
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
            if (targetImplConceptIdsForThisSkill.includes(implConceptId)) return true
          } else if (impactBlock.blockType === 'baseConceptImpact') {
            const conceptId =
              typeof impactBlock.concept === 'object' ? impactBlock.concept.id : impactBlock.concept
            if (targetConceptIdsForThisSkill.includes(conceptId)) return true
          }
        }
        return false // Aucun impact pertinent trouvé pour ce challenge et cette skill
      })

      console.log(
        `  Found ${relevantChallenges.length} relevant (and uncompleted) challenges for skill ${skillInfo.name}.`,
      )

      // 7. Ordonner (simpliste) et sélectionner
      // TODO: Améliorer l'ordonnancement (difficulté, etc.)
      recommendations[skillInfo.name] = relevantChallenges
        .sort((a, b) => (a.difficulty || '').localeCompare(b.difficulty || '')) // Tri simple par difficulté
        .slice(0, countPerSkill)
    } // Fin de la boucle sur les skills actives

    return recommendations
  } catch (error) {
    console.error(`Error getting recommendations for user ${userId}:`, error)
    return {} // Retourner un objet vide en cas d'erreur
  }
}
