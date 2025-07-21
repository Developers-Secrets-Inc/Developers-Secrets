'use server'

import 'server-only'

import { createNotification } from '@/core/notifications'; // Adjust path if necessary
import { Achievement, Item } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { addItemToInventory } from '../inventory'; // Adjust path if necessary
import { getItem } from '../items'; // Import getItem
import { addExperience } from '../level'; // Adjust path if necessary
import { addCurrency } from '../marketplace/currency'; // Adjust path if necessary
import { getAchievementById, getAchievementsByType } from './index'
import {
    getUserAchievementProgress,
    setUserAchievementTier,
    updateAchievementProgressRecord,
} from './user-progress'

// ========== Internal Helper Functions ==========

/**
 * Grants the rewards for a specific achievement tier.
 */
async function _grantTierRewards(
  userId: string,
  tier: Achievement['tiers'][number],
): Promise<{ rewardString: string }> {
  let rewardString = ''

  // Grant XP
  if (tier.rewardXp && tier.rewardXp > 0) {
    await addExperience(userId, tier.rewardXp)
    rewardString += `+${tier.rewardXp} XP`
  }

  // Grant Coins
  if (tier.rewardCoins && tier.rewardCoins > 0) {
    // Assuming 'coins' is the currency slug - adjust if needed
    await addCurrency(userId, tier.rewardCoins, 'Achievement Tier Reward')
    rewardString += `${rewardString ? ', ' : ''}+${tier.rewardCoins} Coins`
  }

  // Grant Item Reward
  if (tier.rewardItem) {
    let item: Item | null = null
    let itemId: number | string | undefined = undefined

    if (typeof tier.rewardItem === 'object' && tier.rewardItem !== null) {
      item = tier.rewardItem as Item
      itemId = item.id
    } else if (typeof tier.rewardItem === 'number' || typeof tier.rewardItem === 'string') {
      itemId = tier.rewardItem
    }

    if (itemId) {
      try {
        await addItemToInventory(userId, itemId as number, 1) // Assuming addItemToInventory expects number
        // Fetch item details if not already populated, for the notification string
        if (!item) {
          item = await getItem(itemId as number) // Assuming getItem expects number
        }
        if (item) {
          rewardString += `${rewardString ? ', ' : ''}+1 ${item.name}`
        }
      } catch (itemError) {
        console.error(`Failed to add item reward ${itemId} for user ${userId}:`, itemError)
      }
    }
  }

  return { rewardString }
}

/**
 * Handles the logic when a user unlocks a new achievement tier.
 */
async function _handleTierUnlock(
  userId: string,
  achievement: Achievement,
  newTierIndex: number,
): Promise<void> {
  const tier = achievement.tiers?.[newTierIndex]
  if (!tier) return // Should not happen if called correctly

  // 1. Update the tier index in the progress record
  await setUserAchievementTier(userId, achievement.id, newTierIndex)

  // 2. Grant Rewards
  const { rewardString } = await _grantTierRewards(userId, tier)

  // 3. Create Notification
  const tierName = tier.name.charAt(0).toUpperCase() + tier.name.slice(1)
  await createNotification({
    userId: userId,
    content: `Achievement Unlocked: ${achievement.title} (${tierName})! ${rewardString ? `(${rewardString})` : ''}`,
    importance: 'medium',
    type: 'achievement', // Or a suitable type
    // Optional: Link to achievements page?
    // link: '/profile/achievements'
  })

  // 4. Handle Next Achievement (Optional - Basic Logging)
  if (newTierIndex === (achievement.tiers?.length ?? 0) - 1 && achievement.nextAchievement) {
    console.log(
      `User ${userId} completed final tier of ${achievement.title}. Next achievement ID: ${achievement.nextAchievement}`,
    )
    // Consider triggering progress for the next achievement here if desired.
    // Be cautious about infinite loops or unintended consequences.
  }
}

// ========== Main Server Action ==========

/**
 * Tracks progress towards achievements based on a specific event type and quantity.
 * If progress crosses a tier threshold, unlocks the tier and grants rewards.
 *
 * @param userId - The ID of the user.
 * @param achievementType - The type of achievement event (e.g., 'exercises_completed').
 * @param quantity - The amount to increment the progress by.
 */
export const trackAchievementProgress = async (
  userId: string,
  achievementType: Achievement['type'],
  quantity: number,
): Promise<void> => {
  if (!userId || !achievementType || quantity <= 0) {
    console.warn('[Achievements] trackAchievementProgress called with invalid arguments.')
    return
  }

  const payload = await getPayload({ config })

  // Get all active achievements of the specified type
  const relevantAchievements = await getAchievementsByType(achievementType)

  if (!relevantAchievements || relevantAchievements.length === 0) {
    return // No active achievements of this type
  }

  for (const baseAchievement of relevantAchievements) {
    try {
      // Get full achievement details (assuming getAchievementById returns with tiers)
      const achievement = await getAchievementById(baseAchievement.id)
      if (!achievement || !achievement.tiers || achievement.tiers.length === 0) {
        console.warn(
          `[Achievements] Achievement ${baseAchievement.id} is missing or has no tiers. Skipping.`,
        )
        continue
      }

      // Get current progress (or null if none)
      const userProgress = await getUserAchievementProgress(userId, achievement.id)
      const currentTierIndex = userProgress?.currentTierIndex ?? -1
      const currentProgressValue = userProgress?.currentProgress ?? 0

      // Skip if achievement already maxed out
      if (currentTierIndex >= achievement.tiers.length - 1) {
        continue
      }

      // Calculate new progress value without updating DB yet
      const newProgressValue = currentProgressValue + quantity

      // Determine the *next* potential tier to check against
      const nextTierIndexToCheck = currentTierIndex + 1
      const nextTier = achievement.tiers[nextTierIndexToCheck]

      // Only proceed if there is a next tier and the threshold is potentially met
      if (nextTier && newProgressValue >= nextTier.threshold) {
        // Update (or create) the progress record *now* that we know it might unlock a tier
        const updatedProgressRecord = await updateAchievementProgressRecord(
          userId,
          achievement.id,
          quantity,
        )

        // Re-check threshold with the actual updated progress value
        if (updatedProgressRecord.currentProgress >= nextTier.threshold) {
          await _handleTierUnlock(userId, achievement, nextTierIndexToCheck)
        }
      } else {
        // If no tier is unlocked, still update the progress if the user has started
        // (or create if it's the first time)
        if (userProgress || quantity > 0) {
          // Ensure we create if progress > 0
          await updateAchievementProgressRecord(userId, achievement.id, quantity)
        }
      }
    } catch (error) {
      console.error(
        `[Achievements] Error processing achievement ${baseAchievement.id} for user ${userId}:`,
        error,
      )
      // Continue to the next achievement even if one fails
    }
  }
}
