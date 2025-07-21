import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { canAccessSolution, setSolutionUnlocked } from '../user-progression/completion-status'

export const solutionQueryKeys = {
  solutionUnlock: (userId: string, challengeId: number) =>
    ['solution', 'unlock', userId, challengeId] as const,
}

export const useSolutionUnlockStatus = (userId: string, challengeId: number) => {
  return useQuery({
    queryKey: solutionQueryKeys.solutionUnlock(userId, challengeId),
    queryFn: () => canAccessSolution(userId, challengeId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

export const useUnlockSolution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, challengeId }: { userId: string; challengeId: number }) =>
      setSolutionUnlocked(userId, challengeId),
    onSuccess: (_, { userId, challengeId }) => {
      queryClient.invalidateQueries({
        queryKey: solutionQueryKeys.solutionUnlock(userId, challengeId),
      })
    },
  })
}
