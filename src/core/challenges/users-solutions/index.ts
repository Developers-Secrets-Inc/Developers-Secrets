import { getPayload } from 'payload'
import config from '@payload-config'
import { UserSolution } from '@/payload-types'

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
  })

  return userSolutions.docs
}

export const getUserSolutionById = async (id: string): Promise<UserSolution | null> => {
  const payload = await getPayload({ config })

  const userSolution = await payload.findByID({
    collection: 'user-solutions',
    id,
  })

  return userSolution
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

  await payload.update({
    collection: 'user-solutions',
    id,
    data: {
      content,
    },
  })
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

  await payload.update({
    collection: 'user-solutions',
    id,
    data: {
      tags: tagIds,
    },
  })
}
