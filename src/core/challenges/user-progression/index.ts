'use server'

import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import {
  CodeBlock,
  CompletionStatus,
  Rating,
  UserProgression,
  validateChallengeId,
  validateCodeLanguage,
  validateCompletionStatus,
  validateIsSolutionUnlocked,
  validateRating,
  validateUserId,
} from './types'
import { Where } from 'payload'
import { unstable_cache } from 'next/cache'
import { Challenge as PayloadChallenge } from '@/payload-types'

const getUserProgression = async (
  userId: string,
  challengeId: number,
): Promise<UserProgression | null> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const payload = await getPayload({ config })

  const userProgression = await payload.find({
    collection: 'userChallengeProgression',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
  })

  const doc = userProgression.docs[0]

  if (!doc) {
    return null
  }

  return {
    ...doc,
    code: doc.code ?? null,
    hasLiked: doc.hasLiked ?? null,
    hasDisliked: doc.hasDisliked ?? null,
    completionStatus: doc.completionStatus ?? 'not_started',
    isSolutionUnlocked: doc.isSolutionUnlocked ?? null,
    rating: doc.rating ?? null,
  } as UserProgression
}

const createUserProgression = async (
  userId: string,
  challengeId: number,
): Promise<UserProgression> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const payload = await getPayload({ config })

  const userProgression = await payload.create({
    collection: 'userChallengeProgression',
    data: {
      userId: validatedUserId,
      challenge: validatedChallengeId,
      completionStatus: 'not_started',
    },
  })

  return {
    ...userProgression,
    code: null,
    hasLiked: null,
    hasDisliked: null,
    completionStatus: 'not_started',
    isSolutionUnlocked: null,
    rating: null,
  } as UserProgression
}

export const hasUserLikedChallenge = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)

  return userProgression?.hasLiked ?? false
}

export const hasUserDislikedChallenge = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)

  return userProgression?.hasDisliked ?? false
}

export const getUserRating = async (userId: string, challengeId: number): Promise<Rating> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)
  return userProgression?.rating ?? null
}

export const setUserRating = async (
  userId: string,
  challengeId: number,
  rating: number,
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedRating = validateRating(rating)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)

  if (!userProgression) {
    await createUserProgression(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'userChallengeProgression',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
    data: {
      rating: validatedRating,
    },
  })
}

export const getUserCompletionStatus = async (
  userId: string,
  challengeId: number,
): Promise<CompletionStatus> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)
  return userProgression?.completionStatus ?? 'not_started'
}

export const setUserCompletionStatus = async (
  userId: string,
  challengeId: number,
  completionStatus: 'not_started' | 'in_progress' | 'completed',
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedCompletionStatus = validateCompletionStatus(completionStatus)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)

  if (!userProgression) {
    await createUserProgression(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'userChallengeProgression',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
    data: {
      completionStatus: validatedCompletionStatus,
    },
  })
}

export const getUserIsSolutionUnlocked = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)
  return userProgression?.isSolutionUnlocked ?? false
}

export const setUserIsSolutionUnlocked = async (
  userId: string,
  challengeId: number,
  isSolutionUnlocked: boolean,
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedIsSolutionUnlocked = validateIsSolutionUnlocked(isSolutionUnlocked)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)

  if (!userProgression) {
    await createUserProgression(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'userChallengeProgression',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
    data: {
      isSolutionUnlocked: validatedIsSolutionUnlocked,
    },
  })
}

export const getUserCode = async (
  userId: string,
  challengeId: number,
  language: string,
): Promise<CodeBlock> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedLanguage = validateCodeLanguage(language)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)
  const codeBlock = userProgression?.code?.find((code) => code.language === validatedLanguage)
  if (!codeBlock) {
    throw new Error('Code block not found')
  }
  return codeBlock
}

export const setUserLike = async (
  userId: string,
  challengeId: number,
  hasLiked: boolean,
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)

  if (!userProgression) {
    await createUserProgression(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'userChallengeProgression',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
    data: {
      hasLiked,
      hasDisliked: hasLiked ? false : undefined,
    },
  })
}

export const setUserDislike = async (
  userId: string,
  challengeId: number,
  hasDisliked: boolean,
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userProgression = await getUserProgression(validatedUserId, validatedChallengeId)

  if (!userProgression) {
    await createUserProgression(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'userChallengeProgression',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
    data: {
      hasDisliked,
      hasLiked: hasDisliked ? false : undefined,
    },
  })
}

export const getCompletedChallengesPerDay = async (
  userId: string,
): Promise<{ [date: string]: number }> => {
  const validatedUserId = validateUserId(userId)
  const payload = await getPayload({ config })

  // Get the start and end dates for the current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  endOfMonth.setHours(23, 59, 59, 999)

  // Query all completed challenges for the user in the current month
  const userProgressions = await payload.find({
    collection: 'userChallengeProgression',
    where: {
      and: [
        {
          userId: {
            equals: validatedUserId,
          },
        },
        {
          completionStatus: {
            equals: 'completed',
          },
        },
        {
          updatedAt: {
            greater_than_equal: startOfMonth.toISOString(),
          },
        },
        {
          updatedAt: {
            less_than_equal: endOfMonth.toISOString(),
          },
        },
      ],
    },
  })

  // Create a map of date -> number of completed challenges
  const completedChallengesPerDay: { [date: string]: number } = {}

  // Initialize all days of the month with 0
  for (let day = 1; day <= endOfMonth.getDate(); day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    const dateString = date.toISOString().split('T')[0]
    completedChallengesPerDay[dateString] = 0
  }

  // Count completed challenges for each day
  userProgressions.docs.forEach((progression) => {
    const completionDate = new Date(progression.updatedAt)
    completionDate.setHours(0, 0, 0, 0)
    const dateString = completionDate.toISOString().split('T')[0]
    completedChallengesPerDay[dateString] = (completedChallengesPerDay[dateString] || 0) + 1
  })

  return completedChallengesPerDay
}

/**
 * Gets the count of challenges completed by a user today.
 */
export const getTodayCompletedChallengesCount = async (userId: string): Promise<number> => {
  const validatedUserId = validateUserId(userId)
  const payload = await getPayload({ config })

  // Get the start and end of today
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  endOfDay.setHours(23, 59, 59, 999)

  // Define the where clause separately and explicitly type it
  const whereClause: Where = {
    and: [
      {
        userId: {
          equals: validatedUserId,
        },
      },
      {
        completionStatus: {
          equals: 'completed',
        },
      },
      {
        updatedAt: {
          greater_than_equal: startOfDay.toISOString(),
        },
      },
      {
        updatedAt: {
          less_than_equal: endOfDay.toISOString(),
        },
      },
    ],
  }

  // Use payload.count()
  const countResult = await payload.count({
    collection: 'userChallengeProgression',
    where: whereClause,
  })

  // payload.count() returns an object like { totalDocs: number }
  return countResult.totalDocs ?? 0
}

/**
 * Gets the counts of completed challenges per day for past days in the current month (up to yesterday).
 * This function is intended to be cached.
 */
const getHistoricalCompletedChallengesCounts = async (
  userId: string,
): Promise<{ [date: string]: number }> => {
  const validatedUserId = validateUserId(userId)
  const payload = await getPayload({ config })

  // Get the start of the current month and the start of today (end of yesterday)
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  startOfToday.setHours(0, 0, 0, 0)

  // Don't fetch if today is the first day of the month
  if (startOfToday <= startOfMonth) {
    return {}
  }

  // Query completed challenges from the start of the month up to *before* today
  const userProgressions = await payload.find({
    collection: 'userChallengeProgression',
    where: {
      and: [
        {
          userId: {
            equals: validatedUserId,
          },
        },
        {
          completionStatus: {
            equals: 'completed',
          },
        },
        {
          updatedAt: {
            greater_than_equal: startOfMonth.toISOString(),
          },
        },
        {
          // Query strictly less than the start of today
          updatedAt: {
            less_than: startOfToday.toISOString(),
          },
        },
      ],
    },
    limit: 0,
    pagination: false,
  })

  // Create a map of date -> number of completed challenges
  const historicalCounts: { [date: string]: number } = {}

  // Initialize days from the start of the month up to yesterday
  const yesterday = new Date(startOfToday)
  yesterday.setDate(startOfToday.getDate() - 1)
  const daysInMonthSoFar = yesterday.getDate() // Day number of yesterday

  for (let day = 1; day <= daysInMonthSoFar; day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    const dateString = date.toISOString().split('T')[0]
    historicalCounts[dateString] = 0
  }

  // Count completed challenges for each historical day
  userProgressions.docs.forEach((progression) => {
    if (progression.updatedAt) {
      const completionDate = new Date(progression.updatedAt)
      completionDate.setHours(0, 0, 0, 0)
      const dateString = completionDate.toISOString().split('T')[0]
      // Only count if the dateString is within the map (days before today)
      if (dateString in historicalCounts) {
        historicalCounts[dateString] = (historicalCounts[dateString] || 0) + 1
      }
    }
  })

  return historicalCounts
}

/**
 * Cached version of getHistoricalCompletedChallengesCounts.
 * Uses unstable_cache for efficient data retrieval.
 */
export const getCachedHistoricalCompletedChallengesCounts = unstable_cache(
  async (userId: string) => getHistoricalCompletedChallengesCounts(userId),
  // Cache key: unique per user
  ['historical-challenge-counts'],
  // Options: revalidate every 24 hours (in seconds)
  { revalidate: 86400, tags: ['challenge-progression'] },
)

/**
 * Structure for calendar day data.
 */
interface CalendarDay {
  date: string
  day: number
  completedChallenges: number
}

/**
 * Builds the calendar grid data for the current month, using cached historical data
 * and dynamically fetched data for today. Returns a flat array representing the grid cells.
 */
export const getCalendarDays = async (userId: string): Promise<(CalendarDay | null)[]> => {
  const validatedUserId = validateUserId(userId)

  // Fetch historical and today's data in parallel
  const [historicalCounts, todayCount] = await Promise.all([
    getCachedHistoricalCompletedChallengesCounts(validatedUserId),
    getTodayCompletedChallengesCount(validatedUserId),
  ])

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const todayDate = now.getDate()

  // Get the first day of the month and total days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let firstDayIndex = firstDayOfMonth.getDay()
  // Convert Sunday from 0 to 7 to match our calendar layout
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1

  // Create a flat array for all calendar cells
  const allDays: (CalendarDay | null)[] = []

  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayIndex; i++) {
    allDays.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    // Format the date string based on the local year, month (1-based), and day
    // Ensure month and day are padded with leading zeros if necessary
    const localMonthString = String(month + 1).padStart(2, '0') // month is 0-indexed
    const localDayString = String(day).padStart(2, '0')
    const dateString = `${year}-${localMonthString}-${localDayString}`

    let completedCount = 0
    // Use the correctly formatted local date string to look up historical counts
    // Note: This assumes historicalCounts keys were also generated this way.
    // If historicalCounts keys come from UTC dates via toISOString(), that needs fixing too.
    // For now, let's assume consistency or fix today first.
    if (day < todayDate) {
      // We might need to adjust how historicalCounts are keyed if they used UTC dates.
      // For simplicity, let's first assume we primarily care about today/recent past
      // or that historicalCounts can be adjusted/re-keyed.
      // A safer approach for lookup might involve iterating historicalCounts keys
      // and matching year, month, day components if timezone issues persist deeply.
      completedCount = historicalCounts[dateString] || 0 // Potential issue if keys mismatch
    } else if (day === todayDate) {
      completedCount = todayCount
    }

    allDays.push({
      date: dateString, // Use the correctly formatted local date string
      day,
      completedChallenges: completedCount,
    })
  }

  // Return the flat array directly
  return allDays
}

export const getTotalCompletedChallengesCount = async (userId: string): Promise<number> => {
  const validatedUserId = validateUserId(userId)
  const payload = await getPayload({ config })

  const countResult = await payload.count({
    collection: 'userChallengeProgression',
    where: {
      userId: {
        equals: validatedUserId,
      },
    },
  })

  return countResult.totalDocs ?? 0
}

// Type for the information returned by the new function
interface CompletedChallengeInfo {
  id: number
  title: string
  slug: string
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible'
}

/**
 * Fetches the details of challenges completed by a user on a specific date.
 */
export const getCompletedChallengesForDate = async (
  userId: string,
  date: string,
): Promise<CompletedChallengeInfo[]> => {
  const validatedUserId = validateUserId(userId)
  const payload = await getPayload({ config })

  try {
    // Validate the date format roughly (more robust validation might be needed)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD.')
    }

    // Parse the date string components directly to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number)

    // Ensure the month is correctly adjusted for JavaScript's 0-indexed months
    // Date.UTC expects month index starting from 0 (0=Jan, 1=Feb, ...)
    const utcMonth = month - 1

    // Calculate start and end of the specified day in UTC
    const startOfDay = new Date(Date.UTC(year, utcMonth, day, 0, 0, 0, 0))
    const endOfDay = new Date(Date.UTC(year, utcMonth, day, 23, 59, 59, 999))

    // Query completed challenges for the specified day, populating the challenge details
    const userProgressions = await payload.find({
      collection: 'userChallengeProgression',
      where: {
        and: [
          {
            userId: {
              equals: validatedUserId,
            },
          },
          {
            completionStatus: {
              equals: 'completed',
            },
          },
          {
            updatedAt: {
              greater_than_equal: startOfDay.toISOString(),
            },
          },
          {
            updatedAt: {
              less_than_equal: endOfDay.toISOString(),
            },
          },
        ],
      },
      depth: 1,
      limit: 0,
      pagination: false,
    })

    // Map the results to the desired format
    const completedChallenges: CompletedChallengeInfo[] = userProgressions.docs
      .map((progression) => {
        // Check if challenge is populated and is an object (due to depth: 1)
        if (progression.challenge && typeof progression.challenge === 'object') {
          const challenge = progression.challenge as PayloadChallenge
          // Ensure difficulty exists and is of the expected type, provide a default if needed
          const difficulty = ['easy', 'medium', 'hard', 'horrible'].includes(challenge.difficulty)
            ? (challenge.difficulty as CompletedChallengeInfo['difficulty'])
            : 'medium'

          return {
            id: challenge.id,
            title: challenge.title,
            slug: challenge.slug,
            difficulty: difficulty,
          }
        }
        return null
      })
      .filter((c): c is CompletedChallengeInfo => c !== null)

    return completedChallenges
  } catch (error) {
    console.error(`Error fetching completed challenges for user ${userId} on date ${date}:`, error)
    // Depending on requirements, you might want to return [] or throw the error
    return []
  }
}
