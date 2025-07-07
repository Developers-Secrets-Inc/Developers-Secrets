'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { UserAiCredit } from '@/payload-types'

const createUserAICredits = async (userId: string): Promise<UserAiCredit> => {
  const payload = await getPayload({ config })
  const userAICredits = await payload.create({
    collection: 'user-ai-credits',
    data: {
      userId,
      balance: 0,
    },
  })
  return userAICredits
}

const getUserAICredits = async (userId: string): Promise<UserAiCredit | null> => {
  const payload = await getPayload({ config })
  const userAICredits = await payload.find({
    collection: 'user-ai-credits',
    where: {
      userId: {
        equals: userId,
      },
    },
  })
  return userAICredits.docs[0] ?? null
}

export const getOrCreateUserAICredits = async (userId: string): Promise<UserAiCredit> => {
  const userAICredits = await getUserAICredits(userId)
  if (userAICredits) {
    return userAICredits
  }
  return createUserAICredits(userId)
}

export const getRemainingCredits = async (userId: string): Promise<number> => {
  const payload = await getPayload({ config })
  const userAICredits = await payload.find({
    collection: 'user-ai-credits',
    where: {
      userId: {
        equals: userId,
      },
    },
    select: {
      balance: true,
    },
    depth: 0,
  })
  return userAICredits.docs[0]?.balance ?? 0
}

const setCredits = async (userId: string, amount: number): Promise<void> => {
  if (amount < 0) {
    throw new Error('Amount must be greater than 0')
  }

  const payload = await getPayload({ config })
  await payload.update({
    collection: 'user-ai-credits',
    where: {
      userId: {
        equals: userId,
      },
    },
    data: {
      balance: amount,
    },
  })
}

export const increaseCredits = async (userId: string, amount: number): Promise<void> => {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  const newBalance = Math.max(0, (await getRemainingCredits(userId)) + amount)

  await setCredits(userId, newBalance)
}

export const decreaseCredits = async (userId: string, amount: number): Promise<void> => {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  const newBalance = Math.max(0, (await getRemainingCredits(userId)) - amount)

  await setCredits(userId, newBalance)
}
