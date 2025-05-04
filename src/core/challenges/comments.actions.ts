'use server'

import { Comment } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { validateAuthorId, validateCommentContent } from '@/core/comments/types'

/**
 * Fetches comments associated with a challenge description.
 * @param challengeId The ID of the challenge.
 * @returns A promise resolving to an array of comments.
 */
export const getChallengeDescriptionCommentsAction = async (challengeId: number): Promise<Comment[]> => {
  const payload = await getPayload({ config })
  try {
    const challenge = await payload.findByID({
      collection: 'challenges',
      id: challengeId,
      depth: 2, // Fetch comments and potentially authors/replies within description
    })

    if (!challenge?.description?.comments) {
      return []
    }

    // Ensure comments is an array of Comment objects
    const comments = challenge.description.comments
    if (!Array.isArray(comments)) {
      return []
    }
    return comments.filter((c): c is Comment => typeof c === 'object' && c !== null && 'id' in c)

  } catch (error) {
    console.error(`Error fetching description comments for challenge ${challengeId}:`, error)
    throw new Error('Failed to fetch challenge description comments')
  }
}

/**
 * Fetches comments associated with a challenge's official solution.
 * @param challengeId The ID of the challenge.
 * @returns A promise resolving to an array of comments.
 */
export const getChallengeOfficialSolutionCommentsAction = async (
  challengeId: number,
): Promise<Comment[]> => {
  const payload = await getPayload({ config })
  try {
    const challenge = await payload.findByID({
      collection: 'challenges',
      id: challengeId,
      depth: 2, // Fetch comments and potentially authors/replies within official solution
    })

    if (!challenge?.officialSolution?.comments) {
      return []
    }

    // Ensure comments is an array of Comment objects
    const comments = challenge.officialSolution.comments
    if (!Array.isArray(comments)) {
      return []
    }
    return comments.filter((c): c is Comment => typeof c === 'object' && c !== null && 'id' in c)

  } catch (error) {
    console.error(`Error fetching official solution comments for challenge ${challengeId}:`, error)
    throw new Error('Failed to fetch challenge official solution comments')
  }
}

/**
 * Creates a new top-level comment for a challenge description.
 * @param challengeId The ID of the challenge.
 * @param content The content of the comment.
 * @param authorId The ID of the author.
 * @returns The newly created comment.
 */
export const createDescriptionCommentAction = async (
  challengeId: number,
  content: string,
  authorId: string,
): Promise<Comment> => {
  const payload = await getPayload({ config })
  const validatedContent = validateCommentContent(content)
  const validatedAuthorId = validateAuthorId(authorId)

  try {
    // Create the comment first
    const newComment = await payload.create({
      collection: 'comments',
      data: {
        content: validatedContent,
        authorId: validatedAuthorId,
        isReply: false,
      },
    })

    // Fetch the challenge
    const challenge = await payload.findByID({
      collection: 'challenges',
      id: challengeId,
      depth: 0, // No depth needed for update
    })

    if (!challenge) {
      console.error(`Challenge ${challengeId} not found for description comment ${newComment.id}`)
      throw new Error('Challenge not found')
    }

    const existingComments = challenge.description?.comments?.map(c => typeof c === 'number' ? c : c.id) || []

    // Update challenge with the new comment reference
    await payload.update({
      collection: 'challenges',
      id: challengeId,
      data: {
        description: {
          ...challenge.description,
          comments: [...existingComments, newComment.id],
        },
      },
    })

    return newComment
  } catch (error) {
    console.error(`Error creating description comment for challenge ${challengeId}:`, error)
    throw new Error('Failed to create description comment')
  }
}

/**
 * Creates a new top-level comment for a challenge's official solution.
 * @param challengeId The ID of the challenge.
 * @param content The content of the comment.
 * @param authorId The ID of the author.
 * @returns The newly created comment.
 */
export const createOfficialSolutionCommentAction = async (
  challengeId: number,
  content: string,
  authorId: string,
): Promise<Comment> => {
  const payload = await getPayload({ config })
  const validatedContent = validateCommentContent(content)
  const validatedAuthorId = validateAuthorId(authorId)

  try {
    // Create the comment first
    const newComment = await payload.create({
      collection: 'comments',
      data: {
        content: validatedContent,
        authorId: validatedAuthorId,
        isReply: false,
      },
    })

    // Fetch the challenge
    const challenge = await payload.findByID({
      collection: 'challenges',
      id: challengeId,
      depth: 0, // No depth needed for update
    })

    if (!challenge) {
      console.error(`Challenge ${challengeId} not found for official solution comment ${newComment.id}`)
      throw new Error('Challenge not found')
    }

    const existingComments = challenge.officialSolution?.comments?.map(c => typeof c === 'number' ? c : c.id) || []

    // Update challenge with the new comment reference
    await payload.update({
      collection: 'challenges',
      id: challengeId,
      data: {
        officialSolution: {
          ...challenge.officialSolution,
          comments: [...existingComments, newComment.id],
        },
      },
    })

    return newComment
  } catch (error) {
    console.error(`Error creating official solution comment for challenge ${challengeId}:`, error)
    throw new Error('Failed to create official solution comment')
  }
} 