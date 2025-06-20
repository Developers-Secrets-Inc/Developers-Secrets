'use server'

import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { CompletionStatus } from './types'

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
      completionStatus: true,
    },
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

  console.log("Getting current completion status")
  const userProgression = await getCompletionStatus(userId, challengeId)

  console.log("Current completion status", userProgression)

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


export const isSolutionUnlocked = async (
  userId: string,
  challengeId: number,
): Promise<boolean> => {
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

export const setSolutionUnlocked = async (
  userId: string,
  challengeId: number,
): Promise<void> => {
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
