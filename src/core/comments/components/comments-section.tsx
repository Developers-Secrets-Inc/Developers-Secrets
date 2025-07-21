'use client'

import { CommentContext } from '../types'
import { NewCommentForm } from './new-comment-form'
import { CommentsHistory } from './comments-history'
import { useComments } from '../hooks/use-comments'
import { cn } from '@/lib/utils'

interface CommentsSectionProps {
  context: CommentContext
  userId?: string
  className?: string
}

export const CommentsSection = ({ context, userId, className }: CommentsSectionProps) => {
  const { comments, totalComments, isLoading, addComment, deleteComment, addReply, editComment } =
    useComments(context, userId)


  const handleSubmit = async (content: string) => {
    if (!userId) return
    await addComment.mutateAsync({ content, authorId: userId })
  }

  const handleDelete = async (commentId: number) => {
    await deleteComment.mutateAsync(commentId)
  }

  const handleAddReply = async (params: {
    parentCommentId: number
    content: string
    authorId: string
  }) => {
    await addReply.mutateAsync(params)
  }

  const handleEdit = async (commentId: number, content: string) => {
    await editComment.mutateAsync({ commentId, content })
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <NewCommentForm onSubmit={handleSubmit} />

      {isLoading ? (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <CommentsHistory
          comments={comments}
          onDelete={handleDelete}
          onAddReply={handleAddReply}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}
