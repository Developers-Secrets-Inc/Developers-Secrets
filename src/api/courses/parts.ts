'use server'

import { query } from '@/core/functions'
import { none, some } from '@/lib/maybe'
import 'server-only'
import z from 'zod'

export const getPartBySlug = query({
  name: 'part-by-slug',
  args: z.object({
    part_slug: z.string(),
  }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.find({
      collection: 'courseParts',
      where: { slug: { equals: args.part_slug } },
      limit: 1
    })

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
})
