'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CommentActionsProps {
  commentId: string
  initialUpvotes?: number
  initialDownvotes?: number
}

export function CommentActions({
  commentId,
  initialUpvotes = 0,
  initialDownvotes = 0,
}: CommentActionsProps) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)

  const handleUpvote = () => {
    if (vote === 'up') {
      // Cancel upvote
      setVote(null)
      setUpvotes((prev) => prev - 1)
    } else {
      // Add upvote, remove downvote if exists
      if (vote === 'down') {
        setDownvotes((prev) => prev - 1)
      }
      setVote('up')
      setUpvotes((prev) => prev + 1)
    }
  }

  const handleDownvote = () => {
    if (vote === 'down') {
      // Cancel downvote
      setVote(null)
      setDownvotes((prev) => prev - 1)
    } else {
      // Add downvote, remove upvote if exists
      if (vote === 'up') {
        setUpvotes((prev) => prev - 1)
      }
      setVote('down')
      setDownvotes((prev) => prev + 1)
    }
  }

  return (
    <div className="flex items-center">
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
    </div>
  )
}
