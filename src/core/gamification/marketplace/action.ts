'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result'
import { addItemToInventory } from '../inventory'
import { getUserCurrency, setUserCurrency } from './currency'
import { MarketplaceItem } from '@/payload-types'
import { Item } from '@/payload-types'

export const buyItem = async (
  itemId: number,
  price: number,
): Promise<{ success: boolean; error?: string }> => {
  const payload = await getPayload({ config })

  try {
    // Get current user
    const user = await getUser()
    if (isFailure(user)) {
      return { success: false, error: 'User not found' }
    }
    const userId = user.value.id

    // Find the MarketplaceItem document linked to the itemId
    const marketplaceEntries = await payload.find({
      collection: 'marketplace-items',
      where: {
        'item.id': { equals: itemId },
      },
      limit: 1,
      depth: 1,
    })

    if (marketplaceEntries.docs.length === 0) {
      return { success: false, error: 'Item not found in marketplace' }
    }
    const marketplaceItem = marketplaceEntries.docs[0] as MarketplaceItem
    const item = marketplaceItem.item as Item

    if (!item) {
      return { success: false, error: 'Item details missing from marketplace item' }
    }

    // --- Check for existing passive item of the same type ---
    if (item.activationMode === 'passive') {
      const existingPassiveItems = await payload.find({
        collection: 'user-items',
        where: {
          and: [
            { userId: { equals: userId } },
            { 'item.activationMode': { equals: 'passive' } },
            { 'item.type': { equals: item.type } },
            { quantity: { greater_than: 0 } },
          ],
        },
        limit: 1,
        depth: 0,
      })

      if (existingPassiveItems.docs.length > 0) {
        return { success: false, error: `You already own a passive ${item.type} boost.` }
      }
    }
    // --- End of check ---

    // Check if user has enough currency (use marketplace item price for safety)
    const actualPrice = marketplaceItem.price
    const currentCurrency = await getUserCurrency(userId)
    if (currentCurrency < actualPrice) {
      return { success: false, error: 'Not enough currency' }
    }

    // Update user currency
    await setUserCurrency(userId, currentCurrency - actualPrice)

    // Add item to inventory
    await addItemToInventory(userId, itemId)

    // Increment purchase count for the marketplace item
    await payload.update({
      collection: 'marketplace-items',
      id: marketplaceItem.id,
      data: {
        purchaseCount: (marketplaceItem.purchaseCount || 0) + 1,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error buying item:', error)
    return { success: false, error: 'Failed to buy item' }
  }
}
