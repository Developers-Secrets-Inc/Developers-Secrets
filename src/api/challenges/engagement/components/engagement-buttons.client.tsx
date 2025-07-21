'use client'

import { GenericLikeButton } from '@/components/common/reactions/like-button'
import { GenericDislikeButton } from '@/components/common/reactions/dislike-button'
import { useChallengeEngagement } from '../hooks/use-challenge-engagement'
import { usePreloadedQuery } from '@/core/functions/hooks/use-preload'
import type { Preloaded } from '@/core/functions/types'
import { ChallengeEngagement } from '@/payload-types'

interface EngagementButtonsProps {
  userId: string
  challengeId: number
  preloaded?: Preloaded<ChallengeEngagement, { userId: string; challengeId: number }>
}

export function EngagementButtons({ userId, challengeId, preloaded }: EngagementButtonsProps) {
  const preloadedData = preloaded ? usePreloadedQuery(preloaded) : undefined
  const { liked, disliked, isLoading, handleLikeClick, handleDislikeClick } =
    useChallengeEngagement({
      userId,
      challengeId,
      initial: preloadedData?.data,
    })

  return (
    <div className="flex items-center gap-2">
      <GenericLikeButton isActive={liked} onClick={handleLikeClick} isLoading={isLoading} />
      <GenericDislikeButton
        isActive={disliked}
        onClick={handleDislikeClick}
        isLoading={isLoading}
      />
    </div>
  )
}
