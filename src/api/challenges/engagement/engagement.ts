'use server'

import 'server-only'


import { query } from '@/core/functions'
import { QueryCtx } from '@/core/functions/types'
import z from 'zod'
import { eq, and } from '@payloadcms/db-postgres/drizzle'
import { challenge_engagement } from '@/payload-generated-schema'
import { ChallengeEngagement } from '@/payload-types'

export const findUserChallengeEngagement = query({
  name: 'find-challenge-engagement',
  args: z.object({
    userId: z.string().uuid(),
    challengeId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args): Promise<ChallengeEngagement> => {
    const db = ctx.drizzle
    const result = await db
      .select()
      .from(challenge_engagement)
      .where(
        and(
          eq(challenge_engagement.userId, args.userId),
          eq(challenge_engagement.challenge, args.challengeId),
        ),
      )
      .limit(1)
    return result[0] || null
  },
})

export const createUserChallengeEngagement = query({
  name: 'create-challenge-engagement',
  args: z.object({
    userId: z.string().uuid(),
    challengeId: z.number().int().positive(),
    type: z.enum(['like', 'dislike']),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [created] = await db
      .insert(challenge_engagement)
      .values({
        userId: args.userId,
        challenge: args.challengeId,
        type: args.type,
      })
      .returning()
    return created
  },
})

export const updateUserChallengeEngagement = query({
  name: 'update-challenge-engagement',
  args: z.object({
    engagementId: z.number().int().positive(),
    type: z.enum(['like', 'dislike']),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [updated] = await db
      .update(challenge_engagement)
      .set({ type: args.type })
      .where(eq(challenge_engagement.id, args.engagementId))
      .returning()
    return updated
  },
})

export const removeUserChallengeEngagement = query({
  name: 'remove-challenge-engagement',
  args: z.object({
    engagementId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [deleted] = await db
      .delete(challenge_engagement)
      .where(eq(challenge_engagement.id, args.engagementId))
      .returning()
    return deleted
  },
})
