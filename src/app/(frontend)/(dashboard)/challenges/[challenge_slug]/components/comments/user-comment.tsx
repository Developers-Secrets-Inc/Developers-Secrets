'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowDown, ArrowUp, Flag, MessageSquare, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomTooltip } from '../custom-tooltip'
import { formatDistanceToNow } from 'date-fns'
import { createContext, useContext, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ReportCommentDialog } from '../report-comment-dialog'
import { upvoteComment } from '@/core/comments'
import { User } from '@/types/user'
import { Comment } from '@/payload-types'




interface CommentProps {
  comment: Comment
  author: User
  onUpvote: () => Promise<void>
  onDownvote: () => Promise<void>
  onReport: (reason: string, details: string) => Promise<void>
  onReply: (user: User, content: string) => Promise<void>
  onToggleReplies: () => void
  isReply: boolean
  showReplies: boolean
}

const CommentAvatar = () => {
  const { author } = useComment()

  return (
    <Avatar>
      <AvatarImage src={author.avatar} alt={author.name} />
      <AvatarFallback>{author.initials}</AvatarFallback>
    </Avatar>
  )
}

const ReportButton = ({
  isHovered,
  onReportClick,
}: {
  isHovered: boolean
  onReportClick: () => void
}) => {
  return (
    <CustomTooltip content="Report this comment">
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 text-muted-foreground transition-opacity duration-150 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onReportClick}
        tabIndex={isHovered ? 0 : -1}
        aria-hidden={!isHovered}
      >
        <Flag className="h-3.5 w-3.5" />
      </Button>
    </CustomTooltip>
  )
}

const AuthorName = ({ name }: { name: string }) => {
  return <span className="font-medium text-sm">{name}</span>
}

export const CommentDate = ({ date }: { date: Date }) => {
  return (
    <span className="text-xs text-muted-foreground">
      {formatDistanceToNow(date, { addSuffix: true })}
    </span>
  )
}

export const CommentHeader = ({ onReportClick }: { onReportClick: () => void }) => {
  const { comment, isHovered } = useComment()

  return (
    <div className="flex justify-between items-center mb-2">
      <AuthorName name={comment.user.name} />
      <div className="flex items-center gap-2">
        <ReportButton isHovered={isHovered} onReportClick={onReportClick} />
        <CommentDate date={comment.createdAt} />
      </div>
    </div>
  )
}

export const CommentContent = ({ content }: { content: string }) => {
  return <p className="text-sm mb-2">{content}</p>
}

export const ReplyButton = ({
  isReply,
  onReplyClick,
}: {
  isReply: boolean
  onReplyClick: () => void
}) => {
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

const UpvoteButton = ({
  isUpvoted,
}: {
  isUpvoted: boolean
}) => {
  const { comment } = useComment()
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-6 w-6 p-0 ${isUpvoted ? 'text-green-500' : 'text-muted-foreground'}`}
      onClick={() => upvoteComment(comment.id)}
    >
      <ArrowUp className="h-3 w-3" />
    </Button>
  )
}

const DownvoteButton = ({
  isDownvoted,
  onDownvoteClick,
}: {
  isDownvoted: boolean
  onDownvoteClick: () => Promise<void>
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-6 w-6 p-0 ${isDownvoted ? 'text-red-500' : 'text-muted-foreground'}`}
      onClick={onDownvoteClick}
    >
      <ArrowDown className="h-3 w-3" />
    </Button>
  )
}

const VoteCount = ({ count }: { count: number }) => {
  return <span className="text-xs mx-1.5 text-muted-foreground">{count}</span>
}

const CommentVotes = ({
  initialVotes,
  onUpvote,
  onDownvote,
}: {
  initialVotes: number
  onUpvote: () => Promise<void>
  onDownvote: () => Promise<void>
}) => {
  const [votes, setVotes] = useState(initialVotes)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)

  return (
    <div className="flex items-center">
      <UpvoteButton isUpvoted={isUpvoted} onUpvoteClick={onUpvote} />
      <VoteCount count={votes} />
      <DownvoteButton isDownvoted={isDownvoted} onDownvoteClick={onDownvote} />
    </div>
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
  isReply,
  showReplies,
  onUpvote,
  onDownvote,
  onToggleReplies,
  onReplyClick,
}: {
  isReply: boolean
  showReplies: boolean
  onUpvote: () => Promise<void>
  onDownvote: () => Promise<void>
  onToggleReplies: () => void
  onReplyClick: () => void
}) => {
  const { comment } = useComment()

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <CommentVotes initialVotes={comment.votes} onUpvote={onUpvote} onDownvote={onDownvote} />

      {!isReply && comment.replies && comment.replies.length > 0 && (
        <ShowRepliesButton
          showReplies={showReplies}
          repliesCount={comment.replies.length}
          onToggleReplies={onToggleReplies}
        />
      )}

      {isReply && <ReplyButton isReply={isReply} onReplyClick={onReplyClick} />}
    </div>
  )
}

const CommentResponseTextArea = ({
    replyContent,
    setReplyContent,
    handleCancelReply,
    handleSubmitReply,
}: {
    replyContent: string
    setReplyContent: (value: string) => void
    handleCancelReply: () => void
    handleSubmitReply: () => void
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
          <Button variant="ghost" size="sm" onClick={handleCancelReply}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmitReply} disabled={!replyContent.trim()}>
            Reply
          </Button>
        </div>
      </div>
    )
}


type CommentContextType = {
  comment: Comment
  author: User
  isHovered: boolean
}

const CommentContext = createContext<CommentContextType | undefined>(undefined)

const CommentProvider = ({
  comment,
  author,
  children,
  isHovered,
}: {  
  comment: Comment
  author: User
  children: React.ReactNode
  isHovered: boolean
}) => {
  return (
    <CommentContext.Provider value={{ comment, author, isHovered }}>{children}</CommentContext.Provider>
  )
}

const useComment = () => {
  const comment = useContext(CommentContext)
  if (!comment) {
    throw new Error('Comment not found')
  }
  return comment
}

export const UserComment = ({
  comment,
  author,
  onUpvote,
  onDownvote,
  onReport,
  onReply,
  onToggleReplies,
  isReply = false,
  showReplies = false,
}: CommentProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  return (
    <CommentProvider comment={comment} author={author} isHovered={isHovered}>
      <div
        className="space-y-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-4">
          <CommentAvatar />
          <div className="flex-1">
            <div className="rounded-lg">
              <CommentHeader onReportClick={() => setReportDialogOpen(true)} />
              <CommentContent content={comment.content} />
              <CommentActions
                isReply={isReply}
                showReplies={showReplies}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
                onToggleReplies={onToggleReplies}
                onReplyClick={() => setIsReplying(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <CommentResponseTextArea
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          handleCancelReply={() => {
            setIsReplying(false)
            setReplyContent('')
          }}
          handleSubmitReply={() => {
            onReply(comment.user, replyContent)
            setReplyContent('')
            setIsReplying(false)
          }}
        />
      )}

      {onReport && (
        <ReportCommentDialog
          commentId={comment.id}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          onReport={onReport}
        />
      )}
    </CommentProvider>
  )
}



