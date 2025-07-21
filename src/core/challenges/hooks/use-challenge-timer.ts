'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

const getQueryKey = (challengeId: number) => ['challengeTimer', challengeId]

const getStartTime = (challengeId: number): number | null => {
  try {
    const storedTime = localStorage.getItem(`challenge_start_time_${challengeId}`)
    return storedTime ? parseInt(storedTime, 10) : null
  } catch (error) {
    console.error('Could not access localStorage:', error)
    return null
  }
}

const setStartTime = (challengeId: number): number => {
  const now = Date.now()
  try {
    localStorage.setItem(`challenge_start_time_${challengeId}`, now.toString())
  } catch (error) {
    console.error('Could not access localStorage:', error)
  }
  return now
}

const removeStartTime = (challengeId: number) => {
  try {
    localStorage.removeItem(`challenge_start_time_${challengeId}`)
  } catch (error) {
    console.error('Could not access localStorage:', error)
  }
}

export const useChallengeTimer = (challengeId: number) => {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => getQueryKey(challengeId), [challengeId])

  const { data: startTime } = useQuery({
    queryKey,
    queryFn: () => getStartTime(challengeId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  })

  const startMutation = useMutation({
    mutationFn: () => Promise.resolve(setStartTime(challengeId)),
    onSuccess: (newStartTime) => {
      queryClient.setQueryData(queryKey, newStartTime)
    },
  })

  const stopMutation = useMutation({
    mutationFn: () => Promise.resolve(removeStartTime(challengeId)),
    onSuccess: () => {
      queryClient.setQueryData(queryKey, null)
    },
  })

  const getTimeSpent = useCallback(() => {
    const currentStartTime = queryClient.getQueryData<number>(queryKey)
    if (!currentStartTime) {
      return null
    }
    const diff = Date.now() - currentStartTime
    const seconds = Math.floor((diff / 1000) % 60)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)

    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    }
  }, [queryClient, queryKey])

  return {
    startTime,
    startTimer: startMutation.mutate,
    stopTimer: stopMutation.mutate,
    getTimeSpent,
  }
}
