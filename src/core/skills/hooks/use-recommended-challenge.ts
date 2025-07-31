'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Challenge } from '@/payload-types'
import { getRandomUncompletedChallenge } from '@/api/challenges'

const recommendedChallengeQueryKey = (userId: string) => ['recommendedChallenge', userId]

type UseRecommendedChallengeOptions = {
  userId: string
  initialData: {
    id: number
    title: string
    slug: string
    difficulty: Challenge['difficulty']
    baseExperience?: number | null
  } | null
}

export const useRecommendedChallenge = ({
  userId,
  initialData,
}: UseRecommendedChallengeOptions) => {
  const queryClient = useQueryClient()

  const {
    data: recommendedChallenge,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: recommendedChallengeQueryKey(userId),
    queryFn: async () => {
      const challenge = await getRandomUncompletedChallenge({ userId })
      if (!challenge) {
        return null
      }
      return challenge
    },
    initialData: initialData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!userId,
  })

  const fetchNewRecommendationWithFeedback = async (feedbackType: string) => {
    try {
      const newChallenge = await getRandomUncompletedChallenge({ userId })
      queryClient.setQueryData(recommendedChallengeQueryKey(userId), newChallenge)
    } catch (err) {
      console.error('Failed to fetch new recommended challenge with feedback:', err)
    } finally {
    }
  }

  return {
    recommendedChallenge,
    isLoading,
    error,
    fetchNewRecommendationWithFeedback,
    isFetching: queryClient.isFetching({ queryKey: recommendedChallengeQueryKey(userId) }) > 0,
  }
}
