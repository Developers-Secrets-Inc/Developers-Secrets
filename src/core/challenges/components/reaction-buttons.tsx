'use client'

import { useChallengeReaction } from '@/core/challenges/hooks/use-reaction'
import { DislikeButton } from './dislike-button'
import { LikeButton } from './like-button'
import { useChallengeStore } from '@/core/challenges/store'

/**
 * Displays reaction buttons (like/dislike) for a challenge.
 */
export const ChallengeReactionButtons = () => {
  const { state, actions, error } = useChallengeReaction()

  // Force re-evaluation of types
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <LikeButton
          liked={state.liked}
          onClick={actions.handleLikeClick}
          disabled={state.isLoading}
        />
        <DislikeButton
          disliked={state.disliked}
          onClick={actions.handleDislikeClick}
          disabled={state.isLoading}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
