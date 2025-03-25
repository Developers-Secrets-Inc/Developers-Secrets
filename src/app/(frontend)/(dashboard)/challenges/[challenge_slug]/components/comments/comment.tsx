'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { addReplyToComment, reportComment } from '@/core/comments'
import { Comment as PayloadComment } from '@/payload-types'
import { User } from '@/types/user'
import { formatDistanceToNow } from 'date-fns'
import { Flag, MessageSquare, Reply, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { CustomTooltip } from '../custom-tooltip'
import { CommentProvider } from './comment-provider'
import { useComment } from './use-comment'
import { CommentVotes } from './vote-buttons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const AuthorName = ({ author }: { author: User }) => {
  return <span className="text-sm font-medium">{author.informations.name}</span>
}

const CommentDate = ({ date }: { date: Date }) => {
  return (
    <span className="text-xs text-muted-foreground">
      {formatDistanceToNow(date, { addSuffix: true })}
    </span>
  )
}

export const ReportButton = ({ onReportClick }: { onReportClick: () => void }) => {
  return (
    <CustomTooltip content="Report this comment">
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 text-muted-foreground transition-opacity duration-150 opacity-0 group-hover:opacity-100`}
        onClick={onReportClick}
        tabIndex={0}
        aria-hidden={true}
      >
        <Flag className="h-3.5 w-3.5" />
      </Button>
    </CustomTooltip>
  )
}

const CommentAvatar = ({ author }: { author: User }) => {
  return (
    <Avatar>
      <AvatarImage src={author.informations.avatar} alt={author.informations.name} />
      <AvatarFallback>{author.informations.initials}</AvatarFallback>
    </Avatar>
  )
}

export const CommentHeader = ({ onReportClick }: { onReportClick: () => void }) => {
  const { comment, author } = useComment()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <AuthorName author={author} />
        <div className="flex items-center gap-2">
          <ReportButton onReportClick={onReportClick} />
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 text-muted-foreground transition-opacity duration-150 ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px]">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CommentDate date={new Date(comment.createdAt)} />
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // TODO: Implement delete functionality
                setDeleteDialogOpen(false)
              }}
            >
              <span className="text-white">Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const CommentContent = () => {
  const { comment } = useComment()

  return <p className="text-sm mb-2">{comment.content}</p>
}

export const ReplyButton = ({ onReplyClick }: { onReplyClick: () => void }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs text-muted-foreground"
      onClick={onReplyClick}
    >
      <Reply className="h-3 w-3 mr-1" />
      Reply
    </Button>
  )
}

const ShowRepliesButton = ({
  showReplies,
  repliesCount,
  onToggleReplies,
}: {
  showReplies: boolean
  repliesCount: number
  onToggleReplies: () => void
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs text-muted-foreground"
      onClick={onToggleReplies}
    >
      <MessageSquare className="h-3 w-3 mr-1" />
      {showReplies ? 'Hide' : 'Show'} {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
    </Button>
  )
}

export const CommentActions = ({
  onReplyClick,
  showReplies,
  onToggleReplies,
}: {
  onReplyClick: () => void
  showReplies: boolean
  onToggleReplies: () => void
}) => {
  const { comment, author } = useComment()

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <CommentVotes comment={comment} userId={author.id} />

      {!comment.isReply && comment.replies && comment.replies.length > 0 && (
        <ShowRepliesButton
          showReplies={showReplies}
          repliesCount={comment.replies.length}
          onToggleReplies={onToggleReplies}
        />
      )}
      {!comment.isReply && <ReplyButton onReplyClick={onReplyClick} />}
    </div>
  )
}

const CommentResponseTextArea = ({
  onCancelReply,
  onSubmitReply,
  replyContent,
  setReplyContent,
}: {
  onCancelReply: () => void
  onSubmitReply: () => void
  replyContent: string
  setReplyContent: (content: string) => void
}) => {
  return (
    <div className="ml-12 mt-2">
      <Textarea
        placeholder="Write a reply..."
        className="resize-none text-sm min-h-[60px]"
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="ghost" size="sm" onClick={onCancelReply}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSubmitReply}>
          Reply
        </Button>
      </div>
    </div>
  )
}

interface ReportCommentDialogProps {
  commentId: number
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'misinformation', label: 'Misinformation' },
  { value: 'other', label: 'Other' },
]

export function ReportCommentDialog({
  commentId,
  userId,
  open,
  onOpenChange,
}: ReportCommentDialogProps) {
  const [reason, setReason] = useState<string>('')
  const [details, setDetails] = useState<string>('')

  const handleSubmit = async () => {
    if (reason) {
      // Close dialog immediately
      handleReset()
      onOpenChange(false)

      // Handle report in the background
      await reportComment(commentId, {
        userId,
        reason,
        details,
      }).catch((error) => {
        console.error('Failed to submit report:', error)
      })
    }
  }

  const handleReset = () => {
    setReason('')
    setDetails('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report comment</DialogTitle>
          <DialogDescription>
            Please let us know why you&apos;re reporting this comment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide more information about your report..."
              className="min-h-[100px]"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
