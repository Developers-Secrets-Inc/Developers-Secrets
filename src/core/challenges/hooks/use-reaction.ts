'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleChallengeLike,
  toggleChallengeDislike,
} from '@/core/challenges/user-progression/actions'
import { hasUserLikedChallenge, hasUserDislikedChallenge } from '@/core/challenges/user-progression'
import { useChallengeStore } from '@/core/challenges/store'

export const useChallengeReaction = () => {
  const { challenge, user } = useChallengeStore()
  const challengeId = challenge?.id
  const userId = user?.id
  const queryClient = useQueryClient()

  const queryKey = ['challengeReaction', challengeId, userId]

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!challengeId || !userId) {
        // Return default state if IDs are not available
        return { liked: false, disliked: false }
      }
      const [liked, disliked] = await Promise.all([
        hasUserLikedChallenge(userId, challengeId),
        hasUserDislikedChallenge(userId, challengeId),
      ])
      return { liked, disliked }
    },
    // Only enable the query if both challengeId and userId are available
    enabled: !!challengeId && !!userId,
    staleTime: Infinity, // Reactions don't change often
  })

  const likeMutation = useMutation({
    mutationFn: async (newLikedState: boolean) => {
      if (!challengeId) throw new Error('Challenge ID is missing.')
      return toggleChallengeLike(newLikedState, challengeId)
    },
    onMutate: async (newLikedState) => {
      await queryClient.cancelQueries({ queryKey: queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        liked: newLikedState,
        disliked: newLikedState ? false : old?.disliked, // If liking, cannot be disliked
      }))
      return { previousData }
    },
    onError: (err, newLikedState, context) => {
      queryClient.setQueryData(queryKey, context?.previousData)
      console.error('Error toggling like:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const dislikeMutation = useMutation({
    mutationFn: async (newDislikedState: boolean) => {
      if (!challengeId) throw new Error('Challenge ID is missing.')
      return toggleChallengeDislike(newDislikedState, challengeId)
    },
    onMutate: async (newDislikedState) => {
      await queryClient.cancelQueries({ queryKey: queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        disliked: newDislikedState,
        liked: newDislikedState ? false : old?.liked, // If disliking, cannot be liked
      }))
      return { previousData }
    },
    onError: (err, newDislikedState, context) => {
      queryClient.setQueryData(queryKey, context?.previousData)
      console.error('Error toggling dislike:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const handleLikeClick = () => {
    likeMutation.mutate(!data?.liked)
  }

  const handleDislikeClick = () => {
    dislikeMutation.mutate(!data?.disliked)
  }

  return {
    state: { liked: data?.liked ?? false, disliked: data?.disliked ?? false, isLoading },
    actions: { handleLikeClick, handleDislikeClick },
    error: isError ? error?.message : null,
  }
}
