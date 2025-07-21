'use server'

import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Chapter } from '@/payload-types'
import { getUserChapterCompletionStatus } from './completion-status' // Import the function to check single chapter status

/**
 * Checks if a user has completed all prerequisite chapters for a target chapter.
 * @param userId The ID of the user. Null if not logged in.
 * @param targetChapterId The ID of the chapter to check prerequisites for.
 * @returns Promise<boolean> True if all prerequisites are met or none exist, false otherwise.
 */
export async function checkChapterPrerequisites(
  userId: string | null,
  targetChapterId: number,
): Promise<boolean> {
  const payload = await getPayload({ config })

  try {
    // 1. Fetch the target chapter
    const targetChapterDoc = await payload.findByID({
      collection: 'chapters',
      id: targetChapterId,
      depth: 1, // Depth might still be needed depending on how relations are stored
    })

    // Explicitly check if the result is a valid Chapter object
    if (!targetChapterDoc || typeof targetChapterDoc !== 'object') {
      console.warn(
        `checkChapterPrerequisites: Chapter with ID ${targetChapterId} not found or invalid.`,
      )
      return false
    }
    // Cast to Chapter type after validation
    const targetChapter = targetChapterDoc as Chapter

    // 2. Check if there are any required chapters
    const requiredChapters = targetChapter.requiredChapters
    if (!requiredChapters || !Array.isArray(requiredChapters) || requiredChapters.length === 0) {
      return true // No prerequisites, chapter is accessible
    }

    // 3. If user is not logged in, they cannot have met prerequisites
    if (!userId) {
      return false
    }

    // 4. Check completion status for each required chapter
    for (const reqChapterRef of requiredChapters) {
      // Handle both ID (number) and populated object cases
      const reqChapterId =
        typeof reqChapterRef === 'number'
          ? reqChapterRef
          : typeof reqChapterRef === 'object' && reqChapterRef !== null && reqChapterRef.id
            ? reqChapterRef.id
            : null

      if (reqChapterId === null) {
        console.warn('Invalid prerequisite chapter reference found:', reqChapterRef)
        continue // Skip invalid references
      }

      const status = await getUserChapterCompletionStatus(userId, reqChapterId)

      // If any prerequisite is not completed, the target chapter is locked
      if (status !== 'completed') {
        return false
      }
    }

    // 5. If the loop completes, all prerequisites are met
    return true
  } catch (error) {
    console.error(
      `Error checking prerequisites for chapter ${targetChapterId}, user ${userId}:`,
      error,
    )
    return false // Default to locked state in case of error
  }
}

/**
 * Marks the solution for a specific course part as viewed (unlocked) by a user.
 * If no progression record exists, it creates one with the solution marked as viewed.
 * @param userId The ID of the user.
 * @param partId The ID of the course part.
 * @returns Promise indicating success or failure.
 */
export async function markSolutionAsUnlocked(
  userId: string,
  partId: number,
): Promise<{ success: boolean; error?: string }> {
  const payload = await getPayload({ config })

  try {
    // 1. Try to find existing progression record
    const { docs: existingProgress } = await payload.find({
      collection: 'coursePartUserProgression',
      where: {
        userId: { equals: userId },
        part: { equals: partId },
      },
      limit: 1,
    })

    if (existingProgress.length > 0) {
      // 2a. If found, update it
      const progressId = existingProgress[0].id
      // Only update if it's not already true
      if (!existingProgress[0].isSolutionUnlocked) {
        await payload.update({
          collection: 'coursePartUserProgression',
          id: progressId,
          data: {
            isSolutionUnlocked: true,
          },
        })
      }
    } else {
      // 2b. If not found, create a new one with solution unlocked
      await payload.create({
        collection: 'coursePartUserProgression',
        data: {
          userId,
          part: partId,
          engagementStatus: 'none',
          completionStatus: 'not_started', // Or potentially 'in_progress' if viewing solution implies starting?
          isSolutionUnlocked: true,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error(`Error marking solution as unlocked for part ${partId}, user ${userId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark solution as unlocked',
    }
  }
}

/**
 * Gets the effective solution unlock status for a specific course part for a user.
 * The solution is considered unlocked if explicitly marked OR if the part is completed.
 * @param userId The ID of the user.
 * @param partId The ID of the course part.
 * @returns Promise<boolean> True if the solution is effectively unlocked, false otherwise.
 */
export async function getSolutionUnlockStatus(userId: string, partId: number): Promise<boolean> {
  const payload = await getPayload({ config })

  try {
    // Fetch the full progress record
    const { docs: existingProgress } = await payload.find({
      collection: 'coursePartUserProgression',
      where: {
        userId: { equals: userId },
        part: { equals: partId },
      },
      limit: 1,
      depth: 0, // No need for relations
    })

    const progressRecord = existingProgress[0]

    if (!progressRecord) {
      return false // No record, so not unlocked and not completed
    }

    // Check if solution is explicitly unlocked OR if part is completed
    const isEffectivelyUnlocked =
      progressRecord.isSolutionUnlocked || progressRecord.completionStatus === 'completed'

    return isEffectivelyUnlocked
  } catch (error) {
    console.error(
      `Error fetching solution unlock status for part ${partId}, user ${userId}:`,
      error,
    )
    return false // Assume locked in case of error
  }
}
