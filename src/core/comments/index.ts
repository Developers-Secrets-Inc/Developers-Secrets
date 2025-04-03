'use server'

import { Comment } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import {
  GetCommentsOptions,
  CommentResponse,
  validateAuthorId,
  validateCommentContent,
  validateCommentId,
} from './types'

export const createComment = async (authorId: string, content: string): Promise<void> => {
  const validatedAuthorId = validateAuthorId(authorId)
  const validatedContent = validateCommentContent(content)

  const payload = await getPayload({ config })

  await payload.create({
    collection: 'comments',
    data: {
      authorId: validatedAuthorId,
      content: validatedContent,
    },
  })
}

export const getComments = async ({
  context,
  page = 1,
  limit = 10,
  userId,
}: GetCommentsOptions): Promise<CommentResponse> => {
  const payload = await getPayload({ config })

  // Récupérer les commentaires existants selon le contexte
  const existingComments = await context.getComments(context.parentId)

  // Récupérer les commentaires de l'utilisateur en premier
  const userComments = userId
    ? await payload.find({
        collection: 'comments',
        where: {
          and: [
            { authorId: { equals: userId } },
            { id: { in: existingComments.map((c) => c.id) } },
          ],
        },
        sort: '-createdAt',
      })
    : { docs: [] }

  // Puis les autres commentaires
  const otherComments = await payload.find({
    collection: 'comments',
    where: {
      and: [
        { id: { in: existingComments.map((c) => c.id) } },
        ...(userId ? [{ authorId: { not_equals: userId } }] : []),
      ],
    },
    page,
    limit: userId ? Math.max(0, limit - userComments.docs.length) : limit,
    sort: '-createdAt',
  })

  return {
    comments: [...userComments.docs, ...otherComments.docs].slice(0, limit),
    totalPages: Math.ceil(otherComments.totalDocs / limit),
    totalComments: otherComments.totalDocs + userComments.docs.length,
  }
}

export const getCommentById = async (commentId: number): Promise<Comment> => {
  const validatedCommentId = validateCommentId(commentId)

  const payload = await getPayload({ config })
  const comment = await payload.findByID({ collection: 'comments', id: validatedCommentId })
  return comment
}

export const getLastComment = async (): Promise<Comment> => {
  const payload = await getPayload({ config })
  const comments = await payload.find({
    collection: 'comments',
    sort: '-createdAt',
    limit: 1,
  })

  if (!comments.docs.length) {
    throw new Error('No comments found')
  }

  return comments.docs[0]
}

export const deleteCommentById = async (commentId: number): Promise<void> => {
  const validatedCommentId = validateCommentId(commentId)

  const payload = await getPayload({ config })
  await payload.delete({ collection: 'comments', id: validatedCommentId })
}

export const addReplyToComment = async (
  commentId: number,
  replyContent: string,
  replyAuthorId: string,
): Promise<void> => {
  const validatedReplyContent = validateCommentContent(replyContent)
  const validatedReplyAuthorId = validateAuthorId(replyAuthorId)

  const payload = await getPayload({ config })

  await payload.create({
    collection: 'comments',
    data: {
      authorId: validatedReplyAuthorId,
      content: validatedReplyContent,
      isReply: true,
    },
  })
  const reply = await getLastComment()
  const comment = await getCommentById(commentId)
  await payload.update({
    collection: 'comments',
    id: commentId,
    data: { replies: [...(comment.replies || []), { id: reply.id }] },
  })
}

export const modifyComment = async (commentId: number, newContent: string): Promise<Comment> => {
  const payload = await getPayload({ config })
  const comment = await payload.findByID({ collection: 'comments', id: commentId })

  if (!comment) {
    throw new Error('Comment not found')
  }

  return await payload.update({
    collection: 'comments',
    id: commentId,
    data: { content: newContent },
  })
}

export const deleteComment = async (commentId: number): Promise<void> => {
  'use server'
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'comments',
    id: commentId,
  })
}

export const addUpvote = async (commentId: number, userId: string): Promise<void> => {
  const payload = await getPayload({ config })
  const comment = await payload.findByID({ collection: 'comments', id: commentId })

  if (!comment) {
    throw new Error('Comment not found')
  }

  const existingVote = comment.votes?.find((vote) => vote.userId === userId)
  let updatedVotes = [...(comment.votes || [])]

  if (existingVote) {
    if (existingVote.vote === 'upvote') {
      // Already upvoted, remove the upvote
      updatedVotes = updatedVotes.filter((vote) => vote.userId !== userId)
    } else {
      // Already downvoted, change to upvote
      existingVote.vote = 'upvote'
    }
  } else {
    // Add new upvote
    updatedVotes.push({ userId, vote: 'upvote' })
  }

  await payload.update({
    collection: 'comments',
    id: commentId,
    data: { votes: updatedVotes },
  })
}

export const addDownvote = async (commentId: number, userId: string): Promise<void> => {
  const payload = await getPayload({ config })
  const comment = await payload.findByID({ collection: 'comments', id: commentId })

  if (!comment) {
    throw new Error('Comment not found')
  }

  const existingVote = comment.votes?.find((vote) => vote.userId === userId)
  let updatedVotes = [...(comment.votes || [])]

  if (existingVote) {
    if (existingVote.vote === 'downvote') {
      // Already downvoted, remove the downvote
      updatedVotes = updatedVotes.filter((vote) => vote.userId !== userId)
    } else {
      // Already upvoted, change to downvote
      existingVote.vote = 'downvote'
    }
  } else {
    // Add new downvote
    updatedVotes.push({ userId, vote: 'downvote' })
  }

  await payload.update({
    collection: 'comments',
    id: commentId,
    data: { votes: updatedVotes },
  })
}

export type CommentReport = {
  userId: string
  reason?: string
  details?: string
}

export const reportComment = async (commentId: number, report: CommentReport): Promise<void> => {
  const payload = await getPayload({ config })
  const comment = await payload.findByID({ collection: 'comments', id: commentId })

  if (!comment) {
    throw new Error('Comment not found')
  }

  const newReport = {
    userId: report.userId,
    reason: report.reason || 'unspecified',
    details: report.details || '',
    createdAt: new Date().toISOString(),
  }

  const existingReports = comment.reports || []

  await payload.update({
    collection: 'comments',
    id: commentId,
    data: {
      reports: [...existingReports, newReport],
    },
  })
}

export const replyToComment = async (
  commentId: number,
  authorId: string,
  content: string,
): Promise<void> => {}

export const createReply = async (
  parentCommentId: number,
  content: string,
  authorId: string,
): Promise<Comment> => {
  'use server'
  const payload = await getPayload({ config })

  // Créer la réponse
  const reply = await payload.create({
    collection: 'comments',
    data: {
      content,
      authorId,
      isReply: true,
    },
  })

  // Ajouter la réponse au commentaire parent
  const parentComment = await payload.findByID({
    collection: 'comments',
    id: parentCommentId,
  })

  await payload.update({
    collection: 'comments',
    id: parentCommentId,
    data: {
      replies: [...(parentComment.replies || []), reply.id],
    },
  })

  return reply
}
