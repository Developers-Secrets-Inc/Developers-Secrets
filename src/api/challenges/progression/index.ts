'use server'

import { query } from '@/core/functions'
import { isNone, none, some } from '@/lib/maybe'
import 'server-only'
import z from 'zod'
import { ChallengeWithCompletionStatus } from '../types'
import { Challenge } from '@/payload-types'

export const getChallengeProgression = query({
  name: 'challenge-progression',
  args: z.object({
    challengeId: z.number(),
    userId: z.string().uuid(),
  }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.find({
      collection: 'userChallengeCompletionStatus',
      where: {
        challenge: {
          equals: args.challengeId,
        },
        userId: {
          equals: args.userId,
        },
      },
      limit: 1,
      depth: 0,
    })

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
})

export const composeChallengesWithCompletionStatus = query({
  name: 'compose-challenge-with-completion-status',
  args: z.object({
    challenges: z.array(z.custom<Challenge>()),
    userId: z.string().uuid(),
  }),
  handler: async (ctx, args): Promise<ChallengeWithCompletionStatus[]> => {
    return Promise.all(
      args.challenges.map(async (challenge) => ({
        ...challenge,
        completionStatus: await getChallengeProgression({
          challengeId: challenge.id,
          userId: args.userId,
        }).then((value) => {
          return isNone(value) ? 'not_started' : value.value.completionStatus
        }),
      })),
    )
  },
})
