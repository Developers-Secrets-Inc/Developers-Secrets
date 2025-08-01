'use server'

import 'server-only'
import { query } from '../functions'
import { Course } from '@/payload-types'

export type GridCourseInformations = {
  id: number
  isLocked: boolean
  slug: string
  difficulty: Course['difficulty']
  name: string
  description: string
  startUrl?: string | null
  totalPartsCount?: number
  allPartsIds: number[]
}

export const getCourseGridInformations = query({
  name: 'course-grid-information',
  handler: async (ctx, _): Promise<GridCourseInformations[]> => {
    // Get all courses Ids
    // For each course, get all chapters ids, slug and parts ids
    // Count the total of articles
    const coursesDocuments = await ctx.payload.find({
      collection: 'courses',
      // Temporary
      pagination: false,
      select: {
        slug: true,
        orderedChapters: true,
        status: true,
        difficulty: true,
        name: true,
        description: true,
      },
      depth: 0,
    })

    const gridCourseInformations = await Promise.all(
      coursesDocuments.docs.map(async (course) => {
        const chapters = await Promise.all(
          (course.orderedChapters || []).map(async (chapter) => {
            return await ctx.payload.findByID({
              collection: 'chapters',
              id: chapter as number,
              select: { parts: true },
              depth: 0,
            })
          }),
        )

        const totalPartsCount = chapters.reduce(
          (total, chapter) => total + (chapter?.parts?.length || 0),
          0,
        )

        const allPartsIds = chapters
          .flatMap(chapter => chapter?.parts || [])
          .filter(part => typeof part === 'number') as number[]
        
        let startUrl: string | null = null
        const firstChapter = chapters[0]
        if (firstChapter?.parts && firstChapter.parts.length > 0) {
          const firstPartId = firstChapter.parts[0]
          if (typeof firstPartId === 'number') {
            const firstArticle = await ctx.payload.findByID({
              collection: 'courseParts',
              id: firstPartId,
              select: { slug: true }
            })
            startUrl = firstArticle?.slug || null
          }
        }

        return {
          id: course.id,
          isLocked: course.status === 'draft' || (course.orderedChapters?.length || 0) === 0,
          slug: course.slug,
          difficulty: course.difficulty,
          name: course.name,
          description: course.description || '',
          startUrl,
          totalPartsCount,
          allPartsIds,
        }
      }),
    )

    return gridCourseInformations
  },
  revalidate: 1
})
