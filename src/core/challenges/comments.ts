'use server'

import { Comment } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

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

export const createOfficialSolutionComment = async (
  challengeId: number,
  content: string,
  authorId: string,
): Promise<Comment> => {
  'use server'
  const payload = await getPayload({ config })

  // Créer d'abord le commentaire
  const newComment = await payload.create({
    collection: 'comments',
    data: {
      content,
      authorId,
      isReply: false,
    },
  })

  // Récupérer le challenge
  const challenge = await payload.findByID({
    collection: 'challenges',
    id: challengeId,
  })

  const existingComments = challenge?.officialSolution?.comments || []

  // Mettre à jour le challenge avec la référence au nouveau commentaire
  await payload.update({
    collection: 'challenges',
    id: challengeId,
    data: {
      officialSolution: {
        ...challenge?.officialSolution,
        comments: [...existingComments, newComment.id],
      },
    },
  })

  return newComment
}
