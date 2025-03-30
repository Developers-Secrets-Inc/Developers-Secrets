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

  const toggleReaction = async (
    reactionType: 'like' | 'dislike',
    newState: boolean,
    setState: (value: boolean) => void,
    toggleAction: (state: boolean, slug: string) => Promise<{ success: boolean; error?: string }>,
  ) => {
    // Mise à jour optimiste de l'état
    setState(newState)

    try {
      // Appel de l'action serveur
      await toggleAction(newState, challengeSlug)
    } catch (error) {
      console.error(`Error with ${reactionType} action:`, error)
      // Revenir à l'état précédent en cas d'erreur
      setState(!newState)
    }
  }

  const handleLikeClick = async () => {
    const newLiked = !liked
    const newDisliked = newLiked ? false : disliked

    setDisliked(newDisliked)
    await toggleReaction('like', newLiked, setLiked, toggleChallengeLike)
  }

  const handleDislikeClick = async () => {
    const newDisliked = !disliked
    const newLiked = newDisliked ? false : liked

    setLiked(newLiked)
    await toggleReaction('dislike', newDisliked, setDisliked, toggleChallengeDislike)
  }

  return (
    <div className="flex items-center gap-2">
      <LikeButton liked={liked} onClick={handleLikeClick} />
      <DislikeButton disliked={disliked} onClick={handleDislikeClick} />
    </div>
  )
}
