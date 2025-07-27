'use server'

import { query } from '@/core/functions'
import { none, some } from '@/lib/maybe'
import 'server-only'
import z from 'zod'

export const getChallengeProgression = query({
  name: 'challenge-progression',
  args: z.object({
    challengeSlug: z.string(),
    userId: z.string().uuid(),
  }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.find({
      collection: 'userChallengeCompletionStatus',
      where: {
        challenge: {
          equals: args.challengeSlug,
        },
        user: {
          equals: args.userId,
        },
      },
      limit: 1,
      depth: 0
    })

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
})
