'use client'

import { CommentActions } from './comment-actions'
import { CommentContent } from './comment-content'
import { Comment as PayloadComment } from '@/payload-types'
import { User } from '@/types/user'
import { useState } from 'react'
import { CommentProvider } from './comment-provider'
import { CommentHeader } from './comment-header'
import { CommentResponseTextArea } from './comment-response-text'
import { ReportCommentDialog } from './report-comment-dialog'
import { CommentAvatar } from './comment-avatar'

interface CommentProps {
  comment: PayloadComment
  author: User
  showReplies: boolean
  onToggleReplies: () => void
  onDelete: (commentId: number) => Promise<void>
  onAddReply: (params: {
    parentCommentId: number
    content: string
    authorId: string
  }) => Promise<void>
}

export const Comment = ({
  comment,
  author,
  showReplies,
  onToggleReplies,
  onDelete,
  onAddReply,
}: CommentProps) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return

    setIsReplying(false)
    setReplyContent('')

    await onAddReply({
      parentCommentId: comment.id,
      content: replyContent,
      authorId: author.id,
    })

    if (!showReplies) {
      onToggleReplies()
    }
  }

  const handleDelete = async () => {
    await onDelete(comment.id)
  }

  return (
    <CommentProvider comment={comment} author={author}>
      <div className="group space-y-3">
        <div className="flex gap-4">
          <CommentAvatar author={author} />
          <div className="flex-1">
            <div className="rounded-lg">
              <CommentHeader
                onReportClick={() => setReportDialogOpen(true)}
                onDelete={handleDelete}
                canDelete={comment.authorId === author.id}
              />
              <CommentContent />
              <CommentActions
                showReplies={showReplies}
                onReplyClick={() => setIsReplying(true)}
                onToggleReplies={onToggleReplies}
              />
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <CommentResponseTextArea
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          onCancelReply={() => {
            setIsReplying(false)
            setReplyContent('')
          }}
          onSubmitReply={handleReplySubmit}
        />
      )}

      <ReportCommentDialog
        commentId={comment.id}
        userId={author.id}
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />
    </CommentProvider>
  )
}
