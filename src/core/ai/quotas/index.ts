'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { UserAiUsage } from '@/payload-types'

const MAX_BASIC_MESSAGES_PER_DAY = 20

const createAIUsage = async (
  userId: string,
  date: Date,
  initialMessage: number = 1,
): Promise<UserAiUsage> => {
  const payload = await getPayload({ config })
  const userAIUsage = await payload.create({
    collection: 'user-ai-usage',
    data: {
      userId,
      date: date.toISOString(),
      messagesUsed: initialMessage,
      dailyLimit: MAX_BASIC_MESSAGES_PER_DAY,
    },
  })

  return userAIUsage
}

const getUserAIUsageByDate = async (userId: string, date: Date): Promise<UserAiUsage | null> => {
  const payload = await getPayload({ config })
  const userAIUsage = await payload.find({
    collection: 'user-ai-usage',
    where: {
      userId: {
        equals: userId,
      },
      date: {
        equals: date.toISOString(),
      },
    },
    depth: 0,
  })
  return userAIUsage.docs[0] ?? null
}

export const getOrCreateUserAIUsage = async (userId: string, date: Date): Promise<UserAiUsage> => {
  const userAIUsage = await getUserAIUsageByDate(userId, date)
  if (userAIUsage) {
    return userAIUsage
  }
  return createAIUsage(userId, date)
}

export const incrementMessagesSent = async (userId: string, date: Date, amount: number = 1): Promise<void> => {
    const userAIUsage = await getOrCreateUserAIUsage(userId, date)
    
    const payload = await getPayload({ config })
    await payload.update({
        collection: 'user-ai-usage',
        where: {
            userId: {
                equals: userId,
            },
        },
        data: {
            messagesUsed: userAIUsage.messagesUsed + amount,
        },
    })
}
