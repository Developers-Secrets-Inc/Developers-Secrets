'use server'

import { mutation, query } from '@/core/functions'
import { isNone, none, some } from '@/lib/maybe'
import { TIME } from '@/lib/time'
import 'server-only'
import z from 'zod'

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

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY
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
  },
})
