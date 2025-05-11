'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getUserPartProgress, createCoursePartUserProgression } from '.'
import { getUserChapterProgress, createUserChapterProgress } from '.'
import { CoursePartUserProgression, UserChapterProgress, Chapter } from '@/payload-types'

export type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

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
    depth: 0,
  })

  if (newStatus === 'completed') {
    const chapterResult = await payload.find({
      collection: 'chapters',
      where: {
        parts: { equals: partId },
      },
      limit: 1,
      depth: 0,
    })

    if (chapterResult.docs.length > 0 && chapterResult.docs[0]) {
      const chapterId = chapterResult.docs[0].id
      await checkAndUpdateChapterCompletion(userId, chapterId)
    } else {
      console.warn(`Could not find chapter for part ${partId} to check completion status.`)
    }
  }

  const updatedDoc = await getUserPartProgress(userId, partId)
  if (!updatedDoc) {
    throw new Error(
      `Failed to retrieve updated progress for user ${userId}, part ${partId} after update.`,
    )
  }
  return updatedDoc
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
        part: { in: partIds },
      },
      limit: partIds.length,
      depth: 0,
    })

    const statusMap: Record<number, CompletionStatus> = {}
    progressionRecords.docs.forEach((record: CoursePartUserProgression) => {
      const partIdFromRecord = typeof record.part === 'number' ? record.part : record.part?.id
      if (partIdFromRecord) {
        statusMap[partIdFromRecord] = record.completionStatus
      }
    })

    partIds.forEach((id) => {
      if (!(id in statusMap)) {
        statusMap[id] = 'not_started'
      }
    })

    return statusMap
  } catch (error) {
    console.error(`Error fetching completion statuses for user ${userId}:`, error)
    return {}
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
    progressRecord = await createUserChapterProgress(userId, chapterId)
    if (progressRecord.completionStatus === newStatus) {
      return progressRecord
    }
  }

  if (progressRecord.completionStatus === newStatus) {
    return progressRecord
  }

  const updatedRecord = await payload.update({
    collection: 'userChapterProgress',
    id: progressRecord.id,
    data: { completionStatus: newStatus },
  })

  if (updatedRecord) {
    return updatedRecord as UserChapterProgress
  } else {
    const fallbackRecord = await getUserChapterProgress(userId, chapterId)
    if (!fallbackRecord) {
      throw new Error(
        `Failed to update or find chapter progress for user ${userId}, chapter ${chapterId}`,
      )
    }
    return fallbackRecord
  }
}

/**
 * Checks if all parts within a chapter are completed by a user,
 * and if so, updates the chapter's completion status to 'completed'.
 * @param userId The user ID.
 * @param chapterId The chapter ID.
 */
export async function checkAndUpdateChapterCompletion(
  userId: string,
  chapterId: number,
): Promise<void> {
  const payload = await getPayload({ config })

  try {
    const chapter = await payload.findByID({
      collection: 'chapters',
      id: chapterId,
      depth: 0,
    })

    if (!chapter || typeof chapter !== 'object' || !('parts' in chapter)) {
      console.warn(`Chapter ${chapterId} not found or invalid for completion check.`)
      return
    }

    const partRefs = chapter.parts as (number | { id: number })[] | undefined | null
    if (!partRefs || partRefs.length === 0) {
      return
    }

    const partIds = partRefs.map((ref) => (typeof ref === 'number' ? ref : ref.id))

    const partStatuses = await getAllUserPartCompletionStatusesForChapter(userId, partIds)

    const allPartsCompleted = partIds.every((id) => partStatuses[id] === 'completed')

    if (allPartsCompleted) {
      console.log(
        `All parts completed for chapter ${chapterId}, user ${userId}. Updating chapter status.`,
      )
      await updateUserChapterCompletionStatus(userId, chapterId, 'completed')
    } else {
    }
  } catch (error) {
    console.error(
      `Error checking/updating chapter completion for user ${userId}, chapter ${chapterId}:`,
      error,
    )
  }
}

/**
 * Counts the number of completed parts for a user from a given list of part IDs.
 * @param userId The ID of the user.
 * @param allPartIdsForCourse An array of all part IDs for a specific course.
 * @returns Promise<number> The count of completed parts.
 */
export const getCourseCompletedPartsCount = async (
  userId: string,
  allPartIdsForCourse: number[],
): Promise<number> => {
  if (!userId || !allPartIdsForCourse || allPartIdsForCourse.length === 0) {
    return 0
  }

  try {
    const partStatuses = await getAllUserPartCompletionStatusesForChapter(
      userId,
      allPartIdsForCourse,
    )

    let completedCount = 0
    for (const partId of allPartIdsForCourse) {
      if (partStatuses[partId] === 'completed') {
        completedCount++
      }
    }
    return completedCount
  } catch (error) {
    console.error(
      `Error in getCourseCompletedPartsCount for user ${userId} and parts ${allPartIdsForCourse.join(',')}:`,
      error,
    )
    return 0 // Return 0 in case of an error
  }
}
