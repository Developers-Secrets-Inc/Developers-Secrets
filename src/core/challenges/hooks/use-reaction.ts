'use client'

import { useState, useEffect } from 'react'
import {
  toggleChallengeLike,
  toggleChallengeDislike,
} from '@/core/challenges/user-progression/actions'
import { hasUserLikedChallenge, hasUserDislikedChallenge } from '@/core/challenges/user-progression'

type ToggleAction = (
  state: boolean,
  challengeId: number,
) => Promise<{ success: boolean; error?: string }>

export const useReaction = (challengeId: number, userId: string) => {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInitialStates = async () => {
      try {
        const [isLiked, isDisliked] = await Promise.all([
          hasUserLikedChallenge(userId, challengeId),
          hasUserDislikedChallenge(userId, challengeId),
        ])
        setLiked(isLiked)
        setDisliked(isDisliked)
      } catch (error) {
        console.error('Error fetching reaction states:', error)
        // In case of error, we set both states to false and don't show error to user
        setLiked(false)
        setDisliked(false)
      }
    }
    fetchInitialStates()
  }, [challengeId, userId])

  const toggleReaction = async (
    reactionType: 'like' | 'dislike',
    newState: boolean,
    setState: (value: boolean) => void,
    toggleAction: ToggleAction,
  ) => {
    setState(newState)

    try {
      await toggleAction(newState, challengeId)
    } catch (error) {
      console.error(`Error with ${reactionType} action:`, error)
      setError(`Error with ${reactionType} action: ${error}`)
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

  return {
    state: {
      liked,
      disliked,
    },
    actions: {
      handleLikeClick,
      handleDislikeClick,
    },
    error,
  }
}
