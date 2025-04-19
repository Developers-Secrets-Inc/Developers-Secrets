'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'



export const setUserCurrency = async (userId: string, currency: number): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-currency',
    id: userId,
    data: {
      quantity: currency,
    },
  })
}

export const getUserCurrency = async (userId: string): Promise<number> => {
  const payload = await getPayload({ config })

  const userCurrencyInformations = await payload.find({
    collection: 'user-currency',
    where: {
      userId: { equals: userId },
    },
  })

  return userCurrencyInformations.docs[0].quantity
}
