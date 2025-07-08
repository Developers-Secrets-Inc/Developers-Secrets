'use server'

import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { Rating, validateChallengeId, validateRating, validateUserId } from './types'
import { UserChallengeEngagement } from '@/payload-types'

const COLLECTION_NAME = 'userChallengeEngagement'

export const createEngagement = async (userId: string, challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.create({
    collection: COLLECTION_NAME,
    data: {
      userId,
      challenge: challengeId,
      hasLiked: false,
      hasDisliked: false,
      rating: null,
    },
  })
}

export const getEngagement = async (
  userId: string,
  challengeId: number,
): Promise<UserChallengeEngagement | null> => {
  const payload = await getPayload({ config })

  const userEngagement = await payload.find({
    collection: COLLECTION_NAME,
    where: {
      userId: {
        equals: userId,
      },
      challenge: {
        equals: challengeId,
      },
    },
  })

  const doc = userEngagement.docs[0]

  if (!doc) {
    return null
  }

  return doc
}

export const hasUserLikedChallenge = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userEngagement = await getEngagement(validatedUserId, validatedChallengeId)

  return userEngagement?.hasLiked ?? false
}

export const hasUserDislikedChallenge = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userEngagement = await getEngagement(validatedUserId, validatedChallengeId)

  return userEngagement?.hasDisliked ?? false
}

export const getUserRating = async (userId: string, challengeId: number): Promise<Rating> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userEngagement = await getEngagement(validatedUserId, validatedChallengeId)
  return userEngagement?.rating ?? null
}

export const setUserRating = async (
  userId: string,
  challengeId: number,
  rating: number,
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)
  const validatedRating = validateRating(rating)

  const userEngagement = await getEngagement(validatedUserId, validatedChallengeId)

  if (!userEngagement) {
    await createEngagement(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: COLLECTION_NAME,
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

export const setUserLike = async (
  userId: string,
  challengeId: number,
  hasLiked: boolean,
): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedChallengeId = validateChallengeId(challengeId)

  const userEngagement = await getEngagement(validatedUserId, validatedChallengeId)

  if (!userEngagement) {
    await createEngagement(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: COLLECTION_NAME,
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

  const userEngagement = await getEngagement(validatedUserId, validatedChallengeId)

  if (!userEngagement) {
    await createEngagement(validatedUserId, validatedChallengeId)
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: COLLECTION_NAME,
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
