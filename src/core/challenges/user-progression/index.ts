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
