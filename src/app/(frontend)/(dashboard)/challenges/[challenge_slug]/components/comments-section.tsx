'use client'

import { toast } from '@/components/ui/use-toast'
import { CommentType } from '@/core/types'
import { subscribeToComments } from '@/lib/real-time-utils'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CommentForm } from './comment-form'
import { UserComment } from './comments/user-comment'

type CommentsProps = {
  challengeId: string
  comments?: CommentType[]
  onCreateComment: (content: string, parentId?: string) => Promise<void>
  onUpvote: (commentId: string) => Promise<void>
  onDownvote: (commentId: string) => Promise<void>
  onReportComment: (commentId: string, reason: string, details: string) => Promise<void>
}

export function CommentsSection({
  comments: initialComments = [],
  onCreateComment,
  onUpvote,
  onDownvote,
  onReportComment,
}: CommentsProps) {
  const params = useParams<{ challenge_slug: string }>()
  const challengeSlug = params.challenge_slug
  const [comments, setComments] = useState<CommentType[]>(initialComments)

  // Handle for reporting comments

  // Subscribe to real-time comments
  useEffect(() => {
    // Subscribe to real-time updates for comments
    const unsubscribe = subscribeToComments(challengeSlug, (newComment) => {
      setComments((currentComments) => {
        // Check if it's a reply to an existing comment
        if (newComment.parentId) {
          return currentComments.map((comment) => {
            if (comment.id === newComment.parentId) {
              // Add reply to parent comment
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              }
            }
            return comment
          })
        }
        // If it's a new comment, add it to the list
        return [...currentComments, newComment]
      })
    })

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [challengeSlug, toast])

  const handleCommentSubmit = async (content: string) => {
    await onCreateComment(content)
  }

  const handleReportComment = async (commentId: string, reason: string, details: string) => {
    await onReportComment(commentId, reason, details)
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <CommentForm onSubmit={handleCommentSubmit} />
      </div>

      <div>
        {comments?.map((comment, index) => (
          <div key={comment.id} className={index !== 0 ? 'border-t pt-4' : ''}>
            <CommentThread
              comment={comment}
              onReportComment={handleReportComment}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
            />
            {index !== (comments?.length ?? 0) - 1 && <div className="h-4"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function CommentThread({
  comment,
  onReportComment,
  onUpvote,
  onDownvote,
}: {
  comment: CommentType
  onReportComment?: (commentId: string, reason: string, details: string) => void
  onUpvote: (commentId: string) => Promise<void>
  onDownvote: (commentId: string) => Promise<void>
}) {
  const [showReplies, setShowReplies] = useState(false)
  const replies = comment.replies || []

  // Convertir le commentaire au format attendu par UserComment
  const userComment = {
    id: comment.id,
    user: {
      name: comment.author.name,
      avatar: comment.author.avatar || '',
      initials: comment.author.initials,
    },
    content: comment.content,
    votes: comment.upvotes - comment.downvotes,
    createdAt: comment.date,
    replies: (comment.replies || []).map((reply) => ({
      id: reply.id,
      user: {
        name: reply.author.name,
        avatar: reply.author.avatar || '',
        initials: reply.author.initials,
      },
      content: reply.content,
      votes: reply.upvotes - reply.downvotes,
      createdAt: reply.date,
      replies: [], // Ajout d'un tableau vide pour les réponses
    })),
  }

  return (
    <div className="space-y-3">
      <UserComment
        comment={userComment}
        onUpvote={async () => await onUpvote(comment.id)}
        onDownvote={async () => await onDownvote(comment.id)}
        onReport={async (reason: string, details: string) => {
          if (onReportComment) {
            await onReportComment(comment.id, reason, details)
          }
        }}
        onReply={async (user, content) => {
          // TODO: Implémenter la logique de réponse
          console.log('Reply to comment', comment.id, ':', content)
        }}
        onToggleReplies={() => setShowReplies(!showReplies)}
        isReply={false}
        showReplies={showReplies}
      />

      {showReplies && replies.length > 0 && (
        <div className="my-3 py-3">
          <div className="pl-8 space-y-3 border-l-2 border-muted ml-6">
            {replies.map((reply, index) => {
              const userReply = {
                id: reply.id,
                user: {
                  name: reply.author.name,
                  avatar: reply.author.avatar || '',
                  initials: reply.author.initials,
                },
                content: reply.content,
                votes: reply.upvotes - reply.downvotes,
                createdAt: reply.date,
                replies: [], // Ajout d'un tableau vide pour les réponses
              }

              return (
                <div key={reply.id}>
                  <UserComment
                    comment={userReply}
                    onUpvote={async () => await onUpvote(reply.id)}
                    onDownvote={async () => await onDownvote(reply.id)}
                    onReport={async (reason: string, details: string) => {
                      if (onReportComment) {
                        await onReportComment(reply.id, reason, details)
                      }
                    }}
                    onReply={async (user, content) => {
                      // TODO: Implémenter la logique de réponse
                      console.log('Reply to comment', reply.id, ':', content)
                    }}
                    onToggleReplies={() => {}}
                    isReply={true}
                    showReplies={false}
                  />
                  {index !== replies.length - 1 && <div className="h-3 my-3"></div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
