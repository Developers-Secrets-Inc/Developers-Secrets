'use client'

import { useState } from 'react'
import { LikeButton } from './like-button'
import { DislikeButton } from './dislike-button'
import { toggleChallengeLike, toggleChallengeDislike } from '@/app/actions/challenge-actions'

interface ReactionButtonsProps {
  initialLiked: boolean
  initialDisliked: boolean
  challengeSlug: string
}

export function ReactionButtons({
  initialLiked,
  initialDisliked,
  challengeSlug,
}: ReactionButtonsProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [disliked, setDisliked] = useState(initialDisliked)

  const handleLikeClick = async () => {
    // Determine new states
    const newLiked = !liked
    const newDisliked = newLiked ? false : disliked // If liking, ensure dislike is off

    // Update UI immediately (optimistic update)
    setLiked(newLiked)
    setDisliked(newDisliked)

    try {
      // Call server action in background
      await toggleChallengeLike(newLiked, challengeSlug)
    } catch (error) {
      console.error('Error with like action:', error)
      // Revert UI state on error
      setLiked(!newLiked)
      setDisliked(disliked) // Restore original disliked state
    }
  }

  const handleDislikeClick = async () => {
    // Determine new states
    const newDisliked = !disliked
    const newLiked = newDisliked ? false : liked // If disliking, ensure like is off

    // Update UI immediately (optimistic update)
    setDisliked(newDisliked)
    setLiked(newLiked)

    try {
      // Call server action in background
      await toggleChallengeDislike(newDisliked, challengeSlug)
    } catch (error) {
      console.error('Error with dislike action:', error)
      // Revert UI state on error
      setDisliked(!newDisliked)
      setLiked(liked) // Restore original liked state
    }
  }

  return (
    <div className="flex items-center gap-2">
      <LikeButton liked={liked} onClick={handleLikeClick} />
      <DislikeButton disliked={disliked} onClick={handleDislikeClick} />
    </div>
  )
}
