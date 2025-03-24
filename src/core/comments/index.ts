'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Comment } from '@/payload-types'

const isContentEmpty = (content: string): boolean => {
  return content.trim().length === 0
}

const isContentTooLong = (content: string): boolean => {
  return content.length > 1000
}

export const createComment = async (authorId: string, content: string): Promise<void> => {
  if (isContentEmpty(content) || isContentTooLong(content)) {
    throw new Error('Content is empty or too long')
  }

  const payload = await getPayload({ config })

  await payload.create({
    collection: 'comments',
    data: {
      authorId,
      content,
    },
  })
}

export const addCommentToChallengeDescription = async (
  challengeId: number,
  commentId: number,
): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await payload.findByID({
    collection: 'challenges',
    id: challengeId,
  })

  const existingComments = challenge?.description?.comments || []
  await payload.update({
    collection: 'challenges',
    id: challengeId,
    data: {
      description: {
        comments: [...existingComments, { id: commentId }],
      },
    },
  })
}

export const addCommentToChallengeOfficialSolution = async (
  challengeId: number,
  commentId: number,
): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await payload.findByID({
    collection: 'challenges',
    id: challengeId,
  })

  const existingComments = challenge?.officialSolution?.comments || []
  await payload.update({
    collection: 'challenges',
    id: challengeId,
    data: {
      officialSolution: {
        comments: [...existingComments, { id: commentId }],
      },
    },
  })
}

export const createDescriptionComment = async (
  challengeId: number,
  content: string,
  authorId: string,
): Promise<void> => {
  await createComment(authorId, content)
  const comment = await getLastComment()
  await addCommentToChallengeDescription(challengeId, comment.id)
}


export const addReplyToComment = async (commentId: number, replyContent: string, replyAuthorId: string): Promise<void> => {
  if (isContentEmpty(replyContent) || isContentTooLong(replyContent)) {
    throw new Error('Content is empty or too long')
  }

  const payload = await getPayload({ config })

  await payload.create({
    collection: 'comments',
    data: {
      authorId: replyAuthorId,
      content: replyContent,
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

export const getCommentById = async (commentId: number): Promise<Comment> => {
  const payload = await getPayload({ config })
  const comment = await payload.findByID({ collection: 'comments', id: commentId })
  return comment
}

export const getLastComment = async (): Promise<Comment> => {
  const payload = await getPayload({ config })

  const comments = await payload.find({
    collection: 'comments',
    limit: 1,
  })

  if (comments.docs.length === 0) {
    throw new Error('No comments found')
  }

  return comments.docs[0]
}

export const getChallengeDescriptionComments = async (challengeId: number): Promise<Comment[]> => {
  const payload = await getPayload({ config })

  const challenge = await payload.findByID({
    collection: 'challenges',
    id: challengeId,
  })

  return challenge.description.comments as Comment[]
}

export const getChallengeOfficialSolutionComments = async (
  challengeId: number,
): Promise<Comment[]> => {
  const payload = await getPayload({ config })

  const challenge = await payload.findByID({
    collection: 'challenges',
    id: challengeId,
  })

  return challenge.officialSolution.comments as Comment[]
}

export const modifyComment = async (commentId: number, newContent: string): Promise<void> => {}
export const deleteComment = async (commentId: number): Promise<void> => {}



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

export const reportComment = async (commentId: number, report: CommentReport): Promise<void> => {}
export const replyToComment = async (
  commentId: number,
  authorId: string,
  content: string,
): Promise<void> => {}
