'use server'

import 'server-only'

import { UserAchievementProgress } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

// ========== User Achievement Progress Getters ==========

/**
 * Fetches a specific achievement progress record for a user.
 */
export const getUserAchievementProgress = async (
  userId: string,
  achievementId: number,
): Promise<UserAchievementProgress | null> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'user-achievement-progress',
    where: {
      userId: { equals: userId },
      achievement: { equals: achievementId },
    },
    limit: 1,
  })

  return result.docs.length > 0 ? result.docs[0] : null
}

/**
 * Fetches all achievement progress records for a user.
 */
export const getAllUserAchievementProgress = async (
  userId: string,
  includeAchievementData: boolean = false,
): Promise<UserAchievementProgress[]> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'user-achievement-progress',
    where: {
      userId: { equals: userId },
    },
    depth: includeAchievementData ? 1 : 0, // Control if full achievement data is embedded
    limit: 1000, // Adjust limit as needed
  })

  return result.docs
}

// ========== User Achievement Progress Management ==========

/**
 * Creates or updates a user's progress for a specific achievement.
 * Increases the current progress by the given increment.
 * Returns the updated or newly created progress record.
 */
export const updateAchievementProgressRecord = async (
  userId: string,
  achievementId: number,
  progressIncrement: number,
): Promise<UserAchievementProgress> => {
  const payload = await getPayload({ config })
  const existingProgress = await getUserAchievementProgress(userId, achievementId)

  if (existingProgress) {
    // Update existing progress
    const updatedProgress = await payload.update({
      collection: 'user-achievement-progress',
      id: existingProgress.id,
      data: {
        currentProgress: existingProgress.currentProgress + progressIncrement,
      },
    })
    return updatedProgress
  } else {
    // Create new progress record
    const newProgress = await payload.create({
      collection: 'user-achievement-progress',
      data: {
        userId,
        achievement: achievementId,
        currentProgress: progressIncrement,
        currentTierIndex: -1, // Initial state
      },
    })
    return newProgress
  }
}

/**
 * Updates the achieved tier index for a specific user achievement progress record.
 */
export const setUserAchievementTier = async (
  userId: string,
  achievementId: number,
  newTierIndex: number,
): Promise<void> => {
  const payload = await getPayload({ config })
  const existingProgress = await getUserAchievementProgress(userId, achievementId)

  if (!existingProgress) {
    console.error(
      `Cannot set tier for non-existent progress: User ${userId}, Achievement ${achievementId}`,
    )
    return
  }

  // Avoid unnecessary updates if tier is already set or new index is invalid
  if (existingProgress.currentTierIndex === newTierIndex || newTierIndex < 0) {
    return
  }

  await payload.update({
    collection: 'user-achievement-progress',
    id: existingProgress.id,
    data: {
      currentTierIndex: newTierIndex,
    },
  })
}
