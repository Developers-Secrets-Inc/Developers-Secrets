"use client"

import { Button } from '@/components/ui/button'
import { User } from '@/types/user'
import { ArrowDown, ArrowUp, Flag, MessageSquare, Reply } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { CustomTooltip } from '../custom-tooltip'
import { Comment as PayloadComment } from '@/payload-types'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserById } from '@/core/user'
import { CommentVotes } from './vote-buttons'
import { CommentProvider } from './comment-provider'
import { useComment } from './use-comment'
import { Textarea } from '@/components/ui/textarea'
import { addReplyToComment } from '@/core/comments'

const AuthorName = ({ author }: { author: User }) => {
  return <span className="text-sm font-medium">{author.name}</span>
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

  return (
    <div className="flex justify-between items-center mb-2">
      <AuthorName author={author} />
      <div className="flex items-center gap-2">
        <ReportButton onReportClick={onReportClick} />
        <CommentDate date={new Date(comment.createdAt)} />
      </div>
    </div>
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

export const CommentActions = ({ onReplyClick, showReplies, onToggleReplies }: { onReplyClick: () => void, showReplies: boolean, onToggleReplies: () => void }) => {
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




export const Comment = ({ comment, author, showReplies, onToggleReplies }: { comment: PayloadComment; author: User, showReplies: boolean, onToggleReplies: () => void }) => {
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
              <CommentActions showReplies={showReplies} onReplyClick={() => setIsReplying(true)} onToggleReplies={onToggleReplies} />
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

    </CommentProvider>
  )
}
