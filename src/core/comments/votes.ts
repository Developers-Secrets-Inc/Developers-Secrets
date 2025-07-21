import { getCommentById } from '.'
import { UserVote, validateCommentId, validateUserId, validateUserVote, validateVoteType } from './types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getCommentVotes = async (commentId: number): Promise<UserVote[]> => {
  const validatedCommentId = validateCommentId(commentId)
  const comment = await getCommentById(validatedCommentId)
  return comment.votes || ([] as UserVote[])
}

export const getCommentVoteCount = async (commentId: number): Promise<number> => {
  const votes = await getCommentVotes(commentId)
  return votes.length
}

export const hasUserVoted = async (commentId: number, userId: string): Promise<boolean> => {
  const votes = await getCommentVotes(commentId)
  return votes.some((vote) => vote.userId === userId)
}

export const getUserVote = async (commentId: number, userId: string): Promise<UserVote> => {
  const votes = await getCommentVotes(commentId)
  const vote = votes.find((vote) => vote.userId === userId)

  if (!vote) {
    throw new Error('User has not voted on this comment')
  }

  return vote
}

export const addVote = async (commentId: number, userVote: UserVote): Promise<void> => {
  const validatedCommentId = validateCommentId(commentId)
  const validatedUserVote = validateUserVote(userVote)

  const existingVotes = await getCommentVotes(validatedCommentId)

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'comments',
    id: validatedCommentId,
    data: {
      votes: [...existingVotes, validatedUserVote],
    },
  })
}

export const removeVote = async (commentId: number, userVote: UserVote): Promise<void> => {
  const validatedCommentId = validateCommentId(commentId)
  const validatedUserVote = validateUserVote(userVote)

  const existingVotes = await getCommentVotes(validatedCommentId)
  const updatedVotes = existingVotes.filter((vote) => vote.id !== validatedUserVote.id)

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'comments',
    id: validatedCommentId,
    data: {
      votes: updatedVotes,
    },
  })
}

const switchVote = async (
  commentId: number,
  userId: string,
  newVoteType: 'upvote' | 'downvote',
): Promise<void> => {
  const validatedCommentId = validateCommentId(commentId)
  const validatedUserId = validateUserId(userId)
  const validatedNewVoteType = validateVoteType(newVoteType)

  const hasAlreadyVoted = await hasUserVoted(validatedCommentId, validatedUserId)
  if (!hasAlreadyVoted) {
    // No existing vote - add new vote
    return await addVote(validatedCommentId, {
      userId: validatedUserId,
      voteType: validatedNewVoteType,
    })
  }

  const userVote = await getUserVote(validatedCommentId, validatedUserId)
  const isSameVoteType = userVote.voteType === validatedNewVoteType || userVote.vote === validatedNewVoteType

  if (isSameVoteType) {
    // Already voted same type - remove vote
    return await removeVote(validatedCommentId, userVote)
  }

  // Has opposite vote - remove it and add new vote
  await removeVote(validatedCommentId, userVote)
  await addVote(validatedCommentId, {
    userId: validatedUserId,
    voteType: validatedNewVoteType,
  })
}

export const upvoteComment = async (commentId: number, userId: string): Promise<void> => {
  await switchVote(commentId, userId, 'upvote')
}

export const downvoteComment = async (commentId: number, userId: string): Promise<void> => {
  await switchVote(commentId, userId, 'downvote')
}
