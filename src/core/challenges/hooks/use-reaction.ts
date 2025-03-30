'use client'

import { useState, useEffect } from 'react'
import { toggleChallengeLike, toggleChallengeDislike } from '@/app/actions/challenge-actions'
import { getUserChallengeProgression } from '@/core/user-progression'

type ToggleAction = (state: boolean, slug: string) => Promise<{ success: boolean; error?: string }>

export const useReaction = (challengeSlug: string, userId: string) => {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer les états initiaux côté client
  useEffect(() => {
    const fetchInitialStates = async () => {
      const userProgress = await getUserChallengeProgression(userId, challengeSlug)
      setLiked(userProgress?.hasLiked || false)
      setDisliked(userProgress?.hasDisliked || false)
    }
    fetchInitialStates()
  }, [challengeSlug, userId])

  const toggleReaction = async (
    reactionType: 'like' | 'dislike',
    newState: boolean,
    setState: (value: boolean) => void,
    toggleAction: ToggleAction,
  ) => {
    // Mise à jour optimiste de l'état
    setState(newState)

    try {
      // Appel de l'action serveur
      await toggleAction(newState, challengeSlug)
    } catch (error) {
      console.error(`Error with ${reactionType} action:`, error)
      setError(`Error with ${reactionType} action: ${error}`)
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
