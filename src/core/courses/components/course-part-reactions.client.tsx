'use client'

import { usePartReaction } from '@/hooks/reactions/use-reaction' // Assure-toi que c'est le bon chemin
import { GenericReactionButtons } from '@/components/common/reactions/reaction-buttons'
import { Skeleton } from '@/components/ui/skeleton' // Import Skeleton
import { GenericLikeButton } from '@/components/common/reactions/like-button'
import { GenericDislikeButton } from '@/components/common/reactions/dislike-button'

type ReactionStatus = 'liked' | 'disliked' | 'none'

interface CoursePartReactionsClientProps {
  partId: number
  userId: string
  initialUserReaction: ReactionStatus
}

export function CoursePartReactionsClient({
  partId,
  userId,
  initialUserReaction,
}: CoursePartReactionsClientProps) {
  const { state, actions } = usePartReaction({
    partId,
    userId,
    initialUserReaction,
  })

  if (state.isInitialLoading) {
    return (
      <div className="flex items-center gap-2 h-9">
        <Skeleton className="h-full w-16" />
        <Skeleton className="h-full w-16" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="flex items-center gap-2">
        <GenericLikeButton
          isActive={state.userReaction === 'liked'}
          onClick={actions.handleLikeClick}
        />
        <GenericDislikeButton
          isActive={state.userReaction === 'disliked'}
          onClick={actions.handleDislikeClick}
        />
      </div>
      {state.error && <div className="text-xs text-red-500 mt-1">{state.error}</div>}
    </div>
  )
}
