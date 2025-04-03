'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { UserSolution } from '@/payload-types'
import { getTags } from '@/core/tags'
import { Comment } from '@/payload-types'

type Vote = {
  status: 'upvote' | 'downvote'
  authorId: string
}

type UserSolutionInformations = {
  title: string
  description: string
  content: string
  authorId: string
  tagsIds: number[]
  challengeId: number
}

export const createUserSolution = async (solution: UserSolutionInformations): Promise<void> => {
  const payload = await getPayload({ config })

  // Vérifier si l'utilisateur a déjà une solution pour ce challenge
  const existingSolution = await getUserSolutionsByChallengeId(
    solution.challengeId,
    solution.authorId,
  )
  if (existingSolution) {
    throw new Error('User already has a solution for this challenge')
  }

  await payload.create({
    collection: 'user-solutions',
    data: {
      title: solution.title,
      description: solution.description,
      content: solution.content,
      authorId: solution.authorId,
      tags: solution.tagsIds,
      challenge: solution.challengeId,
    },
  })
}

export const getUserSolutions = async (): Promise<UserSolution[]> => {
  const payload = await getPayload({ config })

  const userSolutions = await payload.find({
    collection: 'user-solutions',
    depth: 1,
  })

  return userSolutions.docs
}

export const getUserSolutionsByChallengeId = async (
  challengeId: number,
  userId: string,
): Promise<UserSolution | null> => {
  const userSolutions = await getUserSolutions()

  // Trouver la solution pour ce challenge spécifique
  const existingSolution = userSolutions.find(
    (solution) =>
      typeof solution.challenge !== 'number' &&
      solution.challenge.id === challengeId &&
      solution.authorId === userId,
  )

  return existingSolution || null
}

export const getUserSolutionById = async (id: string): Promise<UserSolution | null> => {
  const payload = await getPayload({ config })

  const userSolution = await payload.findByID({
    collection: 'user-solutions',
    id,
  })

  return userSolution
}

export const getUserSolutionComments = async (solutionId: number): Promise<Comment[]> => {
  const payload = await getPayload({ config })

  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  return solution?.comments as Comment[]
}

export const addCommentToUserSolution = async (
  solutionId: number,
  commentId: number,
): Promise<void> => {
  const payload = await getPayload({ config })
  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  const existingComments = solution?.comments || []
  await payload.update({
    collection: 'user-solutions',
    id: solutionId,
    data: {
      comments: [...existingComments, { id: commentId }],
    },
  })
}

export const createUserSolutionComment = async (
  solutionId: number,
  content: string,
  authorId: string,
): Promise<Comment> => {
  'use server'
  const payload = await getPayload({ config })

  // Créer le commentaire
  const newComment = await payload.create({
    collection: 'comments',
    data: {
      content,
      authorId,
      isReply: false,
    },
  })

  // Ajouter le commentaire à la solution
  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  await payload.update({
    collection: 'user-solutions',
    id: solutionId,
    data: {
      comments: [...(solution?.comments || []), newComment.id],
    },
  })

  return newComment
}

export const updateUserSolutionTitle = async (id: string, title: string): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-solutions',
    id,
    data: {
      title,
    },
  })
}

export const updateUserSolutionDescription = async (
  id: string,
  description: string,
): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-solutions',
    id,
    data: {
      description,
    },
  })
}

export const updateUserSolutionContent = async (id: string, content: string): Promise<void> => {
  const payload = await getPayload({ config })

  console.log('Updating solution content for ID:', id)
  console.log('New content:', content)

  // Vérifier si la solution existe
  const solution = await payload.findByID({
    collection: 'user-solutions',
    id,
  })

  if (!solution) {
    console.error('Solution not found with ID:', id)
    throw new Error(`Solution not found with ID: ${id}`)
  }

  // Effectuer la mise à jour
  const result = await payload.update({
    collection: 'user-solutions',
    id,
    data: {
      content,
    },
  })

  console.log('Update result:', result)

  // Vérifier que la mise à jour a bien été effectuée
  const updatedSolution = await payload.findByID({
    collection: 'user-solutions',
    id,
  })

  if (updatedSolution.content !== content) {
    console.error('Content was not updated correctly')
    console.log('Expected:', content)
    console.log('Actual:', updatedSolution.content)
    throw new Error('Content update failed')
  }

  console.log('Content updated successfully')
}

export const addUpvote = async (solutionId: string, userId: string): Promise<void> => {
  const payload = await getPayload({ config })

  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  if (!solution) return

  const currentVotes = (solution.votes || []) as Vote[]
  const newVote: Vote = { status: 'upvote', authorId: userId }

  await payload.update({
    collection: 'user-solutions',
    id: solutionId,
    data: {
      votes: [...currentVotes, newVote],
    },
  })
}

export const removeUpvote = async (solutionId: string, userId: string): Promise<void> => {
  const payload = await getPayload({ config })

  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  if (!solution) return

  const currentVotes = (solution.votes || []) as Vote[]
  const updatedVotes = currentVotes.filter(
    (vote) => !(vote.authorId === userId && vote.status === 'upvote'),
  )

  await payload.update({
    collection: 'user-solutions',
    id: solutionId,
    data: {
      votes: updatedVotes,
    },
  })
}

export const addDownvote = async (solutionId: string, userId: string): Promise<void> => {
  const payload = await getPayload({ config })

  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  if (!solution) return

  const currentVotes = (solution.votes || []) as Vote[]
  const newVote: Vote = { status: 'downvote', authorId: userId }

  await payload.update({
    collection: 'user-solutions',
    id: solutionId,
    data: {
      votes: [...currentVotes, newVote],
    },
  })
}

export const removeDownvote = async (solutionId: string, userId: string): Promise<void> => {
  const payload = await getPayload({ config })

  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  if (!solution) return

  const currentVotes = (solution.votes || []) as Vote[]
  const updatedVotes = currentVotes.filter(
    (vote) => !(vote.authorId === userId && vote.status === 'downvote'),
  )

  await payload.update({
    collection: 'user-solutions',
    id: solutionId,
    data: {
      votes: updatedVotes,
    },
  })
}

export const addViews = async (id: string): Promise<void> => {
  const payload = await getPayload({ config })

  const solution = await payload.findByID({
    collection: 'user-solutions',
    id,
  })

  if (!solution) return

  await payload.update({
    collection: 'user-solutions',
    id,
    data: {
      views: (solution.views || 0) + 1,
    },
  })
}

export const updateTags = async (id: string, tagIds: number[]): Promise<void> => {
  const payload = await getPayload({ config })

  // Récupérer la solution actuelle pour comparer les tags
  const currentSolution = await payload.findByID({
    collection: 'user-solutions',
    id,
  })

  // Convertir les tags actuels en nombres si ce sont des strings
  const currentTagIds = (currentSolution.tags || []).map((tag) =>
    typeof tag === 'string' ? parseInt(tag) : typeof tag === 'object' ? tag.id : tag,
  )

  // Trouver les tags qui ont été retirés
  const removedTagIds = currentTagIds.filter((id) => !tagIds.includes(id))

  // Mettre à jour les compteurs d'utilisation des tags
  if (removedTagIds.length > 0) {
    for (const tagId of removedTagIds) {
      const tag = await payload.findByID({
        collection: 'tags',
        id: tagId,
      })

      if (tag) {
        await payload.update({
          collection: 'tags',
          id: tagId,
          data: {
            usageCount: Math.max(0, (tag.usageCount || 0) - 1),
            lastUsedAt: new Date().toISOString(),
          },
        })
      }
    }
  }

  // Trouver les nouveaux tags ajoutés
  const addedTagIds = tagIds.filter((id) => !currentTagIds.includes(id))

  // Mettre à jour les compteurs d'utilisation des nouveaux tags
  if (addedTagIds.length > 0) {
    for (const tagId of addedTagIds) {
      const tag = await payload.findByID({
        collection: 'tags',
        id: tagId,
      })

      if (tag) {
        await payload.update({
          collection: 'tags',
          id: tagId,
          data: {
            usageCount: (tag.usageCount || 0) + 1,
            lastUsedAt: new Date().toISOString(),
          },
        })
      }
    }
  }

  // Mettre à jour les tags de la solution
  await payload.update({
    collection: 'user-solutions',
    id,
    data: {
      tags: tagIds,
    },
  })
}

// =============

import { Tag as PayloadTag } from '@/payload-types'
import { createComment, getLastComment } from '@/core/comments'

type SolutionWithConvertedTags = Omit<UserSolution, 'tags'> & { tags: PayloadTag[] }

export const getUserSolution = async (
  challengeId: number,
  userId: string,
): Promise<SolutionWithConvertedTags> => {
  const ALL_SOLUTIONS = await getUserSolutions()

  const SOLUTION = ALL_SOLUTIONS.find((solution) => {
    const { challenge, authorId } = solution
    return typeof challenge !== 'number' && challenge.id === challengeId && authorId === userId
  })

  if (!SOLUTION) {
    throw new Error(`Solution not found for challenge ID: ${challengeId} and user ID: ${userId}`)
  }

  if (SOLUTION.tags && Array.isArray(SOLUTION.tags) && typeof SOLUTION.tags[0] === 'object') {
    return {
      ...SOLUTION,
      tags: SOLUTION.tags as PayloadTag[],
    }
  }

  const ALL_TAGS = await getTags()
  const solutionTagIds = Array.isArray(SOLUTION.tags) ? SOLUTION.tags : []
  const normalizedTagIds = solutionTagIds.map((id) => (typeof id === 'string' ? parseInt(id) : id))

  const SOLUTION_TAGS = ALL_TAGS.filter((tag) => normalizedTagIds.includes(tag.id))

  return {
    ...SOLUTION,
    tags: SOLUTION_TAGS,
  }
}

type Report = {
  userId: string
  reason: string
  details?: string
  createdAt: string
}

export const addReportToUserSolution = async (
  solutionId: string,
  report: Report,
): Promise<void> => {
  const payload = await getPayload({ config })
  const solution = await payload.findByID({
    collection: 'user-solutions',
    id: solutionId,
  })

  const existingReports = solution?.reports || []
  await payload.update({
    collection: 'user-solutions',
    id: solutionId,
    data: {
      reports: [...existingReports, report],
    },
  })
}
