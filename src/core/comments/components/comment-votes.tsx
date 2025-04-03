'use client'

import { Comment as PayloadComment } from '@/payload-types'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addUpvote, addDownvote } from '@/core/comments'

export const getVotesCount = (comment: PayloadComment): number => {
  if (!comment.votes) {
    return 0
  }

  let count = 0
  for (const vote of comment.votes) {
    if (vote.vote === 'upvote') {
      count++
    } else if (vote.vote === 'downvote') {
      count--
    }
  }
  return count
}

export const hasUpvoted = (comment: PayloadComment, userId: string): boolean => {
  return comment.votes?.some((vote) => vote.userId === userId && vote.vote === 'upvote') || false
}

export const hasDownvoted = (comment: PayloadComment, userId: string): boolean => {
  return comment.votes?.some((vote) => vote.userId === userId && vote.vote === 'downvote') || false
}

const VoteCount = ({ count }: { count: number }) => {
  return <span className="text-xs mx-1.5 text-muted-foreground">{count}</span>
}

const UpvoteButton = ({
  isUpvoted,
  onUpvoteClick,
}: {
  isUpvoted: boolean
  onUpvoteClick: () => void
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-6 w-6 p-0 ${isUpvoted ? 'text-green-500' : 'text-muted-foreground'}`}
      onClick={onUpvoteClick}
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
  onDownvoteClick: () => void
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

// TODO: On doit modifier le système pour retenir quel utilisateur a upvoté ou downvoté. Ca sera ensuite utilisé pour afficher s'il a été downvoté ou upvoté au rechargement de la page.
export const CommentVotes = ({ comment, userId }: { comment: PayloadComment; userId: string }) => {
  const [votes, setVotes] = useState(getVotesCount(comment))
  const [isUpvoted, setIsUpvoted] = useState(hasUpvoted(comment, userId))
  const [isDownvoted, setIsDownvoted] = useState(hasDownvoted(comment, userId))

  const handleUpvoteClick = async () => {
    let newVotes = votes
    let newUpvoted = isUpvoted
    let newDownvoted = isDownvoted

    if (isDownvoted) {
      // Si déjà downvoté, annule le downvote et ajoute upvote
      newVotes += 2
      newDownvoted = false
      newUpvoted = true
    } else if (isUpvoted) {
      // Si déjà upvoté, annule l'upvote
      newVotes -= 1
      newUpvoted = false
    } else {
      // Ajoute un nouvel upvote
      newVotes += 1
      newUpvoted = true
    }

    setVotes(newVotes)
    setIsUpvoted(newUpvoted)
    setIsDownvoted(newDownvoted)
    await addUpvote(comment.id, userId)
  }

  const handleDownvoteClick = async () => {
    let newVotes = votes
    let newUpvoted = isUpvoted
    let newDownvoted = isDownvoted

    if (isUpvoted) {
      // Si déjà upvoté, annule l'upvote et ajoute downvote
      newVotes -= 2
      newUpvoted = false
      newDownvoted = true
    } else if (isDownvoted) {
      // Si déjà downvoté, annule le downvote
      newVotes += 1
      newDownvoted = false
    } else {
      // Ajoute un nouveau downvote
      newVotes -= 1
      newDownvoted = true
    }

    setVotes(newVotes)
    setIsUpvoted(newUpvoted)
    setIsDownvoted(newDownvoted)
    await addDownvote(comment.id, userId)
  }

  return (
    <div className="flex items-center">
      <UpvoteButton isUpvoted={isUpvoted} onUpvoteClick={handleUpvoteClick} />
      <VoteCount count={votes} />
      <DownvoteButton isDownvoted={isDownvoted} onDownvoteClick={handleDownvoteClick} />
    </div>
  )
}
