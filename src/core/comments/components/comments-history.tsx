'use client'

import { User } from '@/payload-types'
import { CommentThread } from './comment-thread'
import { Comment } from '@/payload-types'

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
}

export const CommentsHistory = ({ comments, onDelete, onAddReply }: CommentsHistoryProps) => {
  return (
    <div>
      {comments.map((item, index) => (
        <div key={item.comment.id} className={index !== 0 ? 'border-t pt-4' : ''}>
          <CommentThread
            comment={item.comment}
            author={item.author}
            onDelete={onDelete}
            onAddReply={onAddReply}
          />
        </div>
      ))}
    </div>
  )
}
