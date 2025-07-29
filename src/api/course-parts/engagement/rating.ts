'use server'

import { query } from '@/core/functions'
import { QueryCtx } from '@/core/functions/types'
import 'server-only'
import z from 'zod'
import { eq, and } from '@payloadcms/db-postgres/drizzle'
import { course_part_rating } from '@/payload-generated-schema'

export const findCoursePartRating = query({
  name: 'find-course-part-rating',
  args: z.object({
    userId: z.string().uuid(),
    coursePartId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const result = await db
      .select()
      .from(course_part_rating)
      .where(
        and(
          eq(course_part_rating.userId, args.userId),
          eq(course_part_rating.coursePart, args.coursePartId)
        )
      )
      .limit(1)
    return result[0] || null
  },
})

export const createCoursePartRating = query({
  name: 'create-course-part-rating',
  args: z.object({
    userId: z.string().uuid(),
    coursePartId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [created] = await db
      .insert(course_part_rating)
      .values({
        userId: args.userId,
        coursePart: args.coursePartId,
        rating: args.rating.toString(),
      })
      .returning()
    return created
  },
})

export const updateCoursePartRating = query({
  name: 'update-course-part-rating',
  args: z.object({
    ratingId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [updated] = await db
      .update(course_part_rating)
      .set({ rating: args.rating.toString() })
      .where(eq(course_part_rating.id, args.ratingId))
      .returning()
    return updated
  },
})

export const upsertCoursePartRating = query({
  name: 'upsert-course-part-rating',
  args: z.object({
    userId: z.string().uuid(),
    coursePartId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
  }),
  handler: async (_, args) => {
    const found = await findCoursePartRating({ userId: args.userId, coursePartId: args.coursePartId })
    if (found) {
      return await updateCoursePartRating({
        ratingId: found.id,
        rating: args.rating,
      })
    } else {
      return await createCoursePartRating({
        userId: args.userId,
        coursePartId: args.coursePartId,
        rating: args.rating,
      })
    }
  },
})

export const removeCoursePartRating = query({
  name: 'remove-course-part-rating',
  args: z.object({
    ratingId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [deleted] = await db
      .delete(course_part_rating)
      .where(eq(course_part_rating.id, args.ratingId))
      .returning()
    return deleted
  },
})