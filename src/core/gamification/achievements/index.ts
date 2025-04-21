'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Achievement } from '@/payload-types'

// ========== Achievement Getters ==========

/**
 * Fetches all active achievements.
 */
export const getAchievements = async (): Promise<Achievement[]> => {
  const payload = await getPayload({ config })

  const achievements = await payload.find({
    collection: 'achievements',
    where: {
      isActive: { equals: true }, // Only fetch active achievements
    },
    limit: 1000, // Adjust limit as needed
  })

  return achievements.docs
}

/**
 * Fetches a specific achievement by its ID.
 */
export const getAchievementById = async (
  achievementId: string | number,
): Promise<Achievement | null> => {
  const payload = await getPayload({ config })

  try {
    const achievement = await payload.findByID({
      collection: 'achievements',
      id: achievementId,
    })
    return achievement
  } catch (error) {
    // findByID throws an error if not found
    return null
  }
}

/**
 * Fetches all active achievements of a specific type.
 */
export const getAchievementsByType = async (
  achievementType: Achievement['type'],
): Promise<Achievement[]> => {
  const payload = await getPayload({ config })

  const achievements = await payload.find({
    collection: 'achievements',
    where: {
      type: { equals: achievementType },
      isActive: { equals: true }, // Only fetch active achievements
    },
    limit: 1000, // Adjust limit as needed
  })

  return achievements.docs
}
