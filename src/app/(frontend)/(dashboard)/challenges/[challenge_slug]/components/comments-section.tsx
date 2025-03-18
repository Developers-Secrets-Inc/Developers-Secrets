'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { CommentActions } from './comment-actions'
import { CommentForm } from './comment-form'
import { MessageSquare, Reply, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { CustomTooltip } from './custom-tooltip'
import { ReportCommentDialog } from './report-comment-dialog'

// This would typically come from your database
const EXAMPLE_COMMENTS = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatar: 'https://github.com/shadcn.png',
      initials: 'JD',
    },
    content: 'This challenge is excellent! I learned a lot about bitwise operations.',
    date: new Date(2023, 4, 15, 10, 30),
    upvotes: 12,
    downvotes: 2,
    replies: [
      {
        id: '1-1',
        user: {
          name: 'Jane Smith',
          avatar: 'https://github.com/shadcn.png',
          initials: 'JS',
        },
        content: 'I agree! The examples were really clear.',
        date: new Date(2023, 4, 15, 11, 45),
        upvotes: 3,
        downvotes: 0,
      },
    ],
  },
  {
    id: '2',
    user: {
      name: 'Alice Johnson',
      avatar: 'https://github.com/shadcn.png',
      initials: 'AJ',
    },
    content:
      'I found this challenge quite difficult. Had to review bit manipulation basics before solving it.',
    date: new Date(2023, 4, 14, 16, 20),
    upvotes: 8,
    downvotes: 1,
    replies: [],
  },
]

export function CommentsSection() {
  const handleCommentSubmit = (content: string) => {
    console.log('New comment:', content)
    // In a real app, this would send the comment to the server
  }

  const handleReportComment = (commentId: string, reason: string, details: string) => {
    console.log('Report comment:', commentId, reason, details)
    // In a real app, this would send the report to the server
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <CommentForm onSubmit={handleCommentSubmit} />
      </div>

      <div>
        {EXAMPLE_COMMENTS.map((comment, index) => (
          <div key={comment.id} className={index !== 0 ? 'border-t pt-4' : ''}>
            <CommentThread comment={comment} onReportComment={handleReportComment} />
            {index !== EXAMPLE_COMMENTS.length - 1 && <div className="h-4"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function CommentThread({
  comment,
  onReportComment,
}: {
  comment: any
  onReportComment?: (commentId: string, reason: string, details: string) => void
}) {
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="space-y-3">
      <Comment
        comment={comment}
        onToggleReplies={() => setShowReplies(!showReplies)}
        showReplies={showReplies}
        onReportComment={onReportComment}
      />

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="my-3 py-3">
          <div className="pl-8 space-y-3 border-l-2 border-muted ml-6">
            {comment.replies.map((reply: any, index: number) => (
              <div key={reply.id}>
                <Comment comment={reply} isReply onReportComment={onReportComment} />
                {index !== comment.replies.length - 1 && <div className="h-3 my-3"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface CommentProps {
  comment: any
  isReply?: boolean
  onToggleReplies?: () => void
  showReplies?: boolean
  onReportComment?: (commentId: string, reason: string, details: string) => void
}

function Comment({
  comment,
  isReply = false,
  onToggleReplies,
  showReplies = false,
  onReportComment,
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  const handleShowReplies = () => {
    if (onToggleReplies) {
      onToggleReplies()
    }
  }

  const handleReplyClick = () => {
    setIsReplying(true)
  }

  const handleCancelReply = () => {
    setIsReplying(false)
    setReplyContent('')
  }

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      console.log('Reply to comment', comment.id, ':', replyContent)
      // In a real app, this would send the reply to the server
      setReplyContent('')
      setIsReplying(false)
    }
  }

  const handleReportClick = () => {
    setReportDialogOpen(true)
  }

  return (
    <>
      <div
        className="space-y-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-4">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
            <AvatarFallback>{comment.user.initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{comment.user.name}</span>
                <div className="flex items-center gap-2">
                  <CustomTooltip content="Report this comment">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 text-muted-foreground transition-opacity duration-150 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      onClick={handleReportClick}
                      tabIndex={isHovered ? 0 : -1}
                      aria-hidden={!isHovered}
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </Button>
                  </CustomTooltip>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.date, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="text-sm mb-2">{comment.content}</p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <CommentActions
                  commentId={comment.id}
                  initialUpvotes={comment.upvotes}
                  initialDownvotes={comment.downvotes}
                />

                {!isReply && comment.replies && comment.replies.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    onClick={handleShowReplies}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {showReplies ? 'Hide' : 'Show'} {comment.replies.length}{' '}
                    {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </Button>
                )}

                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    onClick={handleReplyClick}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isReplying && (
          <div className="ml-12 mt-2">
            <Textarea
              placeholder="Write a reply..."
              className="resize-none text-sm min-h-[60px]"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={handleCancelReply}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>

      {onReportComment && (
        <ReportCommentDialog
          commentId={comment.id}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          onReport={onReportComment}
        />
      )}
    </>
  )
}
