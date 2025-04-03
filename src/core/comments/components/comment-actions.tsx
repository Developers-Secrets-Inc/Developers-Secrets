import { MessageSquare, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useComment } from '../hooks/use-comment'
import { CommentVotes } from './comment-votes'

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
