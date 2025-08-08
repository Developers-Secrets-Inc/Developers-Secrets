'use client'

import { User } from '@/core/users/types'
import { Comment as UserComment } from '@/core/comments/components/comment'
import { Comment } from '@/payload-types'
import { useState } from 'react'

interface CommentThreadProps {
  comment: Comment
  author: User
  onDelete: (commentId: number) => Promise<void>
  onAddReply: (params: {
    parentCommentId: number
    content: string
    authorId: string
  }) => Promise<void>
  onEdit: (commentId: number, content: string) => Promise<void>
}

export const CommentThread = ({
  comment,
  author,
  onDelete,
  onAddReply,
  onEdit,
}: CommentThreadProps) => {
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="space-y-3">
      <UserComment
        comment={comment}
        author={author}
        showReplies={showReplies}
        onToggleReplies={() => setShowReplies(!showReplies)}
        onDelete={onDelete}
        onAddReply={onAddReply}
        onEdit={onEdit}
      />

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="pl-8 space-y-3 border-l-2 border-muted ml-6">
          {comment.replies.map((reply) => {
            if (typeof reply === 'number') {
              return null // Skip number IDs
            }
            return (
              <UserComment
                key={reply.id}
                comment={reply}
                author={author}
                showReplies={showReplies}
                onToggleReplies={() => setShowReplies(!showReplies)}
                onDelete={onDelete}
                onAddReply={onAddReply}
                onEdit={onEdit}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// TODO: Handle delete, modifity, upvote, downvote, reply, report
