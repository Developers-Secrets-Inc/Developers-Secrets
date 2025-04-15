import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserIsSolutionUnlocked,
  setUserIsSolutionUnlocked,
} from '@/core/challenges/user-progression'

export const solutionQueryKeys = {
  solutionUnlock: (userId: string, challengeId: number) =>
    ['solution', 'unlock', userId, challengeId] as const,
}

export function useSolutionUnlockStatus(userId: string, challengeId: number) {
  return useQuery({
    queryKey: solutionQueryKeys.solutionUnlock(userId, challengeId),
    queryFn: () => getUserIsSolutionUnlocked(userId, challengeId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

export function useUnlockSolution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, challengeId }: { userId: string; challengeId: number }) =>
      setUserIsSolutionUnlocked(userId, challengeId, true),
    onSuccess: (_, { userId, challengeId }) => {
      queryClient.invalidateQueries({
        queryKey: solutionQueryKeys.solutionUnlock(userId, challengeId),
      })
    },
  })
}
