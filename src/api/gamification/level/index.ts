'use server'

import { query } from '@/core/functions'
import 'server-only'
import z from 'zod'


// ! Should be revalidated when the level is increased
export const getUserLevel = query({
  name: 'user-level',
  args: z.object({ userId: z.string().uuid() }),
  handler: async (ctx, args): Promise<number> => {
    const documents = await ctx.payload.find({
      collection: 'user-gamification',
      where: { userId: { equals: args.userId } },
      select: { currentLevel: true },
    })

    return documents.docs[0] ? documents.docs[0].currentLevel : 1
  },
})
