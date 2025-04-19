'use server'

import 'server-only'

import { UserItem } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getItem } from '../items'
import { findExistingActiveEffect } from '../effects'

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
  const item = await getItem(itemId)

  if (!item) {
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
  })

  return newUserItem
}

export const consumeItem = async (
  userItemId: number,
): Promise<{ success: boolean; error?: string }> => {
  const payload = await getPayload({ config })

  try {
    // Get the user item
    const userItem = await payload.findByID({
      collection: 'user-items',
      id: userItemId,
      depth: 1,
    })

    if (!userItem) {
      return { success: false, error: 'Item not found' }
    }

    if (userItem.quantity <= 0) {
      return { success: false, error: 'No items left to consume' }
    }

    // Get the item details
    const item = userItem.item as any
    if (!item) {
      return { success: false, error: 'Item details not found' }
    }

    let effectApplied = false

    // Create or update active effect if needed
    if (item.activationMode === 'consumableDuration') {
      const existingEffect = await findExistingActiveEffect(userItem.userId, item.type)

      if (existingEffect) {
        // An effect of this type is already active
        if (existingEffect.multiplier !== (item.multiplier || 1)) {
          // Multipliers are different, prevent consumption
          return {
            success: false,
            error: 'An effect of this type with a different multiplier is already active.',
          }
        } else {
          // Multipliers are the same, stack duration
          const existingExpiry = new Date(existingEffect.expiresAt)
          const newExpiry = new Date(existingExpiry.getTime() + (item.duration || 0) * 1000)

          await payload.update({
            collection: 'active-effects',
            id: existingEffect.id,
            data: {
              expiresAt: newExpiry.toISOString(),
            },
          })
          effectApplied = true
        }
      } else {
        // No active effect of this type, create a new one
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
        effectApplied = true
      }
    } else {
      // Handle other activation modes if necessary (e.g., instant)
      // For now, we assume only consumableDuration affects active effects
      effectApplied = true // Mark as handled if not consumableDuration
    }

    // Only decrease quantity if the effect logic was handled successfully
    if (effectApplied) {
      await payload.update({
        collection: 'user-items',
        id: userItemId,
        data: {
          quantity: userItem.quantity - 1,
        },
      })
      return { success: true }
    } else {
      // Should not happen with current logic, but as a safeguard
      return { success: false, error: 'Failed to apply item effect.' }
    }
  } catch (error) {
    console.error('Error consuming item:', error)
    return { success: false, error: 'Failed to consume item' }
  }
}
