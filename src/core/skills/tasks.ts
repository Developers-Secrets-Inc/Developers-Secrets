import type { TaskHandler, TaskHandlerArgs } from 'payload'
import { getPayload } from 'payload'
import type { Concept, UserConceptProgressions } from '@/payload-types' // Importer les types nécessaires
import { updateUserConceptProgression } from './progression' // Importer la fonction de mise à jour

// Définir les seuils (ajuster si nécessaire)
const TRIGGER_PROGRESS_THRESHOLD = 50 // Seuil de progression du concept déclencheur pour vérifier les prérequis
const PREREQ_UNLOCK_THRESHOLD = 30 // Seuil en dessous duquel un prérequis peut être débloqué
const PREREQ_TARGET_PROGRESS = 40 // Niveau auquel le prérequis est amené lors du déblocage implicite

// Définir le type pour l'input de notre tâche
type CheckPrerequisitesInput = {
  userId: string
  conceptId: number
}

export const checkAndUpdatePrerequisitesHandler: TaskHandler<
  'checkAndUpdatePrerequisites', // Slug de la tâche
  CheckPrerequisitesInput // Type de l'input
> = async ({ req, job }) => {
  const { userId, conceptId: triggerConceptId } = job.input
  const payload = req.payload

  console.log(
    `TASK [checkAndUpdatePrerequisites v2]: Start for user ${userId}, trigger concept ${triggerConceptId}`,
  )

  try {
    // 1. Obtenir la progression du concept déclencheur
    const triggerProgression = await payload.find({
      collection: 'userConceptProgressions',
      where: {
        user: { equals: userId },
        concept: { equals: triggerConceptId },
      },
      limit: 1,
      depth: 0,
    })

    // Si l'utilisateur n'a aucune progression sur le concept déclencheur, on ne peut rien propager.
    if (triggerProgression.docs.length === 0) {
      console.log(
        `TASK [checkAndUpdatePrerequisites v2]: No progression found for trigger concept ${triggerConceptId}. Stopping check.`,
      )
      return
    }
    const triggerProgress = triggerProgression.docs[0].progressValue || 0
    // On pourrait ajouter un seuil minimal ici si on veut, ex: if (triggerProgress < 10) return;
    console.log(
      `TASK [checkAndUpdatePrerequisites v2]: Trigger concept ${triggerConceptId} progress: ${triggerProgress}`,
    )

    // 2. Récupérer le concept déclencheur pour obtenir ses prérequis
    const triggerConcept = await payload.findByID({
      collection: 'concepts',
      id: triggerConceptId,
      depth: 1, // Pour peupler la relation requiredConcepts
    })

    if (
      !triggerConcept ||
      !triggerConcept.requiredConcepts ||
      triggerConcept.requiredConcepts.length === 0
    ) {
      console.log(
        `TASK [checkAndUpdatePrerequisites v2]: Trigger concept ${triggerConceptId} has no prerequisites defined.`,
      )
      return
    }

    // 3. Itérer sur chaque prérequis
    for (const requiredConceptRelation of triggerConcept.requiredConcepts) {
      const requiredConceptId =
        typeof requiredConceptRelation === 'object'
          ? requiredConceptRelation.id
          : requiredConceptRelation
      if (!requiredConceptId) continue

      console.log(
        `TASK [checkAndUpdatePrerequisites v2]: Checking prerequisite concept ID: ${requiredConceptId}`,
      )

      // 4. Obtenir la progression actuelle de l'utilisateur sur le prérequis
      let prereqProgress = 0
      const prereqProgression = await payload.find({
        collection: 'userConceptProgressions',
        where: {
          user: { equals: userId },
          concept: { equals: requiredConceptId },
        },
        limit: 1,
        depth: 0,
      })

      if (prereqProgression.docs.length > 0) {
        prereqProgress = prereqProgression.docs[0].progressValue || 0
      }
      console.log(`  -> Prerequisite ${requiredConceptId} current progress: ${prereqProgress}`)

      // 5. Logique de mise à niveau : Si le prérequis est moins maîtrisé que le concept parent
      if (prereqProgress < triggerProgress) {
        // Calculer le montant pour amener le prérequis au niveau du parent
        const amountToUpdate = triggerProgress - prereqProgress
        // On pourrait vouloir capper légèrement, ex: Math.min(triggerProgress, 95) - prereqProgress
        // pour ne pas donner 100% trop facilement. Pour l'instant, on aligne.

        console.log(
          `  -> Update required for prerequisite ${requiredConceptId}. Current: ${prereqProgress}, Target: ${triggerProgress}. Updating by ${amountToUpdate.toFixed(2)}`,
        )

        // 6. Mettre à jour la progression du prérequis
        // Note: updateUserConceptProgression gère déjà le cap à 100
        await updateUserConceptProgression(userId, requiredConceptId, amountToUpdate)

        // 7. Mettre en file d'attente un nouveau job pour VÉRIFIER les prérequis de CE prérequis (récursion)
        // C'est crucial car sa progression a changé !
        console.log(`  -> Queueing prerequisite check job for concept ${requiredConceptId}`)
        await payload.jobs.queue({
          task: 'checkAndUpdatePrerequisites', // La même tâche
          input: { userId: userId, conceptId: requiredConceptId }, // Avec l'ID du prérequis
          queue: 'skill-prerequisites', // Dans la même queue
        })
      } else {
        console.log(
          `  -> Prerequisite ${requiredConceptId} progress (${prereqProgress}) is >= trigger concept progress (${triggerProgress}). No update needed.`,
        )
      }
    }

    console.log(
      `TASK [checkAndUpdatePrerequisites v2]: Finished checks for user ${userId}, trigger concept ${triggerConceptId}`,
    )
  } catch (error) {
    console.error(
      `TASK [checkAndUpdatePrerequisites v2]: Error processing for user ${userId}, trigger concept ${triggerConceptId}:`,
      error,
    )
    throw error // Relancer pour marquer le job comme échoué
  }
}
