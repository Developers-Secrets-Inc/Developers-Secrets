'use server'

import { query } from '@/core/functions'
import { QueryCtx } from '@/core/functions/types'
import 'server-only'
import z from 'zod'
import { eq, and } from '@payloadcms/db-postgres/drizzle'
import { challenge_rating } from '@/payload-generated-schema'

export const findChallengeRating = query({
  name: 'find-challenge-rating',
  args: z.object({
    userId: z.string().uuid(),
    challengeId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const result = await db
      .select()
      .from(challenge_rating)
      .where(
        and(
          eq(challenge_rating.userId, args.userId),
          eq(challenge_rating.challenge, args.challengeId)
        )
      )
      .limit(1)
    return result[0] || null
  },
})

export const createChallengeRating = query({
  name: 'create-challenge-rating',
  args: z.object({
    userId: z.string().uuid(),
    challengeId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [created] = await db
      .insert(challenge_rating)
      .values({
        userId: args.userId,
        challenge: args.challengeId,
        rating: args.rating.toString(),
      })
      .returning()
    return created
  },
})

export const updateChallengeRating = query({
  name: 'update-challenge-rating',
  args: z.object({
    ratingId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [updated] = await db
      .update(challenge_rating)
      .set({ rating: args.rating.toString() })
      .where(eq(challenge_rating.id, args.ratingId))
      .returning()
    return updated
  },
})

export const upsertChallengeRating = query({
  name: 'upsert-challenge-rating',
  args: z.object({
    userId: z.string().uuid(),
    challengeId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
  }),
  handler: async (_, args) => {
    const found = await findChallengeRating({ userId: args.userId, challengeId: args.challengeId })
    if (found) {
      return await updateChallengeRating({
        ratingId: found.id,
        rating: args.rating,
      })
    } else {
      return await createChallengeRating({
        userId: args.userId,
        challengeId: args.challengeId,
        rating: args.rating,
      })
    }
  },
})
