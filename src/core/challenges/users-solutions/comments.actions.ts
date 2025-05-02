'use server'

import { Comment, UserSolution } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { validateAuthorId, validateCommentContent } from '@/core/comments/types' // Assuming types are relevant here

/**
 * Fetches comments associated with a specific user solution.
 * Comments are fetched with depth 1 to include potential replies.
 * @param solutionId The ID of the user solution.
 * @returns A promise resolving to an array of comments.
 */
export const getUserSolutionCommentsAction = async (solutionId: number): Promise<Comment[]> => {
  const payload = await getPayload({ config })
  try {
    const solution = await payload.findByID({
      collection: 'user-solutions',
      id: solutionId,
      depth: 2, // Fetch comments and potentially authors/replies
    })

    if (!solution) {
      throw new Error('Solution not found')
    }

    // Ensure comments is an array of Comment objects, not numbers or mixed
    const comments = solution.comments
    if (!Array.isArray(comments)) {
      return []
    }
    // Filter out any potential number IDs, although ideally the relationship manages this
    return comments.filter((c): c is Comment => typeof c === 'object' && c !== null && 'id' in c)
  } catch (error) {
    console.error(`Error fetching comments for solution ${solutionId}:`, error)
    throw new Error('Failed to fetch solution comments')
  }
}

/**
 * Creates a new top-level comment for a user solution.
 * @param solutionId The ID of the user solution to comment on.
 * @param content The content of the comment.
 * @param authorId The ID of the author creating the comment.
 * @returns The newly created comment.
 */
export const createUserSolutionCommentAction = async (
  solutionId: number,
  content: string,
  authorId: string,
): Promise<Comment> => {
  const payload = await getPayload({ config })
  const validatedContent = validateCommentContent(content)
  const validatedAuthorId = validateAuthorId(authorId)

  try {
    // Create the comment
    const newComment = await payload.create({
      collection: 'comments',
      data: {
        content: validatedContent,
        authorId: validatedAuthorId,
        isReply: false, // Explicitly set as not a reply
      },
    })

    // Add the comment to the solution
    // Use a transaction in the future if possible
    const solution = await payload.findByID({
      collection: 'user-solutions',
      id: solutionId,
      depth: 0, // No need for depth when just updating relation
    })

    if (!solution) {
      // Attempt to delete orphaned comment?
      console.error(`Solution ${solutionId} not found for comment ${newComment.id}`)
      throw new Error('Solution not found')
    }

    await payload.update({
      collection: 'user-solutions',
      id: solutionId,
      data: {
        // Ensure comments array exists and handle potential type mismatch (number vs object)
        comments: [
          ...(solution.comments?.map((c) => (typeof c === 'number' ? c : c.id)) || []),
          newComment.id,
        ],
      },
    })

    return newComment
  } catch (error) {
    console.error(`Error creating comment for solution ${solutionId}:`, error)
    throw new Error('Failed to create solution comment')
  }
}
