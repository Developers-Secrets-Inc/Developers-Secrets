'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Comment } from '@/payload-types'

// import { getPayload } from 'payload'
// import config from '@payload-config'
// import type { Comment as PayloadComment } from '@/payload-types'
// import type { User } from '@/types/user'
// import { getPayloadChallenge } from '../challenges'
// import { getUserById } from '../user'
// import {
//   CommentAlreadyReportedError,
//   CommentChallengeNotFoundError,
//   CommentContentEmptyError,
//   CommentContentTooLongError,
//   CommentDatabaseError,
//   CommentNotFoundError,
//   CommentParentNotFoundError,
//   CommentUnauthorizedError,
// } from './errors'

// // Types
// export type CommentTargetType = 'description' | 'officialSolution' | 'userSolution'

// export interface Comment extends PayloadComment {
//   author: User
// }

// export interface CreateCommentData {
//   content: string
//   authorId: string
//   challengeId: number
//   targetType: CommentTargetType
//   parentId?: string
// }

// export interface UpdateCommentData {
//   content?: string
// }

// export interface ReportCommentData {
//   userId: string
//   reason: string
//   details?: string
// }

// export interface CommentReport {
//   userId: string
//   reason: string
//   details?: string | null
//   createdAt: string
//   id?: string | null
// }

// // Validation
// const validateCommentContent = (content: string): void => {
//   if (!content || content.trim().length === 0) {
//     throw new CommentContentEmptyError()
//   }
//   if (content.length > 1000) {
//     throw new CommentContentTooLongError()
//   }
// }

// // Fonctions de base
// export const getComment = async (commentId: string): Promise<Comment> => {
//   try {
//     const payload = await getPayload({ config })
//     const comment = await payload.findByID({
//       collection: 'comments',
//       id: commentId,
//     })

//     if (!comment) {
//       throw new CommentNotFoundError()
//     }

//     // Récupérer les informations de l'utilisateur
//     const user = await getUserById(comment.authorId)

//     return {
//       ...comment,
//       author: user,
//     }
//   } catch (error) {
//     if (error instanceof CommentNotFoundError) {
//       throw error
//     }
//     throw new CommentDatabaseError()
//   }
// }

// export const createComment = async (data: CreateCommentData): Promise<void> => {
//   try {
//     validateCommentContent(data.content)

//     const payload = await getPayload({ config })

//     // Vérifier si le challenge existe
//     const challenge = await getPayloadChallenge(data.challengeId)

//     if (!challenge) {
//       throw new CommentChallengeNotFoundError()
//     }

//     // Si c'est une réponse, vérifier si le commentaire parent existe
//     if (data.parentId) {
//       const parentComment = await getComment(data.parentId)
//       if (!parentComment) {
//         throw new CommentParentNotFoundError()
//       }
//     }

//     await payload.create({
//       collection: 'comments',
//       data: {
//         content: data.content,
//         authorId: data.authorId,
//         challenge: challenge,
//         targetType: data.targetType,
//         parentId: data.parentId,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     })
//   } catch (error) {
//     if (
//       error instanceof CommentContentEmptyError ||
//       error instanceof CommentContentTooLongError ||
//       error instanceof CommentChallengeNotFoundError ||
//       error instanceof CommentParentNotFoundError
//     ) {
//       throw error
//     }
//     throw new CommentDatabaseError()
//   }
// }

// export const updateComment = async (
//   commentId: string,
//   userId: string,
//   data: UpdateCommentData,
// ): Promise<Comment> => {
//   try {
//     const comment = await getComment(commentId)

//     if (comment.authorId !== userId) {
//       throw new CommentUnauthorizedError()
//     }

//     if (data.content) {
//       validateCommentContent(data.content)
//     }

//     const payload = await getPayload({ config })
//     const updatedComment = await payload.update({
//       collection: 'comments',
//       id: commentId,
//       data: {
//         ...data,
//         updatedAt: new Date().toISOString(),
//       },
//     })

//     // Récupérer les informations de l'utilisateur pour le commentaire mis à jour
//     const user = await getUserById(updatedComment.authorId)
//     return {
//       ...updatedComment,
//       author: user,
//     }
//   } catch (error) {
//     if (
//       error instanceof CommentNotFoundError ||
//       error instanceof CommentUnauthorizedError ||
//       error instanceof CommentContentEmptyError ||
//       error instanceof CommentContentTooLongError
//     ) {
//       throw error
//     }
//     throw new CommentDatabaseError()
//   }
// }

// export const deleteComment = async (commentId: string, userId: string): Promise<void> => {
//   try {
//     const comment = await getComment(commentId)

//     if (comment.authorId !== userId) {
//       throw new CommentUnauthorizedError()
//     }

//     const payload = await getPayload({ config })
//     await payload.delete({
//       collection: 'comments',
//       id: commentId,
//     })
//   } catch (error) {
//     if (error instanceof CommentNotFoundError || error instanceof CommentUnauthorizedError) {
//       throw error
//     }
//     throw new CommentDatabaseError()
//   }
// }

// export const voteComment = async (
//   commentId: string,
//   userId: string,
//   vote: 'up' | 'down',
// ): Promise<Comment> => {
//   try {
//     const comment = await getComment(commentId)
//     const payload = await getPayload({ config })

//     // TODO: Vérifier si l'utilisateur a déjà voté
//     // Cette vérification nécessitera une nouvelle collection pour stocker les votes

//     const voteValue = vote === 'up' ? 1 : -1
//     const updatedComment = await payload.update({
//       collection: 'comments',
//       id: commentId,
//       data: {
//         votes: (comment.votes || 0) + voteValue,
//         updatedAt: new Date().toISOString(),
//       },
//     })

//     // Récupérer les informations de l'utilisateur
//     const user = await getUserById(updatedComment.authorId)
//     return {
//       ...updatedComment,
//       author: user,
//     }
//   } catch (error) {
//     if (error instanceof CommentNotFoundError) {
//       throw error
//     }
//     throw new CommentDatabaseError()
//   }
// }

// export const reportComment = async (
//   commentId: string,
//   userId: string,
//   data: ReportCommentData,
// ): Promise<Comment> => {
//   try {
//     const comment = await getComment(commentId)
//     const payload = await getPayload({ config })

//     // Vérifier si l'utilisateur a déjà signalé ce commentaire
//     const existingReport = (comment.reports || []).find(
//       (report: CommentReport) => report.userId === userId,
//     )
//     if (existingReport) {
//       throw new CommentAlreadyReportedError()
//     }

//     const updatedComment = await payload.update({
//       collection: 'comments',
//       id: commentId,
//       data: {
//         reports: [
//           ...(comment.reports || []),
//           {
//             ...data,
//             createdAt: new Date().toISOString(),
//           },
//         ],
//         updatedAt: new Date().toISOString(),
//       },
//     })

//     // Récupérer les informations de l'utilisateur
//     const user = await getUserById(updatedComment.authorId)
//     return {
//       ...updatedComment,
//       author: user,
//     }
//   } catch (error) {
//     if (error instanceof CommentNotFoundError || error instanceof CommentAlreadyReportedError) {
//       throw error
//     }
//     throw new CommentDatabaseError()
//   }
// }

// export const getCommentsByChallenge = async (
//   challengeId: string,
//   targetType: CommentTargetType,
//   page: number = 1,
//   limit: number = 10,
// ): Promise<{ comments: Comment[]; total: number }> => {
//   try {
//     const payload = await getPayload({ config })
//     const result = await payload.find({
//       collection: 'comments',
//       where: {
//         challenge: {
//           equals: challengeId,
//         },
//         targetType: {
//           equals: targetType,
//         },
//       },
//       page,
//       limit,
//       depth: 1,
//     })

//     return {
//       comments: result.docs as Comment[],
//       total: result.totalDocs,
//     }
//   } catch (_error) {
//     throw new CommentDatabaseError()
//   }
// }

// export const getReplies = async (
//   commentId: string,
//   page: number = 1,
//   limit: number = 10,
// ): Promise<{ comments: Comment[]; total: number }> => {
//   try {
//     const payload = await getPayload({ config })
//     const result = await payload.find({
//       collection: 'comments',
//       where: {
//         parentId: {
//           equals: commentId,
//         },
//       },
//       page,
//       limit,
//       depth: 1,
//     })

//     return {
//       comments: result.docs as Comment[],
//       total: result.totalDocs,
//     }
//   } catch (_error) {
//     throw new CommentDatabaseError()
//   }
// }

// export const addCommentToChallenge = async (
//   challengeId: number,
//   commentId: string,
//   targetType: CommentTargetType,
// ) => {
//   const payload = await getPayload({ config })
//   await payload.update({
//     collection: 'challenges',
//     id: challengeId,
//     data: {
//       [targetType]: {
//         connect: {
//           id: commentId,
//         },
//       },
//     },
//   })
// }

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


export const modifyComment = async (commentId: string, newContent: string): Promise<void> => {}
export const deleteComment = async (commentId: string): Promise<void> => {}

export const upvoteComment = async (commentId: string): Promise<void> => {}
export const downvoteComment = async (commentId: string): Promise<void> => {}

export type CommentReport = {
  userId: string
  reason?: string
  details?: string
}

export const reportComment = async (commentId: string, report: CommentReport): Promise<void> => {}
export const replyToComment = async (commentId: string, authorId: string, content: string): Promise<void> => {}