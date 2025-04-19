'use server'

import 'server-only'

import { getSessionUser } from '@/core/user'
import { addItemToInventory } from '../inventory'
import { getUserCurrency, setUserCurrency } from './currency'

export const buyItem = async (
  itemId: number,
  price: number,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get current user
    const userResult = await getSessionUser()
    if (!userResult.success) {
      return { success: false, error: 'User not found' }
    }
    const userId = userResult.value.id

    // Check if user has enough currency
    const currentCurrency = await getUserCurrency(userId)
    if (currentCurrency < price) {
      return { success: false, error: 'Not enough currency' }
    }

    // Update user currency
    await setUserCurrency(userId, currentCurrency - price)

    // Add item to inventory
    await addItemToInventory(userId, itemId)

    return { success: true }
  } catch (error) {
    console.error('Error buying item:', error)
    return { success: false, error: 'Failed to buy item' }
  }
}
