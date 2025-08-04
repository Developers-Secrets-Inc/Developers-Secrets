'use server'

import 'server-only'

import { action, query } from '@/core/functions'
import z from 'zod'
import { CourseOutline } from './types'
import { getAllCoursePartsSlugs } from '..'
import { isNone, Maybe, none, some } from '@/lib/maybe'
import { Course, CoursePartUserProgression } from '@/payload-types'
import { TIME } from '@/lib/time'
import { getCoursePartCompletionStatus } from '../progression'

export const getCourseOutline = query({
  name: 'course-outline',
  args: z.object({ course_slug: z.string() }),
  handler: async (ctx, args): Promise<CourseOutline & { status: string }> => {
    const courseDocuments = await ctx.payload.find({
      collection: 'courses',
      where: { slug: { equals: args.course_slug } },
      select: { name: true, orderedChapters: true, slug: true, status: true },
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
      status: courseDocuments.docs[0].status || 'published',
    }
  },
})

export const getChapterOutline = action({
  name: 'chapter-outline',
  args: z.object({ chapter_slug: z.string(), userId: z.string() }),
  handler: async (
    ctx,
    args,
  ): Promise<
    {
      id: number
      name: string
      slug: string
      completionStatus: CoursePartUserProgression['completionStatus']
    }[]
  > => {
    const documents = await ctx.payload.find({
      collection: 'chapters',
      where: { slug: { equals: args.chapter_slug } },
      limit: 1,
      depth: 0,
    })

    const status = await Promise.all(
      (documents.docs[0].parts ?? []).map(async (partId) => {
        const part = await ctx.payload.findByID({
          collection: 'courseParts',
          id: partId as number,
          select: { name: true, slug: true },
        })

        const progressionDocuments = await getCoursePartCompletionStatus({
          userId: args.userId,
          partId: partId as number,
        })

        return {
          id: part.id,
          name: part.name,
          slug: part.slug,
          completionStatus: isNone(progressionDocuments)
            ? 'not_started'
            : progressionDocuments.value.completionStatus,
        }
      }),
    )

    return status
  },
})

const getCourseChaptersIds = query({
  name: 'course-chapters-ids',
  args: z.object({ courseSlug: z.string() }),
  handler: async (ctx, args): Promise<Maybe<number[]>> => {
    const documents = await ctx.payload.find({
      collection: 'courses',
      where: { slug: { equals: args.courseSlug } },
      depth: 0,
      limit: 1,
    })

    const course = documents.docs[0]

    if (!course) return none()

    return course.orderedChapters
      ? some(
          course.orderedChapters.map((chapter) =>
            typeof chapter === 'number' ? chapter : chapter.id,
          ),
        )
      : none()
  },
  revalidate: TIME.ONE_DAY,
})

export const getPreviousPart = query({
  name: 'previous-part',
  args: z.object({ courseSlug: z.string(), partSlug: z.string() }),
  handler: async (_, args): Promise<Maybe<{ name: string; slug: string; chapterSlug: string }>> => {
    const courseOutline = await getCourseOutline({ course_slug: args.courseSlug })

    // Créer une liste plate de toutes les parties avec leur chapitre
    const allParts: Array<{ chapterSlug: string; part: { name: string; slug: string } }> = []

    for (const chapter of courseOutline.chapters) {
      for (const part of chapter.parts) {
        allParts.push({
          chapterSlug: chapter.slug,
          part: {
            name: part.name,
            slug: part.slug,
          },
        })
      }
    }

    const currentPartIndex = allParts.findIndex((item) => item.part.slug === args.partSlug)

    if (currentPartIndex <= 0) {
      return none()
    }

    const previousPart = allParts[currentPartIndex - 1]

    return some({
      name: previousPart.part.name,
      slug: previousPart.part.slug,
      chapterSlug: previousPart.chapterSlug,
    })
  },
})

export const getNextPart = query({
  name: 'next-part',
  args: z.object({ courseSlug: z.string(), partSlug: z.string() }),
  handler: async (_, args): Promise<Maybe<{ name: string; slug: string; chapterSlug: string }>> => {
    const courseOutline = await getCourseOutline({ course_slug: args.courseSlug })

    // Créer une liste plate de toutes les parties avec leur chapitre
    const allParts: Array<{ chapterSlug: string; part: { name: string; slug: string } }> = []

    for (const chapter of courseOutline.chapters) {
      for (const part of chapter.parts) {
        allParts.push({
          chapterSlug: chapter.slug,
          part: {
            name: part.name,
            slug: part.slug,
          },
        })
      }
    }

    const currentPartIndex = allParts.findIndex((item) => item.part.slug === args.partSlug)

    if (currentPartIndex === -1 || currentPartIndex >= allParts.length - 1) {
      return none()
    }

    const nextPart = allParts[currentPartIndex + 1]

    return some({
      name: nextPart.part.name,
      slug: nextPart.part.slug,
      chapterSlug: nextPart.chapterSlug,
    })
  },
})

export const getRandomCourses = query({
  name: 'random-courses',
  args: z.object({ count: z.number().min(1).max(10).default(4) }),
  handler: async (ctx, args) => {
    const allCourses = await ctx.payload.find({
      collection: 'courses',
      where: { status: { equals: 'published' } },
      select: {
        name: true,
        slug: true,
        difficulty: true,
        description: true,
        ogImage: true,
        orderedChapters: true,
        status: true,
      },
      depth: 0,
    })

    const shuffled = allCourses.docs.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, args.count)

    return selected.map((course) => ({
      id: course.id,
      name: course.name,
      slug: course.slug,
      difficulty: course.difficulty,
      description: course.description,
      ogImage: course.ogImage,
      hasChapters: (course.orderedChapters && course.orderedChapters.length > 0) || false,
      status: course.status || 'published',
    }))
  },
  revalidate: TIME.ONE_DAY,
})
