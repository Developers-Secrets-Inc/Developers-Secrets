'use server'

import 'server-only'

import { query } from '@/core/functions'
import { QueryCtx } from '@/core/functions/types'
import z from 'zod'
import { eq, and } from '@payloadcms/db-postgres/drizzle'
import { course_part_engagement } from '@/payload-generated-schema'
import { CoursePartEngagement } from '@/payload-types'

export const findUserCoursePartEngagement = query({
  name: 'find-course-part-engagement',
  args: z.object({
    userId: z.string().uuid(),
    coursePartId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args): Promise<CoursePartEngagement> => {
    const db = ctx.drizzle
    const result = await db
      .select()
      .from(course_part_engagement)
      .where(
        and(
          eq(course_part_engagement.userId, args.userId),
          eq(course_part_engagement.coursePart, args.coursePartId),
        ),
      )
      .limit(1)
    return result[0] || null
  },
})

export const createUserCoursePartEngagement = query({
  name: 'create-course-part-engagement',
  args: z.object({
    userId: z.string().uuid(),
    coursePartId: z.number().int().positive(),
    type: z.enum(['like', 'dislike']),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [created] = await db
      .insert(course_part_engagement)
      .values({
        userId: args.userId,
        coursePart: args.coursePartId,
        type: args.type,
      })
      .returning()
    return created
  },
})

export const updateUserCoursePartEngagement = query({
  name: 'update-course-part-engagement',
  args: z.object({
    engagementId: z.number().int().positive(),
    type: z.enum(['like', 'dislike']),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [updated] = await db
      .update(course_part_engagement)
      .set({ type: args.type })
      .where(eq(course_part_engagement.id, args.engagementId))
      .returning()
    return updated
  },
})

export const removeUserCoursePartEngagement = query({
  name: 'remove-course-part-engagement',
  args: z.object({
    engagementId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [deleted] = await db
      .delete(course_part_engagement)
      .where(eq(course_part_engagement.id, args.engagementId))
      .returning()
    return deleted
  },
})