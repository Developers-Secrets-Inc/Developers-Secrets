'use server'

import { mutation, query, action } from '@/core/functions'
import { isNone, none, some } from '@/lib/maybe'
import 'server-only'
import z from 'zod'
import { createCompletionStatus } from '.'

export const isSolutionUnlocked = action({
  name: 'solution-status',
  args: z.object({ partId: z.number(), userId: z.string().uuid() }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.find({
      collection: 'coursePartUserProgression',
      where: { part: { equals: args.partId }, userId: { equals: args.userId } },
      limit: 1,
      depth: 0,
      select: { isSolutionUnlocked: true },
    })

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
})

export const unlockSolution = mutation({
  name: 'solution-status',
  args: z.object({ partId: z.number(), userId: z.string().uuid() }),
  handler: async (ctx, args) => {
    if (isNone(await isSolutionUnlocked({ partId: args.partId, userId: args.userId }))) {
      await createCompletionStatus({ partId: args.partId, userId: args.userId })
    }

    await ctx.payload.update({
      collection: 'coursePartUserProgression',
      where: { part: { equals: args.partId }, userId: { equals: args.userId } },
      data: { isSolutionUnlocked: true },
    })
  },
})
