'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { ChallengeStreak } from '@/payload-types'

export type ChallengeStreakUpdateInfo = {
  previousChallengesToday: number
  currentChallengesToday: number
  streakLength: number
}

type CurrentChallengeStreak = {
  streakLength: number
  challengesToday: number
}

const getNormalizedDate = async (date: Date): Promise<Date> => {
  const newDate = new Date(date)
  newDate.setUTCHours(0, 0, 0, 0)
  return newDate
}

const findStreakEntries = async (userId: string): Promise<ChallengeStreak[]> => {
  const payload = await getPayload({ config })
  const streakEntries = await payload.find({
    collection: 'challenge-streaks',
    where: {
      userId: { equals: userId },
    },
  })

  return streakEntries.docs
}

const isActive = async (mostRecentEntryDate: Date): Promise<boolean> => {
  const yesterday = await getNormalizedDate(new Date())
  yesterday.setDate(yesterday.getDate() - 1)

  return mostRecentEntryDate.getTime() < yesterday.getTime()
}

export const getCurrentChallengeStreak = async (
  userId: string,
): Promise<CurrentChallengeStreak> => {
  const streakEntries = await findStreakEntries(userId)

  // Handle case where user has no streak entries yet
  if (!streakEntries || streakEntries.length === 0) {
    return { streakLength: 0, challengesToday: 0 }
  }

  const mostRecentEntryDate = await getNormalizedDate(new Date(streakEntries[0].date))

  if (!(await isActive(mostRecentEntryDate))) {
    return { streakLength: 0, challengesToday: 0 }
  }

  const today = await getNormalizedDate(new Date())

  let streakLength = 0
  const challengesToday =
    mostRecentEntryDate.getTime() === today.getTime() ? streakEntries[0].challengesCompleted : 0

  let expectedDate = mostRecentEntryDate
  for (const entry of streakEntries) {
    const entryDate = await getNormalizedDate(new Date(entry.date))

    if (entryDate.getTime() === expectedDate.getTime()) {
      streakLength++
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else {
      break // Streak is broken
    }
  }

  return { streakLength, challengesToday }
}

export const getWeeklyChallengeStreak = async (
  userId: string,
): Promise<{
  challengesPerDay: number[]
  currentStreak: number
}> => {
  const payload = await getPayload({ config })
  const today = new Date()
  const dayOfWeek = today.getUTCDay() // Sunday is 0, Monday is 1, etc.

  // Set to the beginning of the current week (Sunday)
  const startDate = new Date(today)
  startDate.setUTCDate(today.getUTCDate() - dayOfWeek)
  const normalizedStartDate = await getNormalizedDate(startDate)

  // Set to the end of the current week (Saturday)
  const endDate = new Date(normalizedStartDate)
  endDate.setUTCDate(normalizedStartDate.getUTCDate() + 6)

  const { docs: weeklyEntries } = await payload.find({
    collection: 'challenge-streaks',
    where: {
      userId: { equals: userId },
      date: {
        greater_than_equal: normalizedStartDate.toISOString().split('T')[0],
        less_than_equal: endDate.toISOString().split('T')[0],
      },
    },
    limit: 7, // A user can have at most 7 entries for a week
  })

  // Initialize a 7-day array with 0s
  const challengesPerDay = Array(7).fill(0)

  // Populate the array with the number of challenges completed
  for (const entry of weeklyEntries) {
    const entryDate = new Date(entry.date)
    // Adding 1 to getUTCHours to avoid issues with the date changing when normalizing
    entryDate.setUTCHours(entryDate.getUTCHours() + 1)
    const entryDayOfWeek = entryDate.getUTCDay() // Sunday is 0
    challengesPerDay[entryDayOfWeek] = entry.challengesCompleted
  }

  // Reuse existing logic to get the current streak length
  const { streakLength } = await getCurrentChallengeStreak(userId)

  return {
    challengesPerDay,
    currentStreak: streakLength,
  }
}

export const updateChallengeStreak = async (userId: string): Promise<ChallengeStreakUpdateInfo> => {
  const payload = await getPayload({ config })
  const today = await getNormalizedDate(new Date())

  const { docs: todaysEntries } = await payload.find({
    collection: 'challenge-streaks',
    where: {
      userId: {
        equals: userId,
      },
      date: {
        equals: today.toISOString().split('T')[0],
      },
      status: {
        equals: 'active',
      },
    },
  })

  const todaysActiveEntry = todaysEntries[0]
  const previousChallengesToday = todaysActiveEntry?.challengesCompleted ?? 0
  let currentChallengesToday: number

  if (todaysActiveEntry) {
    const updatedEntry = await payload.update({
      collection: 'challenge-streaks',
      id: todaysActiveEntry.id,
      data: {
        challengesCompleted: todaysActiveEntry.challengesCompleted + 1,
      },
    })
    currentChallengesToday = updatedEntry.challengesCompleted
  } else {
    await payload.create({
      collection: 'challenge-streaks',
      data: {
        userId,
        date: today.toISOString(),
        challengesCompleted: 1,
        status: 'active',
      },
    })
    currentChallengesToday = 1
  }

  const { streakLength } = await getCurrentChallengeStreak(userId)

  return {
    previousChallengesToday,
    currentChallengesToday,
    streakLength,
  }
}
