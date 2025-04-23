import type {
  Concept
} from '@/payload-types'; // Assurez-vous que les types Payload sont à jour
import config from '@payload-config'
import { getPayload } from 'payload'
import { getChallengeWithDepth, getSkillBySlug } from './index'

const PROPAGATION_FACTOR = 0.5 // Facteur de propagation (ajuster si nécessaire)

/**
 * Enregistre la complétion d'un challenge par un utilisateur pour une compétence spécifique
 * et met à jour la progression des concepts associés.
 *
 * @param userId - L'ID de l'utilisateur (Supabase).
 * @param challengeId - L'ID numérique du challenge complété.
 * @param skillSlug - Le slug de la compétence (langage/framework) utilisée.
 */
export const recordChallengeCompletion = async (
  userId: string,
  challengeId: number,
  skillSlug: string,
): Promise<void> => {
  console.log(
    `Recording challenge completion for user: ${userId}, challenge: ${challengeId}, skill: ${skillSlug}`,
  )

  try {

    // 1. Trouver l'ID de la Skill correspondant au slug
    const skillQueryResult = await getSkillBySlug(skillSlug)

    if (!skillQueryResult) {
      console.error(`Skill with slug "${skillSlug}" not found! Cannot apply impacts.`)
      return // Arrêter si la skill n'existe pas
    }

    const targetSkillId = skillQueryResult.id
    console.log(`Found target Skill ID: ${targetSkillId}`)

    // 2. Récupérer le document Challenge avec ses impacts
    // Note: La depth nécessaire peut varier selon votre configuration et si les relations sont stockées comme ID ou objets.
    // depth: 3 pourrait être nécessaire pour peupler skill -> impacts -> implementationConcept/concept
    const challenge = await getChallengeWithDepth(challengeId)

    if (!challenge) {
      console.error(`Challenge with ID ${challengeId} not found.`)
      return
    }

    if (!challenge.skillImpacts || challenge.skillImpacts.length === 0) {
      console.log(`No skill impacts defined for challenge ${challengeId}.`)
      return // Rien à faire s'il n'y a pas d'impacts définis
    }

    // 3. Trouver le bon groupe d'impacts pour la skill cible
    const skillImpactSet = challenge.skillImpacts.find((impactSet) => {
      // La relation 'skill' peut être un ID (number) ou un objet Skill peuplé
      const impactSetSkillId =
        typeof impactSet.skill === 'object' ? impactSet.skill.id : impactSet.skill
      return impactSetSkillId === targetSkillId
    })

    if (!skillImpactSet || !skillImpactSet.impacts || skillImpactSet.impacts.length === 0) {
      console.log(
        `No specific impacts found for skill slug "${skillSlug}" (ID: ${targetSkillId}) on challenge ${challengeId}.`,
      )
      return // Pas d'impacts définis pour cette skill spécifique
    }

    console.log(`Found ${skillImpactSet.impacts.length} impacts to process for skill ${skillSlug}.`)

    // 4. Itérer sur les impacts et appeler les fonctions de mise à jour
    for (const impactBlock of skillImpactSet.impacts) {
      if (impactBlock.blockType === 'skillConceptImpact') {
        const implementationConceptId =
          typeof impactBlock.implementationConcept === 'object'
            ? impactBlock.implementationConcept.id
            : impactBlock.implementationConcept
        const amount = impactBlock.progressAmount

        if (implementationConceptId && amount && amount > 0) {
          console.log(
            `  -> Calling updateUserImplementationProgression for user ${userId}, implConcept ${implementationConceptId}, amount ${amount}`,
          )
          await updateUserImplementationProgression(userId, implementationConceptId, amount)
        }
      } else if (impactBlock.blockType === 'baseConceptImpact') {
        const conceptId =
          typeof impactBlock.concept === 'object' ? impactBlock.concept.id : impactBlock.concept
        const amount = impactBlock.progressAmount

        if (conceptId && amount && amount > 0) {
          console.log(
            `  -> Calling updateUserConceptProgression for user ${userId}, concept ${conceptId}, amount ${amount}`,
          )
          await updateUserConceptProgression(userId, conceptId, amount) // Appel réel
        }
      }
    }

    console.log(`Finished processing impacts for user ${userId}, challenge ${challengeId}.`)
  } catch (error) {
    console.error('Error recording challenge completion:', error)
    // Gérer l'erreur de manière appropriée (log, notification, etc.)
  }
}

/**
 * Met à jour ou crée la progression d'un utilisateur pour un ImplementationConcept spécifique.
 *
 * @param userId - L'ID de l'utilisateur (Supabase).
 * @param implementationConceptId - L'ID du concept implémenté.
 * @param amount - Le montant de progression à ajouter (sera cappé à 100).
 */
export const updateUserImplementationProgression = async (
  userId: string,
  implementationConceptId: number,
  amount: number,
): Promise<void> => {
  if (!userId || !implementationConceptId || amount <= 0) {
    console.warn('Invalid arguments provided to updateUserImplementationProgression.')
    return
  }

  console.log(
    `Updating UserImplementationProgression for user ${userId}, implConcept ${implementationConceptId}, amount ${amount}`,
  )
  const payload = await getPayload({ config })
  const now = new Date()

  try {
    // 1. Chercher une progression existante
    const existingProgression = await payload.find({
      collection: 'userImplementationConceptProgressions',
      where: {
        user: { equals: userId },
        implementationConcept: { equals: implementationConceptId },
      },
      limit: 1,
      depth: 0, // Pas besoin de peupler les relations ici
    })

    if (existingProgression.docs.length > 0) {
      // 2. Mettre à jour si elle existe
      const currentDoc = existingProgression.docs[0]
      const currentProgress = currentDoc.progressValue || 0
      const newProgress = Math.min(100, currentProgress + amount) // Capper à 100

      // Mettre à jour seulement si la progression a augmenté
      if (newProgress > currentProgress) {
        const actualGain = newProgress - currentProgress // Gain réel pour cette mise à jour
        console.log(
          `  Updating existing progression from ${currentProgress} to ${newProgress}. ID: ${currentDoc.id}`,
        )
        await payload.update({
          collection: 'userImplementationConceptProgressions',
          id: currentDoc.id,
          data: {
            progressValue: newProgress,
            lastActivityAt: now.toISOString(),
          },
        })
        // Déclencher la propagation vers le concept de base
        await propagateProgressionToBaseConcept(userId, implementationConceptId, actualGain)
      } else {
        console.log(
          `  Progression hasn't increased (${currentProgress} -> ${newProgress}). No update needed.`,
        )
      }
    } else {
      // 3. Créer si elle n'existe pas
      const newProgress = Math.min(100, amount) // Capper à 100
      console.log(`  Creating new progression record with value ${newProgress}.`)
      await payload.create({
        // Garder une référence
        collection: 'userImplementationConceptProgressions',
        data: {
          user: userId,
          implementationConcept: implementationConceptId,
          progressValue: newProgress,
          lastActivityAt: now.toISOString(),
        },
      })
      // Déclencher la propagation vers le concept de base
      await propagateProgressionToBaseConcept(userId, implementationConceptId, newProgress) // Passer le gain initial
    }
  } catch (error) {
    console.error(
      `Error updating/creating UserImplementationConceptProgression for user ${userId}, implConcept ${implementationConceptId}:`,
      error,
    )
  }
}

/**
 * Met à jour ou crée la progression d'un utilisateur pour un Concept abstrait spécifique.
 *
 * @param userId - L'ID de l'utilisateur (Supabase).
 * @param conceptId - L'ID du concept abstrait.
 * @param amount - Le montant de progression à ajouter (sera cappé à 100).
 */
export const updateUserConceptProgression = async (
  userId: string,
  conceptId: number,
  amount: number,
): Promise<void> => {
  if (!userId || !conceptId || amount <= 0) {
    console.warn('Invalid arguments provided to updateUserConceptProgression.')
    return
  }

  console.log(
    `Updating UserConceptProgression for user ${userId}, concept ${conceptId}, amount ${amount}`,
  )
  const payload = await getPayload({ config })
  const now = new Date()

  try {
    // 1. Chercher une progression existante
    const existingProgression = await payload.find({
      collection: 'userConceptProgressions',
      where: {
        user: { equals: userId },
        concept: { equals: conceptId },
      },
      limit: 1,
      depth: 0,
    })

    if (existingProgression.docs.length > 0) {
      // 2. Mettre à jour si elle existe
      const currentDoc = existingProgression.docs[0]
      const currentProgress = currentDoc.progressValue || 0
      const newProgress = Math.min(100, currentProgress + amount)

      if (newProgress > currentProgress) {
        console.log(
          `  Updating existing concept progression from ${currentProgress} to ${newProgress}. ID: ${currentDoc.id}`,
        )
        await payload.update({
          collection: 'userConceptProgressions',
          id: currentDoc.id,
          data: {
            progressValue: newProgress,
            lastActivityAt: now.toISOString(),
          },
        })
        // Possible future logic: propagate from BaseConcept upwards/downwards? Less common.
      } else {
        console.log(
          `  Concept progression hasn't increased (${currentProgress} -> ${newProgress}). No update needed.`,
        )
      }
    } else {
      // 3. Créer si elle n'existe pas
      const newProgress = Math.min(100, amount)
      console.log(`  Creating new concept progression record with value ${newProgress}.`)
      await payload.create({
        collection: 'userConceptProgressions',
        data: {
          user: userId,
          concept: conceptId,
          progressValue: newProgress,
          lastActivityAt: now.toISOString(),
        },
      })
      // Possible future logic
    }
  } catch (error) {
    console.error(
      `Error updating/creating UserConceptProgression for user ${userId}, concept ${conceptId}:`,
      error,
    )
  }
}

/**
 * Propage une partie du gain d'un ImplementationConcept vers son Concept parent abstrait.
 *
 * @param userId - L'ID de l'utilisateur (Supabase).
 * @param implementationConceptId - L'ID du concept implémenté qui a progressé.
 * @param gain - Le montant de progression *réel* ajouté à l'ImplementationConcept.
 */
export const propagateProgressionToBaseConcept = async (
  userId: string,
  implementationConceptId: number,
  gain: number,
): Promise<void> => {
  if (gain <= 0) return // Pas de gain, pas de propagation

  console.log(
    `Propagating gain of ${gain} from implConcept ${implementationConceptId} for user ${userId}`,
  )
  const payload = await getPayload({ config })

  try {
    // 1. Récupérer l'ImplementationConcept pour trouver son parent Concept
    const implConcept = await payload.findByID({
      collection: 'implementationConcepts',
      id: implementationConceptId,
      depth: 1, // Peupler la relation 'concept'
    })

    if (!implConcept || !implConcept.concept || typeof implConcept.concept !== 'object') {
      console.error(
        `Could not find parent Concept for ImplementationConcept ID: ${implementationConceptId}.`,
      )
      return
    }
    const parentConceptId = implConcept.concept.id
    const parentConcept = implConcept.concept as Concept // Type assertion

    console.log(`  Parent Concept ID: ${parentConceptId} (Name: ${parentConcept.name})`)

    // 2. Récupérer la progression actuelle de l'utilisateur sur le Concept parent
    let parentCurrentProgress = 0
    const parentProgression = await payload.find({
      collection: 'userConceptProgressions',
      where: {
        user: { equals: userId },
        concept: { equals: parentConceptId },
      },
      limit: 1,
      depth: 0,
    })

    if (parentProgression.docs.length > 0) {
      parentCurrentProgress = parentProgression.docs[0].progressValue || 0
    }

    // 3. Calculer le gain modulé à appliquer au Concept parent
    // Formule: gain * FACTEUR * (1 - progressionActuelleParent / 100)
    // Cela réduit l'impact sur le parent si celui-ci est déjà bien maîtrisé
    const modulatedGain = gain * PROPAGATION_FACTOR * (1 - parentCurrentProgress / 100)

    if (modulatedGain <= 0) {
      console.log(
        `  Modulated gain for parent concept ${parentConceptId} is negligible (${modulatedGain.toFixed(2)}). No propagation needed.`,
      )
      return
    }

    console.log(
      `  Current parent progress: ${parentCurrentProgress}. Modulated gain to apply: ${modulatedGain.toFixed(2)}`,
    )

    // 4. Appeler la fonction de mise à jour pour le Concept parent
    await updateUserConceptProgression(userId, parentConceptId, modulatedGain)
  } catch (error) {
    console.error(
      `Error propagating progression for user ${userId}, implConcept ${implementationConceptId}:`,
      error,
    )
  }
}
