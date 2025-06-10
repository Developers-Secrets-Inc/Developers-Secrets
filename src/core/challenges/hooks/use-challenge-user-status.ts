'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getUserCompletionStatus,
  setUserCompletionStatus,
} from '@/core/challenges/user-progression'
import { CompletionStatus } from '../user-progression/types'

export const useChallengeUserStatus = (challengeId: number, userId: string) => {
  const queryClient = useQueryClient()
  
  // Query pour récupérer le statut actuel
  const { 
    data: status,
    isLoading,
    error
  } = useQuery({
    queryKey: ['challengeStatus', userId, challengeId],
    queryFn: () => getUserCompletionStatus(userId, challengeId),
    enabled: !!userId,
    initialData: 'not_started' as CompletionStatus
  })

  // Mutation pour mettre à jour le statut
  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async (newStatus: CompletionStatus) => {
      if (!userId) throw new Error('User not authenticated')
      return setUserCompletionStatus(userId, challengeId, newStatus)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['challengeStatus', userId, challengeId] 
      })
    },
    onError: (error) => {
      console.error('Failed to update challenge status:', error)
    }
  })

  return {
    status,
    isLoading,
    error,
    updateStatus,
    setCompleted: () => updateStatus('completed'),
    setInProgress: () => updateStatus('in_progress'),
    setNotStarted: () => updateStatus('not_started')
  }
}
