'use server'

import 'server-only'

import { query, mutation } from '@/core/functions'
import { z } from 'zod'

export const updateLastVisitedCourse = mutation({
  name: 'last-visited-course',
  args: z.object({
    courseSlug: z.string(),
    chapterSlug: z.string(),
    partSlug: z.string(),
    userId: z.string(),
  }),
  handler: async (ctx, args) => {
    // Trouver le course par slug
    const courseResult = await ctx.payload.find({
      collection: 'courses',
      where: { slug: { equals: args.courseSlug } },
      limit: 1,
      depth: 0,
    })

    if (courseResult.docs.length === 0) {
      throw new Error('Course not found')
    }

    const courseId = courseResult.docs[0].id

    // Vérifier si une entrée existe déjà pour cet utilisateur
    const existingResult = await ctx.payload.find({
      collection: 'userLastVisitedCourse',
      where: { userId: { equals: args.userId } },
      limit: 1,
      depth: 0,
    })

    const now = new Date().toISOString()

    if (existingResult.docs.length > 0) {
      // Mettre à jour l'entrée existante
      return await ctx.payload.update({
        collection: 'userLastVisitedCourse',
        id: existingResult.docs[0].id,
        data: {
          course: courseId,
          lastVisitedAt: now,
          lastChapterSlug: args.chapterSlug,
          lastPartSlug: args.partSlug,
        },
      })
    } else {
      // Créer une nouvelle entrée
      return await ctx.payload.create({
        collection: 'userLastVisitedCourse',
        data: {
          userId: args.userId,
          course: courseId,
          lastVisitedAt: now,
          lastChapterSlug: args.chapterSlug,
          lastPartSlug: args.partSlug,
        },
      })
    }
  },
})

export const getLastVisitedCourse = query({
  name: 'last-visited-course',
  args: z.object({
    userId: z.string(),
  }),
  handler: async (ctx, args) => {
    const result = await ctx.payload.find({
      collection: 'userLastVisitedCourse',
      where: { userId: { equals: args.userId } },
      depth: 1, // Charger la relation course
      limit: 1,
      sort: '-lastVisitedAt',
    })

    if (result.docs.length === 0) {
      return null
    }

    const doc = result.docs[0]
    return {
      id: doc.id,
      userId: doc.userId,
      course: doc.course,
      lastVisitedAt: doc.lastVisitedAt,
      lastChapterSlug: doc.lastChapterSlug,
      lastPartSlug: doc.lastPartSlug,
    }
  },
})
