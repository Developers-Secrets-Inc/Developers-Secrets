'use client'

import { useQuery, useMutation } from '@/core/functions/hooks'
import {
  findUserChallengeEngagement,
  createUserChallengeEngagement,
  updateUserChallengeEngagement,
  removeUserChallengeEngagement,
} from '@/api/challenges/engagement/engagement'
import { ChallengeEngagement } from '@/payload-types'

interface UseChallengeEngagementProps {
  userId: string
  challengeId: number
  initial?: ChallengeEngagement
}

export function useChallengeEngagement({
  userId,
  challengeId,
  initial,
}: UseChallengeEngagementProps) {
  const { data, isLoading, refetch } = useQuery(
    findUserChallengeEngagement,
    { userId, challengeId },
    {
      enabled: !!userId && !!challengeId,
      initialData: initial,
    },
  )

  const createMutation = useMutation(createUserChallengeEngagement, {
    onSuccess: () => refetch(),
  })
  const updateMutation = useMutation(updateUserChallengeEngagement, {
    onSuccess: () => refetch(),
  })
  const removeMutation = useMutation(removeUserChallengeEngagement, {
    onSuccess: () => refetch(),
  })

  const liked = data?.type === 'like'
  const disliked = data?.type === 'dislike'
  const engagementId = data?.id

  const handleLikeClick = () => {
    if (liked && engagementId) {
      removeMutation.mutate({ engagementId })
    } else if (engagementId) {
      updateMutation.mutate({ engagementId, type: 'like' })
    } else {
      createMutation.mutate({ userId, challengeId, type: 'like' })
    }
  }

  const handleDislikeClick = () => {
    if (disliked && engagementId) {
      removeMutation.mutate({ engagementId })
    } else if (engagementId) {
      updateMutation.mutate({ engagementId, type: 'dislike' })
    } else {
      createMutation.mutate({ userId, challengeId, type: 'dislike' })
    }
  }

  return {
    liked,
    disliked,
    isLoading:
      isLoading || createMutation.isPending || updateMutation.isPending || removeMutation.isPending,
    handleLikeClick,
    handleDislikeClick,
  }
}
