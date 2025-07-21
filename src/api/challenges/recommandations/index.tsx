'use server'

import { query } from '@/core/functions'
import { QueryCtx } from '@/core/functions/types'
import { challenges } from '@/payload-generated-schema'
import 'server-only'
import z from 'zod'


const getUserUnaccomplishedChallenges = query({
    name: 'user-unaccomplished-challenges',
    args: z.object({ userId: z.string().uuid() }),
    handler: async (ctx, args) => {
      // ...requête DB pour challenges non accomplis
    //   return ids; // tableau d'IDs
    },
    revalidate: 600, // 10 min
  });


export const getRandomChallengeId = query({
  name: 'random-challenge-id',
  handler: async (ctx: QueryCtx) => {
    const ids = await ctx.drizzle
        .select({id: challenges.id})
        .from(challenges)

    const randomId = ids[Math.floor(Math.random() * ids.length)].id
    return randomId
  },
  revalidate: 600,
})
