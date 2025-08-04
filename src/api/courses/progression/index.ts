'use server'

import { makeCacheKey, mutation, query } from '@/core/functions'
import { isNone, none, some } from '@/lib/maybe'
import 'server-only'
import z from 'zod'
import { getAllCoursePartsSlugs } from '..'
import { revalidateTag } from 'next/cache'

export const getCoursePartCompletionStatus = query({
  name: 'course-part-completion-status',
  args: z.object({ partId: z.number(), userId: z.string().uuid() }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.find({
      collection: 'coursePartUserProgression',
      where: { part: { equals: args.partId }, userId: { equals: args.userId } },
      limit: 1,
      depth: 0,
      select: { completionStatus: true },
    })

    console.log(documents.docs[0])

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
})

export const createCompletionStatus = mutation({
  name: 'create-course-part-completion-status',
  args: z.object({ partId: z.number(), userId: z.string().uuid() }),
  handler: async (ctx, args) => {
    await ctx.payload.create({
      collection: 'coursePartUserProgression',
      data: {
        userId: args.userId,
        part: args.partId,
        completionStatus: 'not_started',
        isSolutionUnlocked: false,
      },
    })
  },
})

export const setCoursePartCompletionStatus = mutation({
  name: 'course-part-completion-status',
  args: z.object({
    partId: z.number(),
    userId: z.string().uuid(),
    newStatus: z.enum(['not_started', 'in_progress', 'completed']),
  }),
  handler: async (ctx, args) => {
    if (isNone(await getCoursePartCompletionStatus({ partId: args.partId, userId: args.userId }))) {
      await createCompletionStatus({ partId: args.partId, userId: args.userId })
    }

    await ctx.payload.update({
      collection: 'coursePartUserProgression',
      where: { part: { equals: args.partId }, userId: { equals: args.userId } },
      data: { completionStatus: args.newStatus },
    })

    revalidateTag(
      makeCacheKey('course-part-completion-status', { userId: args.userId, partId: args.partId }),
    )
  },
})

export const setInProgress = mutation({
  name: 'course-part-in-progress',
  args: z.object({
    partId: z.number(),
    userId: z.string().uuid(),
  }),
  handler: async (_, args) => {
    await setCoursePartCompletionStatus({
      partId: args.partId,
      userId: args.userId,
      newStatus: 'in_progress',
    })
  },
})

export const setCompleted = mutation({
  name: 'course-part-completed',
  args: z.object({
    partId: z.number(),
    userId: z.string().uuid(),
  }),
  handler: async (_, args) => {
    await setCoursePartCompletionStatus({
      partId: args.partId,
      userId: args.userId,
      newStatus: 'completed',
    })
  },
})

export const getCourseProgression = query({
  name: 'course-progression',
  args: z.object({ courseSlug: z.string(), userId: z.string().uuid() }),
  handler: async (ctx, args): Promise<number> => {
    const courseParts = await getAllCoursePartsSlugs({ course_slug: args.courseSlug })
    if (!courseParts || courseParts.length === 0) return 0
    let completedCount = 0
    for (const part of courseParts) {
      const statusResult = await getCoursePartCompletionStatus({
        partId: part.id,
        userId: args.userId,
      })
      if (statusResult._tag === 'some' && statusResult.value.completionStatus === 'completed') {
        completedCount++
      }
    }
    return completedCount / courseParts.length
  },
})
