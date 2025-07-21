'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { DailyLoginEntry } from '@/payload-types'


// ! We should not be able to add multiple entries for the same day
export const setDailyLogin = async (userId: string, date: Date): Promise<void> => {
    if (await getLoginEntry(userId, date)) {
        return
    }

    const payload = await getPayload({ config })
    
    const formattedDate = date.toISOString().split('T')[0]
    
    await payload.create({
        collection: 'daily-login-entries',
        data: {
            userId,
            date: formattedDate,
        },
    })
}

export const setTodayLogin = async (userId: string): Promise<void> => {
    return await setDailyLogin(userId, new Date())
}

export const getLoginEntry = async (userId: string, date: Date): Promise<DailyLoginEntry | null> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: 'daily-login-entries',
        where: {
            userId: { equals: userId },
            date: { equals: date.toISOString().split('T')[0] },
        },
    })
    return result.docs[0] || null
}

export const getUserLoginEntries = async (userId: string): Promise<DailyLoginEntry[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: 'daily-login-entries',
        where: {
            userId: { equals: userId },
        },
    })
    return result.docs
}

export const getActiveDaysCount = async (userId: string): Promise<number> => {
    const payload = await getPayload({ config })
    
    const result = await payload.count({
        collection: 'daily-login-entries',
        where: {
            userId: { equals: userId },
        },
    })
    
    return result.totalDocs
}
