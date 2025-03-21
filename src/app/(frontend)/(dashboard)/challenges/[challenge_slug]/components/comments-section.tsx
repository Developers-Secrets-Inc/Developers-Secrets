'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { CommentActions } from './comment-actions'
import { CommentForm } from './comment-form'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { subscribeToComments } from '@/lib/real-time-utils'
import { useToast } from '@/components/ui/use-toast'
import { CommentType } from '@/core/types'
import { ReportCommentDialog } from './report-comment-dialog'

type CommentsProps = {
  challengeId?: string
  solutionId?: string
  comments: CommentType[]
  onCreateComment: (content: string, parentId?: string) => Promise<void>
  onUpvote: (commentId: string) => Promise<void>
  onDownvote: (commentId: string) => Promise<void>
  onReportComment: (commentId: string, reason: string, details: string) => Promise<void>
}

export function CommentsSection({
  challengeId,
  solutionId,
  comments: initialComments,
  onCreateComment,
  onUpvote,
  onDownvote,
  onReportComment,
}: CommentsProps) {
  const params = useParams<{ challenge_slug: string }>()
  const { toast } = useToast()
  const [comments, setComments] = useState<CommentType[]>(initialComments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [reportCommentId, setReportCommentId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const commentFormRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (challengeId) {
      const unsubscribe = subscribeToComments(challengeId, (newComment) => {
        setComments((prevComments) => [...prevComments, newComment])
      })
      return () => unsubscribe()
    }
  }, [challengeId])

  const handleCommentSubmit = async (content: string, parentId?: string) => {
    try {
      setIsSubmitting(true)
      await onCreateComment(content, parentId)
      setNewComment('')
      setShowCommentForm(false)
      setReplyTo(null)
      toast({
        title: 'Comment posted',
        description: 'Your comment has been posted successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReportComment = async (commentId: string, reason: string, details: string) => {
    try {
      await onReportComment(commentId, reason, details)
      setShowReportDialog(false)
      setReportReason('')
      setReportDetails('')
      toast({
        title: 'Comment reported',
        description: 'Thank you for reporting this comment.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to report comment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleUpvote = async (commentId: string) => {
    try {
      await onUpvote(commentId)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, upvotes: comment.upvotes + 1 } : comment,
        ),
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upvote comment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDownvote = async (commentId: string) => {
    try {
      await onDownvote(commentId)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, downvotes: comment.downvotes + 1 } : comment,
        ),
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to downvote comment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleReply = (commentId: string) => {
    setReplyTo(commentId)
    setShowCommentForm(true)
    setTimeout(() => {
      commentFormRef.current?.focus()
    }, 0)
  }

  const handleReport = (commentId: string) => {
    setReportCommentId(commentId)
    setShowReportDialog(true)
  }

  const renderComment = (comment: CommentType) => {
    const replies = comments.filter((c) => c.parentId === comment.id)
    const hasReplies = replies.length > 0

    return (
      <div key={comment.id} className="space-y-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>{comment.author.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{comment.author.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                </p>
              </div>
              <CommentActions
                onReply={() => handleReply(comment.id)}
                onReport={() => handleReport(comment.id)}
                onUpvote={() => handleUpvote(comment.id)}
                onDownvote={() => handleDownvote(comment.id)}
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
              />
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        </div>
        {hasReplies && (
          <div className="ml-12 space-y-4">{replies.map((reply) => renderComment(reply))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comments</h2>
        <Button
          variant="outline"
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="flex items-center space-x-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Add Comment</span>
        </Button>
      </div>

      {showCommentForm && (
        <CommentForm
          ref={commentFormRef}
          onSubmit={handleCommentSubmit}
          parentId={replyTo}
          isSubmitting={isSubmitting}
          onCancel={() => {
            setShowCommentForm(false)
            setReplyTo(null)
          }}
        />
      )}

      <div className="space-y-6">{comments.filter((c) => !c.parentId).map(renderComment)}</div>

      <ReportCommentDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        onSubmit={() => {
          if (reportCommentId) {
            handleReportComment(reportCommentId, reportReason, reportDetails)
          }
        }}
        reason={reportReason}
        onReasonChange={setReportReason}
        details={reportDetails}
        onDetailsChange={setReportDetails}
      />
    </div>
  )
}
