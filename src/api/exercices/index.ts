'use server'

import 'server-only'

import { query } from '@/core/functions'
import { none, some } from '@/lib/maybe'
import z from 'zod'

export const getExerciceById = query({
  name: 'exercice-by-id',
  args: z.object({ id: z.number() }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.findByID({
      collection: 'exercices',
      id: args.id,
    })

    return documents ? some(documents) : none()
  },
})


export const getAIExerciceById = query({
  name: 'exercice-by-id',
  args: z.object({ id: z.number() }),
  handler: async (ctx, args) => {
    const documents = await ctx.payload.findByID({
      collection: 'ai-exercices',
      id: args.id,
    })

    return documents ? some(documents) : none()
  },
})
