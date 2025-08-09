'use server'

import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'

const DEFAULT_COMPLETION_STATUS: CompletionStatus = 'not_started'

export const createCompletionStatus = async (
  userId: string,
  challengeId: number,
): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.create({
    collection: 'userChallengeCompletionStatus',
    data: {
      userId,
      challenge: challengeId,
      completionStatus: DEFAULT_COMPLETION_STATUS,
    },
  })
}

export const getCompletionStatus = async (
  userId: string,
  challengeId: number,
): Promise<CompletionStatus> => {
  const payload = await getPayload({ config })

  console.log(userId, challengeId)
  const userProgression = await payload.find({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: {
        equals: userId,
      },
      challenge: {
        equals: challengeId,
      },
    },
    limit: 1,
    depth: 0
  })

  const doc = userProgression.docs[0]

  if (!doc) {
    return DEFAULT_COMPLETION_STATUS
  }

  return doc.completionStatus
}

export const setCompletionStatus = async (
  userId: string,
  challengeId: number,
  completionStatus: CompletionStatus,
): Promise<void> => {
  const payload = await getPayload({ config })

  const userProgression = await getCompletionStatus(userId, challengeId)


  if (!userProgression || userProgression === 'not_started') {
    await createCompletionStatus(userId, challengeId)
  }

  await payload.update({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: {
        equals: userId,
      },
      challenge: {
        equals: challengeId,
      },
    },
    data: {
      completionStatus,
    },
  })
}

export const isSolutionUnlocked = async (userId: string, challengeId: number): Promise<boolean> => {
  const payload = await getPayload({ config })

  const userProgression = await payload.find({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: {
        equals: userId,
      },
      challenge: {
        equals: challengeId,
      },
    },
    select: {
      isSolutionUnlocked: true,
    },
  })

  const doc = userProgression.docs[0]

  if (!doc) {
    return false
  }

  return doc.isSolutionUnlocked ?? false
}

export const setSolutionUnlocked = async (userId: string, challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: {
        equals: userId,
      },
      challenge: {
        equals: challengeId,
      },
    },
    data: {
      isSolutionUnlocked: true,
    },
  })
}

const COMPLETED_CHALLENGE_STATUS: CompletionStatus = 'completed'

export const isChallengeCompleted = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
  const COMPLETION_STATUS = await getCompletionStatus(userId, challengeId)
  return COMPLETION_STATUS === COMPLETED_CHALLENGE_STATUS
}

export const canAccessSolution = async (userId: string, challengeId: number): Promise<boolean> => {
  return (
    (await isSolutionUnlocked(userId, challengeId)) ||
    (await isChallengeCompleted(userId, challengeId))
  )
}

export const getTotalCompletedChallengesCount = async (userId: string): Promise<number> => {
  const payload = await getPayload({ config })

  const countResult = await payload.count({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: {
        equals: userId,
      },
      completionStatus: {
        equals: 'completed',
      },
    },
  })

  return countResult.totalDocs ?? 0
}

export const getAllUserCompletionStatuses = async (userId: string) => {
  const payload = await getPayload({ config })

  const userProgressions = await payload.find({
    collection: 'userChallengeCompletionStatus',
    where: {
      userId: {
        equals: userId,
      },
    },
    limit: 0,
    pagination: false,
  })

  return userProgressions.docs
}
