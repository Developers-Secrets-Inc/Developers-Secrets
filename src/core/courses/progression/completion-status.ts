'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getUserPartProgress, createCoursePartUserProgression } from '.'
import { getUserChapterProgress, createUserChapterProgress } from '.'
import { CoursePartUserProgression, UserChapterProgress } from '@/payload-types'

type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

export const getUserPartCompletionStatus = async (
  userId: string,
  partId: number,
): Promise<CompletionStatus> => {
  const userPartProgress = await getUserPartProgress(userId, partId)
  return userPartProgress ? userPartProgress.completionStatus : 'not_started'
}

export const updateUserPartCompletionStatus = async (
  userId: string,
  partId: number,
  newStatus: CompletionStatus,
): Promise<CoursePartUserProgression> => {
  const payload = await getPayload({ config })

  if (!(await getUserPartProgress(userId, partId))) {
    await createCoursePartUserProgression(userId, partId)
  }

  const result = await payload.update({
    collection: 'coursePartUserProgression',
    where: { userId: { equals: userId }, part: { equals: partId } },
    data: { completionStatus: newStatus },
  })

  return result.docs[0]
}

/**
 * Récupère les statuts de complétion pour plusieurs parties d'un chapitre pour un utilisateur donné.
 * @param userId L'ID de l'utilisateur.
 * @param partIds Un tableau des ID des parties du chapitre.
 * @returns Un objet Record où la clé est l'ID de la partie et la valeur est le statut de complétion.
 */
export const getAllUserPartCompletionStatusesForChapter = async (
  userId: string,
  partIds: number[],
): Promise<Record<number, CompletionStatus>> => {
  if (!userId || partIds.length === 0) {
    return {}
  }

  const payload = await getPayload({ config })

  try {
    const progressionRecords = await payload.find({
      collection: 'coursePartUserProgression',
      where: {
        userId: { equals: userId },
        part: { in: partIds }, // Utiliser l'opérateur 'in'
      },
      limit: partIds.length, // Limiter au nombre de parties demandées
      depth: 0, // Pas besoin de peupler les relations ici
    })

    const statusMap: Record<number, CompletionStatus> = {}
    progressionRecords.docs.forEach((record) => {
      // Assurer que 'part' est un nombre (ID)
      const partId = typeof record.part === 'number' ? record.part : record.part.id
      if (partId) {
        statusMap[partId] = record.completionStatus
      }
    })

    // Pour les parties sans enregistrement, le statut est 'not_started' par défaut (géré côté appelant)
    return statusMap
  } catch (error) {
    console.error(`Error fetching completion statuses for user ${userId}:`, error)
    return {} // Retourner un objet vide en cas d'erreur
  }
}

/**
 * Gets the completion status for a specific chapter for a user.
 * @param userId The user ID.
 * @param chapterId The chapter ID.
 * @returns The completion status ('not_started', 'in_progress', 'completed').
 */
export const getUserChapterCompletionStatus = async (
  userId: string,
  chapterId: number,
): Promise<CompletionStatus> => {
  const userChapterProgress = await getUserChapterProgress(userId, chapterId)
  return userChapterProgress ? userChapterProgress.completionStatus : 'not_started'
}

/**
 * Updates the completion status for a specific chapter for a user.
 * Creates the progress record if it doesn't exist.
 * @param userId The user ID.
 * @param chapterId The chapter ID.
 * @param newStatus The new completion status.
 * @returns The updated UserChapterProgress document.
 */
export const updateUserChapterCompletionStatus = async (
  userId: string,
  chapterId: number,
  newStatus: CompletionStatus,
): Promise<UserChapterProgress> => {
  const payload = await getPayload({ config })

  let progressRecord = await getUserChapterProgress(userId, chapterId)

  if (!progressRecord) {
    // Create the record if it doesn't exist
    progressRecord = await createUserChapterProgress(userId, chapterId)
    // If the initial creation sets the desired status, we might return early
    if (progressRecord.completionStatus === newStatus) {
      return progressRecord
    }
  }

  // If the status is already correct, no need to update
  if (progressRecord.completionStatus === newStatus) {
    return progressRecord
  }

  // Update the existing record
  const updatedRecord = await payload.update({
    collection: 'userChapterProgress',
    id: progressRecord.id, // Use the ID of the existing/created record
    data: { completionStatus: newStatus },
    // Optional: Add depth: 0 if relations are not needed
  })

  // Ensure the correct type is returned after update
  // Payload v3 update might return the updated doc directly
  // Adjust based on actual Payload return type if necessary
  if (updatedRecord) {
    return updatedRecord as UserChapterProgress // Cast if needed
  } else {
    // This case should theoretically not happen if creation/update is successful
    // Fetch it again as a fallback
    const fallbackRecord = await getUserChapterProgress(userId, chapterId)
    if (!fallbackRecord) {
      throw new Error(
        `Failed to update or find chapter progress for user ${userId}, chapter ${chapterId}`,
      )
    }
    return fallbackRecord
  }
}
