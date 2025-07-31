'use server'

import 'server-only'

import { query } from '@/core/functions'
import z from 'zod'
import { CourseOutline } from './types'
import { getAllCoursePartsSlugs } from '..'
import { Maybe, none, some } from '@/lib/maybe'
import { CoursePartUserProgression } from '@/payload-types'
import { TIME } from '@/lib/time'

export const getCourseOutline = query({
  name: 'course-outline',
  args: z.object({ course_slug: z.string() }),
  handler: async (ctx, args): Promise<CourseOutline> => {
    const courseDocuments = await ctx.payload.find({
      collection: 'courses',
      where: { slug: { equals: args.course_slug } },
      select: { name: true, orderedChapters: true, slug: true },
      limit: 1,
      depth: 0,
    })

    const chapters = await Promise.all(
      (courseDocuments.docs[0].orderedChapters ?? []).map(async (chapterId) => {
        const chapterDocuments = await ctx.payload.findByID({
          collection: 'chapters',
          id: chapterId as number,
          select: { parts: true, name: true, slug: true },
          depth: 0,
        })

        const partsDocuments = await Promise.all(
          (chapterDocuments.parts ?? []).map(async (partId) => {
            const part = await ctx.payload.findByID({
              collection: 'courseParts',
              id: partId as number,
              select: { slug: true, name: true },
            })

            // TODO: Get actual completion status from user progression
            // For now, defaulting to 'not_started'
            return {
              name: part.name,
              slug: part.slug,
              completionStatus: 'not_started' as const,
            }
          }),
        )

        return {
          name: chapterDocuments.name,
          slug: chapterDocuments.slug,
          parts: partsDocuments,
        }
      }),
    )

    return {
      courseName: courseDocuments.docs[0].name,
      courseSlug: courseDocuments.docs[0].slug,
      chapters: chapters,
    }
  },
  revalidate: 1,
})

export const getChapterOutline = query({
  name: 'chapter-outline',
  args: z.object({ chapter_slug: z.string(), userId: z.string() }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    id: number
    name: string
    slug: string
    completionStatus: CoursePartUserProgression['completionStatus']
  }[]> => {
    const documents = await ctx.payload.find({
      collection: 'chapters',
      where: { slug: { equals: args.chapter_slug } },
      limit: 1,
      depth: 0,
    })

    return await Promise.all(
      (documents.docs[0].parts ?? []).map(async (partId) => {
        const part = await ctx.payload.findByID({
          collection: 'courseParts',
          id: partId as number,
          select: { name: true, slug: true },
        })

        const progressionDocuments = await ctx.payload.find({
          collection: 'coursePartUserProgression',
          where: { part: { equals: partId as number }, userId: { equals: args.userId } },
          limit: 1,
          depth: 0,
          select: { completionStatus: true },
        })

        return {
          id: part.id,
          name: part.name,
          slug: part.slug,
          completionStatus: progressionDocuments.docs[0]?.completionStatus ?? 'not_started'
        }
      }),
    )
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY
})

export const getPreviousPart = query({
  name: 'previous-part',
  args: z.object({ course_slug: z.string(), part_slug: z.string() }),
  handler: async (_, args): Promise<Maybe<{ name: string; slug: string }>> => {
    const partsSlug = await getAllCoursePartsSlugs({ course_slug: args.course_slug })
    const currentPartIndex = partsSlug.findIndex((part) => part.slug === args.part_slug)

    if (currentPartIndex <= 0) {
      return none()
    }

    const previousPart = partsSlug[currentPartIndex - 1]

    return some({
      name: previousPart.name,
      slug: previousPart.slug,
    })
  },
})

export const getNextPart = query({
  name: 'next-part',
  args: z.object({ course_slug: z.string(), part_slug: z.string() }),
  handler: async (_, args): Promise<Maybe<{ name: string; slug: string }>> => {
    const partsSlug = await getAllCoursePartsSlugs({ course_slug: args.course_slug })
    const currentPartIndex = partsSlug.findIndex((part) => part.slug === args.part_slug)

    if (currentPartIndex === -1 || currentPartIndex >= partsSlug.length - 1) {
      return none()
    }

    const nextPart = partsSlug[currentPartIndex + 1]

    return some({
      name: nextPart.name,
      slug: nextPart.slug,
    })
  },
})

export const getRandomCourses = query({
  name: 'random-courses',
  args: z.object({ count: z.number().min(1).max(10).default(4) }),
  handler: async (ctx, args) => {
    const allCourses = await ctx.payload.find({
      collection: 'courses',
      select: { name: true, slug: true, difficulty: true, description: true, ogImage: true, orderedChapters: true },
      depth: 0,
    })

    const shuffled = allCourses.docs.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, args.count)

    return selected.map(course => ({
      id: course.id,
      name: course.name,
      slug: course.slug,
      difficulty: course.difficulty,
      description: course.description,
      ogImage: course.ogImage,
      hasChapters: (course.orderedChapters && course.orderedChapters.length > 0) || false,
    }))
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY,
})
