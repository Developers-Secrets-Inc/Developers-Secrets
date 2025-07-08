'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentChallengeStreak, updateChallengeStreak } from '..'
import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'

const challengeStreakQueryKeys = {
  all: ['challenge-streak'] as const,
  current: (userId: string) => [...challengeStreakQueryKeys.all, userId] as const,
}

export const useChallengeStreak = (userId: string) => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: challengeStreakQueryKeys.current(userId),
    queryFn: () => getCurrentChallengeStreak(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  })

  const mutation = useMutation({
    mutationFn: () => updateChallengeStreak(userId),
    onSuccess: (streakUpdateInfo) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: challengeStreakQueryKeys.current(userId) })

      // Store the result in Zustand for the dialog to use instantly
      useChallengeEditorStore.getState().setStreakUpdateInfo(streakUpdateInfo)
    },
  })

  return {
    streakLength: data?.streakLength ?? 0,
    challengesToday: data?.challengesToday ?? 0,
    isLoading,
    isError,
    updateStreak: mutation,
  }
}
