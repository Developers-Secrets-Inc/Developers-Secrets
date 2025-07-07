'use server'

import 'server-only'
import { getOrCreateUserAIUsage, incrementMessagesSent } from '.'
import { decreaseCredits, getOrCreateUserAICredits, getRemainingCredits } from './credits'
import { getUserRole } from '@/core/user/user-informations'


export const getRemainingMessagesForToday = async (userId: string): Promise<number> => {
    const userAIUsage = await getOrCreateUserAIUsage(userId, new Date())
    const userAICredits = await getOrCreateUserAICredits(userId)

    const remainingMessages = userAIUsage.dailyLimit - userAIUsage.messagesUsed
    const remainingCredits = userAICredits.balance

    console.log(remainingMessages, remainingCredits)
    return remainingMessages + remainingCredits
}

export const incrementMessagesSentForToday = async (userId: string): Promise<void> => {
    const userAIUsage = await getOrCreateUserAIUsage(userId, new Date())
    
    if (userAIUsage.messagesUsed < userAIUsage.dailyLimit) {
        return await incrementMessagesSent(userId, new Date())
    }

    const remainingCredits = await getRemainingCredits(userId)

    if (remainingCredits > 0) {
        return await decreaseCredits(userId, 1)
    }

    throw new Error('No remaining messages or credits')
}


export const canSendMessage = async (userId: string): Promise<boolean> => {
    const role = await getUserRole(userId)

    if (role === 'basic') {
        const remainingMessages = await getRemainingMessagesForToday(userId)
        return remainingMessages > 0
    }

    return true
}
