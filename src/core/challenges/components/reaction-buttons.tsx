'use client'

import { useReaction } from '@/core/challenges/hooks/use-reaction'
import { DislikeButton } from './dislike-button'
import { LikeButton } from './like-button'

/**
 * Affiche les boutons de réaction (like/dislike) pour un défi.
 *
 * @param {string} challengeSlug - Le slug du défi.
 * @param {string} userId - L'ID de l'utilisateur.
 */
export const ReactionButtons = ({
  challengeSlug,
  userId,
}: {
  challengeSlug: string
  userId: string
}) => {
  const {state, actions, error} = useReaction(challengeSlug, userId)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <LikeButton liked={state.liked} onClick={actions.handleLikeClick} />
        <DislikeButton disliked={state.disliked} onClick={actions.handleDislikeClick} />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
