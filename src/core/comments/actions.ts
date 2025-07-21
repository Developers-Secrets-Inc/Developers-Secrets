'use server'

import { Comment } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { validateCommentContent, validateAuthorId } from './types'

/**
 * Deletes a comment by its ID.
 * @param commentId The ID of the comment to delete.
 */
export const deleteCommentAction = async (commentId: number): Promise<void> => {
  const payload = await getPayload({ config })
  try {
    await payload.delete({
      collection: 'comments',
      id: commentId,
    })
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error)
    throw new Error('Failed to delete comment')
  }
}

/**
 * Modifies the content of an existing comment.
 * @param commentId The ID of the comment to modify.
 * @param newContent The new content for the comment.
 * @returns The updated comment.
 */
export const modifyCommentAction = async (
  commentId: number,
  newContent: string,
): Promise<Comment> => {
  const payload = await getPayload({ config })
  const validatedContent = validateCommentContent(newContent)
  try {
    const updatedComment = await payload.update({
      collection: 'comments',
      id: commentId,
      data: { content: validatedContent },
    })
    return updatedComment
  } catch (error) {
    console.error(`Error modifying comment ${commentId}:`, error)
    // Consider checking if the error is due to the comment not being found
    throw new Error('Failed to modify comment')
  }
}

/**
 * Creates a reply to a parent comment.
 * @param parentCommentId The ID of the parent comment.
 * @param content The content of the reply.
 * @param authorId The ID of the author creating the reply.
 * @returns The newly created reply comment.
 */
export const createReplyAction = async (
  parentCommentId: number,
  content: string,
  authorId: string,
): Promise<Comment> => {
  const payload = await getPayload({ config })
  const validatedContent = validateCommentContent(content)
  const validatedAuthorId = validateAuthorId(authorId)

  try {
    // Créer la réponse
    const reply = await payload.create({
      collection: 'comments',
      data: {
        content: validatedContent,
        authorId: validatedAuthorId,
        isReply: true,
      },
    })

    // Ajouter la réponse au commentaire parent
    // Use a transaction for atomicity if possible in future Payload versions
    const parentComment = await payload.findByID({
      collection: 'comments',
      id: parentCommentId,
      depth: 0, // No need to fetch replies of parent here
    })

    if (!parentComment) {
      // Attempt to delete the orphaned reply? Or just throw?
      console.error(`Parent comment ${parentCommentId} not found for reply ${reply.id}`)
      throw new Error('Parent comment not found')
    }

    await payload.update({
      collection: 'comments',
      id: parentCommentId,
      data: {
        // Ensure replies array exists and handle potential type mismatch (number vs object)
        replies: [
          ...(parentComment.replies?.map((r) => (typeof r === 'number' ? r : r.id)) || []),
          reply.id,
        ],
      },
    })

    return reply
  } catch (error) {
    console.error(`Error creating reply for comment ${parentCommentId}:`, error)
    throw new Error('Failed to create reply')
  }
}
