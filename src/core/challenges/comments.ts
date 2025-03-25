'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Comment } from '@/payload-types'
import { createComment } from '../comments'
import { getLastComment } from '../comments'

export const getChallengeDescriptionComments = async (
  challengeId: number,
): Promise<Comment[]> => {
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


export const createOfficialSolutionComment = async (
  challengeId: number,
  content: string,
  authorId: string,
): Promise<void> => {
  await createComment(authorId, content)
  const comment = await getLastComment()
  await addCommentToChallengeOfficialSolution(challengeId, comment.id)
}