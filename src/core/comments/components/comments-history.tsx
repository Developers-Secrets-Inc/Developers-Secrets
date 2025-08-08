'use client'

import { Comment } from '@/payload-types'
import { User } from '@/core/users/types'
import { CommentThread } from './comment-thread'

interface CommentsHistoryProps {
  comments: Array<{
    comment: Comment
    author: User | null
  }>
  onDelete: (commentId: number) => Promise<void>
  onAddReply: (params: {
    parentCommentId: number
    content: string
    authorId: string
  }) => Promise<void>
  onEdit: (commentId: number, content: string) => Promise<void>
}

export const CommentsHistory = ({
  comments,
  onDelete,
  onAddReply,
  onEdit,
}: CommentsHistoryProps) => {
  return (
    <div>
      {comments.map((item, index) => (
        <div key={item.comment.id} className={index !== 0 ? 'border-t pt-4' : ''}>
          {item.author && (
            <CommentThread
              comment={item.comment}
              author={item.author}
              onDelete={onDelete}
              onAddReply={onAddReply}
              onEdit={onEdit}
            />
          )}
        </div>
      ))}
    </div>
  )
}
