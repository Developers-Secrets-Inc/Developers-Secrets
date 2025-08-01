'use client'

import { GenericLikeButton } from '@/components/common/reactions/like-button'
import { GenericDislikeButton } from '@/components/common/reactions/dislike-button'
import { useCoursePartReaction } from '@/api/course-parts/hooks/use-reaction'
import { usePreloadedQuery } from '@/core/functions/hooks/use-preload'
import type { Preloaded } from '@/core/functions/types'
import { CoursePartEngagement } from '@/payload-types'

interface EngagementButtonsProps {
  userId: string
  coursePartId: number
  preloaded?: Preloaded<CoursePartEngagement, { userId: string; coursePartId: number }>
}

export function EngagementButtons({ userId, coursePartId, preloaded }: EngagementButtonsProps) {
  const preloadedData = preloaded ? usePreloadedQuery(preloaded) : undefined
  const { liked, disliked, isLoading, handleLikeClick, handleDislikeClick } =
    useCoursePartReaction({
      userId,
      coursePartId,
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
