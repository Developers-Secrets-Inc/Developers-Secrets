'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserRating } from '@/core/challenges/user-progression'
import { rateChallenge } from '@/core/challenges/user-progression/actions'
import { useChallengeStore } from '@/core/challenges/store'
import { toast } from 'sonner'

export const useChallengeRating = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()
  const { challenge, user } = useChallengeStore()

  const challengeId = challenge?.id
  const userId = user?.id

  const queryKey = ['challengeRating', challengeId, userId]

  const { data: rating, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!challengeId || !userId) {
        return undefined
      }
      return getUserRating(userId, challengeId)
    },
    enabled: !!challengeId && !!userId,
    staleTime: Infinity,
  })

  const rateMutation = useMutation({
    mutationFn: async ({ newRating }: { newRating: number }) => {
      if (!challengeId) {
        throw new Error('Challenge ID is missing.')
      }
      return rateChallenge(challengeId, newRating)
    },
    onMutate: async ({ newRating }) => {
      await queryClient.cancelQueries({ queryKey: queryKey })
      const previousRating = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, newRating)
      return { previousRating }
    },
    onError: (err, newRating, context) => {
      queryClient.setQueryData(queryKey, context?.previousRating)
      toast.error('Error submitting rating: ' + err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
      toast.success('Thank you for rating this challenge!')
      onSuccessCallback?.()
    },
  })

  return {
    rating,
    isLoading,
    isError,
    error,
    rate: rateMutation.mutate,
    isSubmitting: rateMutation.isPending,
  }
}