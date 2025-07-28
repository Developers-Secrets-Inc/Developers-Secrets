'use server'

import { query } from '@/core/functions'
import 'server-only'
import z from 'zod'

// export const getCourseById = undefined
// export const getCourseBySlug = undefined

export const getAllCoursePartsSlugs = query({
  name: 'all-course-parts-slug',
  args: z.object({ course_slug: z.string() }),
  handler: async (ctx, args): Promise<{
    id: number 
    slug: string
    name: string
  }[]> => {
    const courseDocuments = await ctx.payload.find({
      collection: 'courses',
      where: { slug: { equals: args.course_slug } },
      select: { orderedChapters: true },
      limit: 1,
      depth: 0,
    })

    const partsIds = await Promise.all((courseDocuments.docs[0].orderedChapters ?? []).map(async (chapterId) => {
        const chapterDocuments = await ctx.payload.findByID({
            collection: 'chapters',
            id: chapterId as number,
            depth: 0
        })

        const partsDocuments = await Promise.all((chapterDocuments.parts ?? []).map(async (partId) => {
            return await ctx.payload.findByID({
                collection: 'courseParts',
                id: partId as number,
                select: { slug: true, name: true }
            })
        }))

        return partsDocuments
    }))

    return partsIds.flatMap(parts => parts.map(part => ({
      id: part.id,
      slug: part.slug,
      name: part.name
    })))
  },
})
