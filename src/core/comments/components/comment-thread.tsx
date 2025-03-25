"use client"

import { User } from "@/types/user"
import { Comment as UserComment } from "@/core/comments/components/comment"
import { Comment } from "@/payload-types"
import { useState } from "react"

export const CommentThread = ({ comment, author }: { comment: Comment, author: User }) => {
  const [ showReplies, setShowReplies ] = useState(false)
  
  return (
      <div className="space-y-3">
        <UserComment comment={comment} author={author} showReplies={showReplies} onToggleReplies={() => setShowReplies(!showReplies)} />

        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="pl-8 space-y-3 border-l-2 border-muted ml-6">
            {comment.replies.map((reply) => {
              const userReply = reply as Comment
              return (
                <UserComment key={userReply.id} comment={userReply} author={author} showReplies={showReplies} onToggleReplies={() => setShowReplies(!showReplies)} />
              )
            })}
          </div>
        )}
      </div>
    )
  }
  
  // TODO: Handle delete, modifity, upvote, downvote, reply, report
  