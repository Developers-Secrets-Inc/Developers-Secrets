'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

export const setUserCurrency = async (userId: string, currency: number): Promise<void> => {
  const payload = await getPayload({ config })

  // First check if the user currency record exists
  const existingCurrency = await payload.find({
    collection: 'user-currency',
    where: {
      userId: { equals: userId },
    },
  })

  if (existingCurrency.docs.length > 0) {
    // Update existing record using its document ID
    await payload.update({
      collection: 'user-currency',
      id: existingCurrency.docs[0].id,
      data: {
        quantity: currency,
      },
    })
  } else {
    // Create new record
    await payload.create({
      collection: 'user-currency',
      data: {
        userId,
        quantity: currency,
      },
    })
  }
}

export const getUserCurrency = async (userId: string): Promise<number> => {
  const payload = await getPayload({ config })

  const userCurrencyInformations = await payload.find({
    collection: 'user-currency',
    where: {
      userId: { equals: userId },
    },
  })

  // Return 0 if no currency record exists
  return userCurrencyInformations.docs[0]?.quantity || 0
}

/**
 * Adds a specified amount of currency to a user's balance and records the transaction.
 * Ensures the user record exists before attempting to update.
 */
export const addCurrency = async (
  userId: string,
  amountToAdd: number,
  description: string,
): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
  if (amountToAdd <= 0) {
    return { success: false, error: 'Amount to add must be positive.' }
  }

  const payload = await getPayload({ config })

  try {
    // Find the user's currency record
    const existingCurrencyResult = await payload.find({
      collection: 'user-currency',
      where: {
        userId: { equals: userId },
      },
      limit: 1,
    })

    let userCurrencyDoc: any // Use any for flexibility, or define a specific type
    let currentBalance: number

    if (existingCurrencyResult.docs.length > 0) {
      userCurrencyDoc = existingCurrencyResult.docs[0]
      currentBalance = userCurrencyDoc.quantity || 0
    } else {
      // If no record exists, create one with the initial amount
      console.log(`Creating currency record for user ${userId} with initial amount ${amountToAdd}`)
      userCurrencyDoc = await payload.create({
        collection: 'user-currency',
        data: {
          userId,
          quantity: amountToAdd,
          transactionHistory: [
            {
              timestamp: new Date().toISOString(),
              type: 'earn',
              amount: amountToAdd,
              description: description || 'Initial balance',
            },
          ],
        },
      })
      return { success: true, newBalance: amountToAdd }
    }

    // Calculate new balance
    const newBalance = currentBalance + amountToAdd

    // Prepare transaction data
    const newTransaction = {
      timestamp: new Date().toISOString(),
      type: 'earn' as const,
      amount: amountToAdd,
      description: description,
    }

    // Update the user currency record with new balance and transaction
    await payload.update({
      collection: 'user-currency',
      id: userCurrencyDoc.id,
      data: {
        quantity: newBalance,
        // Add new transaction to the beginning of the history array
        transactionHistory: [newTransaction, ...(userCurrencyDoc.transactionHistory || [])],
      },
    })

    return { success: true, newBalance: newBalance }
  } catch (error) {
    console.error(`Error adding currency for user ${userId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, error: `Failed to add currency: ${errorMessage}` }
  }
}
