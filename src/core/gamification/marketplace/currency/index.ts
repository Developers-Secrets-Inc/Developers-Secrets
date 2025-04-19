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
