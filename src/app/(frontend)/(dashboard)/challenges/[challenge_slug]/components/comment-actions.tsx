'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Flag, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomTooltip } from './custom-tooltip'

interface CommentActionsProps {
  onReply: () => void
  onReport: () => void
  onUpvote: () => Promise<void>
  onDownvote: () => Promise<void>
  upvotes: number
  downvotes: number
}

export function CommentActions({
  onReply,
  onReport,
  onUpvote,
  onDownvote,
  upvotes,
  downvotes,
}: CommentActionsProps) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  const handleUpvote = async () => {
    if (vote === 'up') {
      // Cancel upvote
      setVote(null)
    } else {
      // Add upvote, remove downvote if exists
      if (vote === 'down') {
        setVote(null)
      }
      setVote('up')
      await onUpvote()
    }
  }

  const handleDownvote = async () => {
    if (vote === 'down') {
      // Cancel downvote
      setVote(null)
    } else {
      // Add downvote, remove upvote if exists
      if (vote === 'up') {
        setVote(null)
      }
      setVote('down')
      await onDownvote()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 ${vote === 'up' ? 'text-green-500' : 'text-muted-foreground'}`}
        onClick={handleUpvote}
      >
        <ArrowUp className="h-3 w-3" />
      </Button>

      <span className="text-xs mx-1.5 text-muted-foreground">{upvotes - downvotes}</span>

      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 ${vote === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}
        onClick={handleDownvote}
      >
        <ArrowDown className="h-3 w-3" />
      </Button>

      <CustomTooltip content="Reply to this comment">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground"
          onClick={onReply}
        >
          <Reply className="h-3 w-3" />
        </Button>
      </CustomTooltip>

      <CustomTooltip content="Report this comment">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground"
          onClick={onReport}
        >
          <Flag className="h-3 w-3" />
        </Button>
      </CustomTooltip>
    </div>
  )
}
