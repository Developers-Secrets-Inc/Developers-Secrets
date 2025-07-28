'use server'

import { query } from '@/core/functions'
import 'server-only'
import z from 'zod'

export const getChapterBySlug = query({
  name: 'chapter-by-slug',
  args: z.object({ course_slug: z.string(), chapter_slug: z.string() }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.find({
      collection: 'chapters',
      where: {},
    })
  },
})
