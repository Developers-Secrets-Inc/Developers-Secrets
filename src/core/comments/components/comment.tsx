"use client"

import { CommentActions } from "./comment-actions"
import { CommentContent } from "./comment-content"
import { Comment as PayloadComment } from "@/payload-types"
import { User } from "@/types/user"

import { useState } from "react"

import { CommentProvider } from "./comment-provider"
import { CommentHeader } from "./comment-header"
import { CommentResponseTextArea } from "./comment-response-text"
import { ReportCommentDialog } from "./report-comment-dialog"
import { addReplyToComment } from ".."
import { CommentAvatar } from "./comment-avatar"

export const Comment = ({
    comment,
    author,
    showReplies,
    onToggleReplies,
  }: {
    comment: PayloadComment
    author: User
    showReplies: boolean
    onToggleReplies: () => void
  }) => {
    const [reportDialogOpen, setReportDialogOpen] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState('')
  
    return (
      <CommentProvider comment={comment} author={author}>
        <div className="group space-y-3">
          <div className="flex gap-4">
            <CommentAvatar author={author} />
            <div className="flex-1">
              <div className="rounded-lg">
                <CommentHeader onReportClick={() => setReportDialogOpen(true)} />
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
            onSubmitReply={() => {
              addReplyToComment(comment.id, replyContent, author.id)
              setIsReplying(false)
              setReplyContent('')
            }}
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
  