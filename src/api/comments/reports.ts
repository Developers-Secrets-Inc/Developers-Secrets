'use server'

import 'server-only'
import { query } from '@/core/functions'
import { QueryCtx } from '@/core/functions/types'
import { comments_reports } from '@/payload-generated-schema'
import z from 'zod'
import { eq, and } from '@payloadcms/db-postgres/drizzle'

export const getUserCommentReport = query({
  name: 'get-user-comment-report',
  args: z.object({
    userId: z.string().uuid(),
    commentId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const result = await db
      .select()
      .from(comments_reports)
      .where(
        and(eq(comments_reports.userId, args.userId), eq(comments_reports.comment, args.commentId)),
      )
      .limit(1)
    return result[0] || null
  },
  revalidate: 600,
})

export const createUserCommentReport = query({
  name: 'create-user-comment-report',
  args: z.object({
    userId: z.string().uuid(),
    commentId: z.number().int().positive(),
    reason: z.string().min(1).max(200),
    details: z.string().max(1000).optional(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [created] = await db
      .insert(comments_reports)
      .values({
        userId: args.userId,
        comment: args.commentId,
        reason: args.reason,
        details: args.details,
      })
      .returning()
    return created
  },
})

export const updateUserCommentReport = query({
  name: 'update-user-comment-report',
  args: z.object({
    reportId: z.number().int().positive(),
    reason: z.string().min(1).max(200),
    details: z.string().max(1000).optional(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [updated] = await db
      .update(comments_reports)
      .set({
        reason: args.reason,
        details: args.details,
      })
      .where(eq(comments_reports.id, args.reportId))
      .returning()
    return updated
  },
})

export const upsertUserCommentReport = query({
  name: 'upsert-user-comment-report',
  args: z.object({
    userId: z.string().uuid(),
    commentId: z.number().int().positive(),
    reason: z.string().min(1).max(200),
    details: z.string().max(1000).optional(),
  }),
  handler: async (_, args) => {
    const existing = await getUserCommentReport({
      userId: args.userId,
      commentId: args.commentId,
    })
    if (existing) {
      return await updateUserCommentReport({
        reportId: existing.id,
        reason: args.reason,
        details: args.details,
      })
    } else {
      return await createUserCommentReport(args)
    }
  },
})

export const deleteUserCommentReport = query({
  name: 'delete-user-comment-report',
  args: z.object({
    reportId: z.number().int().positive(),
  }),
  handler: async (ctx: QueryCtx, args) => {
    const db = ctx.drizzle
    const [deleted] = await db
      .delete(comments_reports)
      .where(eq(comments_reports.id, args.reportId))
      .returning()
    return deleted
  },
})
