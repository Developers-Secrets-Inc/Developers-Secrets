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
import {
  createCompletionStatus,
  getCompletionStatus,
  setCompletionStatus,
  isSolutionUnlocked as getSolutionUnlockStatusFromCompletion,
  setSolutionUnlocked,
} from './completion-status'
import { Where } from 'payload'
import { unstable_cache } from 'next/cache'
import { Challenge as PayloadChallenge, UserChallengeProgression } from '@/payload-types'
import { CalendarDay, CompletedChallengeInfo } from './types'

import { find } from '@/api'

export const getUserProgression = async (
  userId: string,
  challengeId: number,
): Promise<UserProgression | null> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const payload = await getPayload({ config })

  // Fetch from userChallengeProgression
  const userProgressionDoc = await payload.find({
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
  const progression = userProgressionDoc.docs[0]

  // Fetch from userChallengeCompletionStatus
  const completionStatusDoc = await payload.find({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
  })
  const completion = completionStatusDoc.docs[0]

  // Fetch from userChallengeCode
  const userCodeDoc = await payload.find({
    collection: 'userChallengeCode',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
  })
  const codeData = userCodeDoc.docs[0]

  if (!progression && !completion && !codeData) {
    return null
  }

  return {
    id: progression?.id || '', // Use ID from main progression or generate if needed
    userId: validatedUserId,
    challenge: validatedChallengeId,
    hasLiked: progression?.hasLiked ?? false,
    hasDisliked: progression?.hasDisliked ?? false,
    rating: progression?.rating ?? null,
    completionStatus: completion?.completionStatus ?? 'not_started',
    isSolutionUnlocked: completion?.isSolutionUnlocked ?? false,
    code: codeData?.code ?? [],
    userCode: codeData?.code?.find((c) => c.language === 'javascript')?.content ?? null, // Assuming 'javascript' as default
  } as UserProgression
}

export const createUserProgression = async (userId: string, challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })

  // Create entry in userChallengeProgression
  const existingProgression = await payload.find({
    collection: 'userChallengeProgression',
    where: {
      userId: { equals: userId },
      challenge: { equals: challengeId },
    },
  })
  if (existingProgression.totalDocs === 0) {
    await payload.create({
      collection: 'userChallengeProgression',
      data: {
        userId,
        challenge: challengeId,
      },
    })
  }

  // Create entry in userChallengeCompletionStatus
  const existingCompletion = await payload.find({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: { equals: userId },
      challenge: { equals: challengeId },
    },
  })
  if (existingCompletion.totalDocs === 0) {
    await createCompletionStatus(userId, challengeId)
  }

  // Create entry in userChallengeCode
  const existingCode = await payload.find({
    collection: 'userChallengeCode',
    where: {
      userId: { equals: userId },
      challenge: { equals: challengeId },
    },
  })
  if (existingCode.totalDocs === 0) {
    await payload.create({
      collection: 'userChallengeCode',
      data: {
        userId,
        challenge: challengeId,
        code: [{ language: 'javascript', content: '' }], // Initial empty code
      },
    })
  }
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

  return getCompletionStatus(validatedUserId, validatedChallengeId)
}

export const setUserCompletionStatus = async (
  userId: string,
  challengeId: number,
  completionStatus: 'not_started' | 'in_progress' | 'completed',
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedCompletionStatus = validateCompletionStatus(completionStatus)

  await setCompletionStatus(validatedUserId, validatedChallengeId, validatedCompletionStatus)
}

export const getUserIsSolutionUnlocked = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  return getSolutionUnlockStatusFromCompletion(validatedUserId, validatedChallengeId)
}

export const setUserIsSolutionUnlocked = async (
  userId: string,
  challengeId: number,
  isSolutionUnlocked: boolean,
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedIsSolutionUnlocked = validateIsSolutionUnlocked(isSolutionUnlocked)

  // If setting to unlocked, use the dedicated function
  if (validatedIsSolutionUnlocked) {
    await setSolutionUnlocked(validatedUserId, validatedChallengeId)
  } else {
    // If setting to locked, we need to explicitly update the progression status in the completion collection
    // This case might not be common as solution unlock is usually one-way
    const payload = await getPayload({ config })
    await payload.update({
      collection: 'userChallengeCompletionStatus',
      where: {
        userId: {
          equals: validatedUserId,
        },
        challenge: {
          equals: validatedChallengeId,
        },
      },
      data: {
        isSolutionUnlocked: false,
      },
    })
  }
}

export const getUserCode = async (
  userId: string,
  challengeId: number,
  language: string,
): Promise<CodeBlock> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedLanguage = validateCodeLanguage(language)

  const payload = await getPayload({ config })

  const userCodeDoc = await payload.find({
    collection: 'userChallengeCode',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
  })

  const doc = userCodeDoc.docs[0]

  if (!doc || !doc.code) {
    throw new Error('Code block not found or empty')
  }

  const codeBlock = doc.code.find((code) => code.language === validatedLanguage)
  if (!codeBlock) {
    throw new Error('Code block for specified language not found')
  }
  return codeBlock
}

export const setUserCode = async (
  userId: string,
  challengeId: number,
  userCodeContent: string, // Renamed to avoid confusion with collection field
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const payload = await getPayload({ config })

  const existingCodeDoc = await payload.find({
    collection: 'userChallengeCode',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
  })

  if (existingCodeDoc.docs.length > 0) {
    // Update existing code block
    const docId = existingCodeDoc.docs[0].id
    const existingCodeArray = existingCodeDoc.docs[0].code || []
    const codeLanguage = 'javascript' // Assuming default language for now

    const updatedCodeArray = existingCodeArray.map((block) =>
      block.language === codeLanguage ? { ...block, content: userCodeContent } : block,
    )

    if (!updatedCodeArray.some((block) => block.language === codeLanguage)) {
      updatedCodeArray.push({ language: codeLanguage, content: userCodeContent })
    }

    await payload.update({
      collection: 'userChallengeCode',
      id: docId,
      data: {
        code: updatedCodeArray,
      },
    })
  } else {
    // Create new code block entry
    await payload.create({
      collection: 'userChallengeCode',
      data: {
        userId: validatedUserId,
        challenge: validatedChallengeId,
        code: [{ language: 'javascript', content: userCodeContent }], // Assuming default language
      },
    })
  }
}

export const getUserSavedCode = async (
  userId: string,
  challengeId: number,
  language: string, // Added language parameter
): Promise<string | null> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedLanguage = validateCodeLanguage(language)

  const payload = await getPayload({ config })

  const userCodeDoc = await payload.find({
    collection: 'userChallengeCode',
    where: {
      userId: {
        equals: validatedUserId,
      },
      challenge: {
        equals: validatedChallengeId,
      },
    },
  })

  const doc = userCodeDoc.docs[0]

  if (!doc || !doc.code) {
    return null
  }

  const codeBlock = doc.code.find((block) => block.language === validatedLanguage)
  return codeBlock?.content ?? null
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
 * Builds the calendar grid data for the current month, including prefetched
 * completed challenge details for each day. Returns a flat array representing the grid cells.
 */
export const getCalendarDays = async (userId: string): Promise<(CalendarDay | null)[]> => {
  const validatedUserId = validateUserId(userId)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed

  // Get the start and end of the current month in UTC
  const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999))

  // Fetch all completed progressions for the user within the current month
  const completedProgressions = await find({
    collection: 'userChallengeCompletionStatus',
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
    depth: 1, // Needed to populate challenge details
    limit: 0,
    pagination: false,
  })

  // Group completed challenges by date (YYYY-MM-DD format based on UTC completion time)
  const challengesByDate: { [date: string]: CompletedChallengeInfo[] } = {}

  completedProgressions.docs.forEach((progression) => {
    if (
      progression.updatedAt &&
      progression.challenge &&
      typeof progression.challenge === 'object'
    ) {
      const completionDate = new Date(progression.updatedAt)
      // Get date components based on UTC
      const utcYear = completionDate.getUTCFullYear()
      const utcMonth = String(completionDate.getUTCMonth() + 1).padStart(2, '0')
      const utcDay = String(completionDate.getUTCDate()).padStart(2, '0')
      const dateString = `${utcYear}-${utcMonth}-${utcDay}`

      const challenge = progression.challenge as PayloadChallenge
      const difficulty = ['very_easy', 'easy', 'medium', 'hard', 'horrible'].includes(challenge.difficulty)
        ? (challenge.difficulty as CompletedChallengeInfo['difficulty'])
        : 'medium'

      const challengeInfo: CompletedChallengeInfo = {
        id: challenge.id,
        title: challenge.title,
        slug: challenge.slug,
        difficulty: difficulty,
      }

      if (!challengesByDate[dateString]) {
        challengesByDate[dateString] = []
      }
      challengesByDate[dateString].push(challengeInfo)
    }
  })

  // --- Build the calendar grid structure ---

  const firstDayOfMonth = new Date(year, month, 1) // Use local time for calendar structure
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let firstDayIndex = firstDayOfMonth.getDay() // 0 = Sun, 1 = Mon...
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1 // Adjust to Mon=0, Sun=6

  const allDays: (CalendarDay | null)[] = []

  // Add placeholders before the 1st
  for (let i = 0; i < firstDayIndex; i++) {
    allDays.push(null)
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    // Create the date string based on local calendar day (consistent with previous fix)
    const localMonthString = String(month + 1).padStart(2, '0')
    const localDayString = String(day).padStart(2, '0')
    const dateString = `${year}-${localMonthString}-${localDayString}`

    // Get the prefetched challenges for this local date string
    // Note: We group challenges based on their UTC completion timestamp's date part.
    // This dateString is the *local* date for the calendar cell.
    // There might be a slight mismatch if a challenge was completed near midnight
    // between timezones. E.g., completed 23:30 local (-5 UTC) on the 20th is
    // 04:30 UTC on the 21st. Grouping by UTC date puts it on 21st, but the local calendar shows 20th.
    // For simplicity here, we use the local dateString for lookup, acknowledging this edge case.
    // A more robust solution might involve timezone conversions for each completion.
    const completedChallenges = challengesByDate[dateString] || []
    const completedChallengesCount = completedChallenges.length

    allDays.push({
      date: dateString,
      day,
      completedChallengesCount,
      completedChallenges, // Include the prefetched list
    })
  }

  return allDays
}

/**
 * Fetches the details of challenges completed by a user on a specific date.
 * Uses the imported CompletedChallengeInfo type.
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
