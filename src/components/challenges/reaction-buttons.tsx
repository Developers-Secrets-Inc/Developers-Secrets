import { getUserChallengeProgression } from '@/core/user-progression'
import { ReactionButtons as ClientReactionButtons } from './reaction-buttons.client'

export const ReactionButtons = async ({
  challengeSlug,
  userId,
}: {
  challengeSlug: string
  userId: string
}) => {
  const userProgress = await getUserChallengeProgression(userId, challengeSlug)
  const { hasLiked, hasDisliked } = {
    hasLiked: userProgress?.hasLiked || false,
    hasDisliked: userProgress?.hasDisliked || false,
  }

  return (
    <ClientReactionButtons
      initialLiked={hasLiked}
      initialDisliked={hasDisliked}
      challengeSlug={challengeSlug}
    />
  )
}
