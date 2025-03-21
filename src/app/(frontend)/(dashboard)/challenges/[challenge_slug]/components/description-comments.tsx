'use server'

import { Challenge as PayloadChallenge } from '@/payload-types'
import { CommentsSection } from './comments-section'
import { createComment, reportComment, voteComment, getCommentsByChallenge } from '@/core/comments'
import { getUser } from '@/core/user'
import { CommentType } from '@/core/types'

interface DescriptionCommentsProps {
  challenge: PayloadChallenge
}

export const DescriptionComments = async ({ challenge }: DescriptionCommentsProps) => {
  const user = await getUser()
  const { comments } = await getCommentsByChallenge(challenge.id.toString(), 'description')

  const handleCreateComment = async (content: string, parentId?: string) => {
    'use server'
    await createComment({
      content,
      authorId: user.id.toString(),
      challengeId: challenge.id.toString(),
      targetType: 'description',
      parentId,
    })
  }

  const handleUpvote = async (commentId: string) => {
    'use server'
    await voteComment(commentId, user.id.toString(), 'up')
  }

  const handleDownvote = async (commentId: string) => {
    'use server'
    await voteComment(commentId, user.id.toString(), 'down')
  }

  const handleReportComment = async (commentId: string, reason: string, details: string) => {
    'use server'
    await reportComment(commentId, user.id.toString(), {
      userId: user.id.toString(),
      reason,
      details,
    })
  }

  const mappedComments: CommentType[] = comments.map((comment) => ({
    id: comment.id.toString(),
    content: comment.content,
    author: comment.author,
    date: comment.createdAt,
    upvotes: comment.votes || 0,
    downvotes: 0, // We don't store downvotes separately in the database
    parentId: comment.parentId || undefined,
  }))

  return (
    <CommentsSection
      challengeId={challenge.id.toString()}
      comments={mappedComments}
      onCreateComment={handleCreateComment}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      onReportComment={handleReportComment}
    />
  )
}
