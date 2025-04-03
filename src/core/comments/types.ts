import { z } from 'zod'
import { Comment } from '@/payload-types'

const AuthorIdSchema = z.string().uuid()
export type AuthorId = z.infer<typeof AuthorIdSchema>

const UserIdSchema = z.string().uuid()
export type UserId = z.infer<typeof UserIdSchema>

const CommentContentSchema = z.string().trim().min(1).max(1000)
export type CommentContent = z.infer<typeof CommentContentSchema>

const CommentIdSchema = z.number().int().positive()
export type CommentId = z.infer<typeof CommentIdSchema>

const VoteTypeSchema = z.enum(['upvote', 'downvote'])
export type VoteType = z.infer<typeof VoteTypeSchema>

const UserVoteSchema = z.object({
  id: z.string().nullable().optional(),
  userId: UserIdSchema,
  voteType: VoteTypeSchema,
})
export type UserVote =
  | (z.infer<typeof UserVoteSchema> & { vote?: never })
  | (Omit<z.infer<typeof UserVoteSchema>, 'voteType'> & {
      vote: z.infer<typeof VoteTypeSchema>
      voteType?: never
    })

export const validateAuthorId = (authorId: string): AuthorId => {
  const result = AuthorIdSchema.safeParse(authorId)
  if (!result.success) {
    throw new Error('Invalid author ID')
  }
  return result.data
}

export const validateCommentContent = (content: string): CommentContent => {
  const result = CommentContentSchema.safeParse(content)
  if (!result.success) {
    throw new Error('Content is empty or too long')
  }
  return result.data
}

export const validateCommentId = (commentId: number): CommentId => {
  const result = CommentIdSchema.safeParse(commentId)
  if (!result.success) {
    throw new Error('Invalid comment ID')
  }
  return result.data
}

export const validateVoteType = (voteType: string): VoteType => {
  const result = VoteTypeSchema.safeParse(voteType)
  if (!result.success) {
    throw new Error('Invalid vote type')
  }
  return result.data
}

export const validateUserVote = (userVote: UserVote): UserVote => {
  const result = UserVoteSchema.safeParse(userVote)
  if (!result.success) {
    throw new Error('Invalid user vote')
  }
  return result.data
}

export const validateUserId = (userId: string): UserId => {
  const result = UserIdSchema.safeParse(userId)
  if (!result.success) {
    throw new Error('Invalid user ID')
  }
  return result.data
}

export interface CommentContext {
  type: string
  parentId: number
  getComments: (parentId: number) => Promise<Comment[]>
  createComment: (parentId: number, content: string, authorId: string) => Promise<Comment>
  deleteComment: (commentId: number) => Promise<void>
  createReply: (parentCommentId: number, content: string, authorId: string) => Promise<Comment>
  updateComment: (commentId: number, content: string) => Promise<Comment>
}

export interface GetCommentsOptions {
  context: CommentContext
  page: number
  limit: number
  userId?: string
}

export interface CommentResponse {
  comments: Comment[]
  totalPages: number
  totalComments: number
}

export const commentContexts = {
  challengeDescription: (challengeId: number): CommentContext => ({
    type: 'challenge_description',
    parentId: challengeId,
    getComments: async (parentId: number) => {
      'use server'
      const { getChallengeDescriptionComments } = await import('@/core/challenges/comments')
      return getChallengeDescriptionComments(parentId)
    },
    createComment: async (parentId: number, content: string, authorId: string) => {
      'use server'
      const { createDescriptionComment } = await import('@/core/challenges/comments')
      return createDescriptionComment(parentId, content, authorId)
    },
    deleteComment: async (commentId: number) => {
      'use server'
      const { deleteComment } = await import('@/core/comments')
      await deleteComment(commentId)
    },
    createReply: async (parentCommentId: number, content: string, authorId: string) => {
      'use server'
      const { createReply } = await import('@/core/comments')
      return createReply(parentCommentId, content, authorId)
    },
    updateComment: async (commentId: number, content: string) => {
      'use server'
      const { modifyComment } = await import('@/core/comments')
      return modifyComment(commentId, content)
    },
  }),

  challengeSolution: (challengeId: number): CommentContext => ({
    type: 'challenge_solution',
    parentId: challengeId,
    getComments: async (parentId: number) => {
      'use server'
      const { getChallengeOfficialSolutionComments } = await import('@/core/challenges/comments')
      return getChallengeOfficialSolutionComments(parentId)
    },
    createComment: async (parentId: number, content: string, authorId: string) => {
      'use server'
      const { createOfficialSolutionComment } = await import('@/core/challenges/comments')
      return createOfficialSolutionComment(parentId, content, authorId)
    },
    deleteComment: async (commentId: number) => {
      'use server'
      const { deleteComment } = await import('@/core/comments')
      await deleteComment(commentId)
    },
    createReply: async (parentCommentId: number, content: string, authorId: string) => {
      'use server'
      const { createReply } = await import('@/core/comments')
      return createReply(parentCommentId, content, authorId)
    },
    updateComment: async (commentId: number, content: string) => {
      'use server'
      const { modifyComment } = await import('@/core/comments')
      return modifyComment(commentId, content)
    },
  }),

  userSolution: (solutionId: number): CommentContext => ({
    type: 'user_solution',
    parentId: solutionId,
    getComments: async (parentId: number) => {
      'use server'
      const { getUserSolutionComments } = await import('@/core/challenges/users-solutions')
      return getUserSolutionComments(parentId)
    },
    createComment: async (parentId: number, content: string, authorId: string) => {
      'use server'
      const { createUserSolutionComment } = await import('@/core/challenges/users-solutions')
      return createUserSolutionComment(parentId, content, authorId)
    },
    deleteComment: async (commentId: number) => {
      'use server'
      const { deleteComment } = await import('@/core/comments')
      await deleteComment(commentId)
    },
    createReply: async (parentCommentId: number, content: string, authorId: string) => {
      'use server'
      const { createReply } = await import('@/core/comments')
      return createReply(parentCommentId, content, authorId)
    },
    updateComment: async (commentId: number, content: string) => {
      'use server'
      const { modifyComment } = await import('@/core/comments')
      return modifyComment(commentId, content)
    },
  }),
}
