'use server'

import 'server-only'

import { UserItem, Item } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getItem } from '../items'
import { findExistingActiveEffect } from '../effects'
import { addCurrency } from '../marketplace/currency'
import { addExperience } from '../level'

// Helper function to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const getUserItem = async (userId: string, itemId: number): Promise<UserItem | null> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'user-items',
    where: {
      and: [
        {
          userId: {
            equals: userId,
          },
        },
        {
          item: {
            equals: itemId,
          },
        },
      ],
    },
    depth: 1,
  })

  return result.docs[0] || null
}

export const updateUserItem = async (userItemId: number, quantity: number): Promise<UserItem> => {
  const payload = await getPayload({ config })

  const updatedUserItem = await payload.update({
    collection: 'user-items',
    id: userItemId,
    data: {
      quantity,
    },
  })

  return updatedUserItem
}

export const getUserInventory = async (userId: string): Promise<UserItem[]> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'user-items',
    where: {
      userId: {
        equals: userId,
      },
    },
    depth: 1,
  })

  return result.docs
}

export const addItemToInventory = async (
  userId: string,
  itemId: number,
  quantity: number = 1,
): Promise<UserItem> => {
  const payload = await getPayload({ config })

  // First check if the item exists
  const itemDetails = await getItem(itemId)

  if (!itemDetails) {
    throw new Error(`Item with ID ${itemId} not found`)
  }

  // Check if user already has this item
  const existingUserItem = await getUserItem(userId, itemId)

  if (existingUserItem) {
    // Update existing item quantity
    return updateUserItem(existingUserItem.id, existingUserItem.quantity + quantity)
  }

  // Create new user item
  const newUserItem = await payload.create({
    collection: 'user-items',
    data: {
      userId,
      item: itemId,
      quantity,
    },
    depth: 1,
  })

  return newUserItem
}

// Updated RewardSummary type
type RewardSummary = {
  coins: number
  xp: number
  items: {
    common: Item[]
    rare: Item[]
    epic: Item[]
    legendary: Item[]
  }
}

// Helper function to get random number in a range
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const consumeItem = async (
  userItemId: number,
): Promise<{ success: boolean; error?: string; rewards?: RewardSummary }> => {
  const payload = await getPayload({ config })

  try {
    // Get the user item with populated item details
    const userItem = await payload.findByID({
      collection: 'user-items',
      id: userItemId,
      depth: 1,
    })

    if (!userItem) {
      return { success: false, error: 'Item not found in inventory' }
    }

    if (userItem.quantity <= 0) {
      return { success: false, error: 'No items left to consume' }
    }

    // Get the item details (already populated due to depth: 1)
    const item = userItem.item as Item | null
    if (!item) {
      return { success: false, error: 'Item details not found' }
    }

    // Initialize rewards structure
    const rewards: RewardSummary = {
      coins: 0,
      xp: 0,
      items: { common: [], rare: [], epic: [], legendary: [] },
    }
    let consumeSuccessful = false

    // --- Chest Opening Logic ---
    if (item.type === 'chest') {
      const rewardSettings = item.chestRewards
      if (!rewardSettings) {
        return { success: false, error: 'Chest reward data missing' }
      }

      // --- Grant Coins --- (Ensure minCoins <= maxCoins)
      const minCoins = rewardSettings.minCoins ?? 0
      const maxCoins = rewardSettings.maxCoins ?? minCoins
      if (maxCoins >= minCoins && maxCoins > 0) {
        const coinsToAdd = getRandomInt(minCoins, maxCoins)
        if (coinsToAdd > 0) {
          const currencyResult = await addCurrency(userItem.userId, coinsToAdd, 'Chest Opening')
          if (currencyResult.success) {
            rewards.coins = coinsToAdd
          } else {
            console.error('Failed to add currency from chest:', currencyResult.error)
            // Decide if this failure should stop the whole process? For now, continue.
          }
        }
      }

      // --- Grant XP --- (Ensure minXp <= maxXp)
      const minXp = rewardSettings.minXp ?? 0
      const maxXp = rewardSettings.maxXp ?? minXp
      if (maxXp >= minXp && maxXp > 0) {
        const xpToAdd = getRandomInt(minXp, maxXp)
        if (xpToAdd > 0) {
          try {
            await addExperience(userItem.userId, xpToAdd)
            rewards.xp = xpToAdd
          } catch (xpError) {
            console.error('Failed to add experience from chest:', xpError)
            // Decide if this failure should stop the whole process? For now, continue.
          }
        }
      }

      // --- Grant Items ---
      const rarities: (keyof RewardSummary['items'])[] = ['common', 'rare', 'epic', 'legendary']
      const currentUserInventory = await getUserInventory(userItem.userId)
      const ownedPassiveItemTypes = new Set(
        currentUserInventory
          .filter((invItem) => {
            const details = invItem.item as Item | null
            return details && details.activationMode === 'passive' && invItem.quantity > 0
          })
          .map((invItem) => (invItem.item as Item).type),
      )

      for (const rarity of rarities) {
        const countKey = `${rarity}ItemsCount` as keyof typeof rewardSettings
        const count = rewardSettings[countKey]

        if (count > 0) {
          const potentialItemsResult = await payload.find({
            collection: 'items',
            where: {
              and: [
                { rarity: { equals: rarity } },
                { type: { not_equals: 'chest' } },
                { isActive: { equals: true } },
              ],
            },
            limit: 0,
            depth: 1,
          })

          const filteredPotentialItems = potentialItemsResult.docs.filter((potentialItem) => {
            if (potentialItem.activationMode === 'passive') {
              return !ownedPassiveItemTypes.has(potentialItem.type)
            }
            return true
          })

          if (filteredPotentialItems.length > 0) {
            const shuffledItems = shuffleArray(filteredPotentialItems)
            const itemsToGrant = shuffledItems.slice(0, count)

            for (const itemToGrant of itemsToGrant) {
              await addItemToInventory(userItem.userId, itemToGrant.id, 1)
              rewards.items[rarity].push(itemToGrant)
            }
          }
        }
      }
      consumeSuccessful = true
      // Chest is consumed, quantity decrease happens at the end
    } else if (item.activationMode === 'consumableDuration') {
      // --- Existing Consumable Duration Logic ---
      const existingEffect = await findExistingActiveEffect(userItem.userId, item.type)

      if (existingEffect) {
        if (existingEffect.multiplier !== (item.multiplier || 1)) {
          return {
            success: false,
            error: 'An effect of this type with a different multiplier is already active.',
          }
        } else {
          const existingExpiry = new Date(existingEffect.expiresAt)
          const newExpiry = new Date(existingExpiry.getTime() + (item.duration || 0) * 1000)
          await payload.update({
            collection: 'active-effects',
            id: existingEffect.id,
            data: { expiresAt: newExpiry.toISOString() },
          })
          consumeSuccessful = true
        }
      } else {
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + (item.duration || 0))
        await payload.create({
          collection: 'active-effects',
          data: {
            userId: userItem.userId,
            effectType: item.type,
            multiplier: item.multiplier || 1,
            expiresAt: expiresAt.toISOString(),
            activatedAt: new Date().toISOString(),
          },
        })
        consumeSuccessful = true
      }
    } else if (item.activationMode === 'consumableInstant') {
      // --- Logic for other instant consumables (like streak restore) can go here ---
      // For now, just mark as consumed successfully
      console.log(`Consumed instant item: ${item.name} (Type: ${item.type})`)
      // TODO: Implement specific logic for streak restore, etc.
      if (item.type === 'streakRestore') {
        // Placeholder: Add logic to restore streak
        console.log('Streak restore logic to be implemented.')
      }
      consumeSuccessful = true
    } else {
      // Non-consumable items (passive) cannot be consumed
      return { success: false, error: 'This item cannot be consumed.' }
    }

    // --- Decrease Quantity and Return Result ---
    if (consumeSuccessful) {
      await payload.update({
        collection: 'user-items',
        id: userItemId,
        data: {
          quantity: userItem.quantity - 1,
        },
      })
      // Return rewards only if it was a chest and some rewards were actually given
      const hasRewards =
        rewards.coins > 0 ||
        rewards.xp > 0 ||
        Object.values(rewards.items).some((arr) => arr.length > 0)
      return { success: true, rewards: item.type === 'chest' && hasRewards ? rewards : undefined }
    } else {
      // Should only happen if an unexpected case occurs
      return { success: false, error: 'Failed to apply item effect.' }
    }
  } catch (error) {
    console.error('Error consuming item:', error)
    return { success: false, error: 'An unexpected error occurred while consuming the item' }
  }
}
