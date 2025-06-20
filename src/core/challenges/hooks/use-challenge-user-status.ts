'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCompletionStatus,
  setCompletionStatus,
} from '@/core/challenges/user-progression/completion-status'
import { CompletionStatus } from '../user-progression/types'
import { useSessionUser } from '@/core/user/hooks/use-user'

export const useChallengeUserStatus = (challengeId: number) => {
  const queryClient = useQueryClient()
  const { user } = useSessionUser()
  const userId = user?.id

  const {
    data: status,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['challengeStatus', userId, challengeId],
    queryFn: () => {
      if (!userId || !challengeId) {
        throw new Error('User ID or Challenge ID is undefined in queryFn.')
      }
      return getCompletionStatus(userId, challengeId)
    },
    // enabled: !!userId && !!challengeId,
    initialData: 'not_started' as CompletionStatus,
  })

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async (newStatus: CompletionStatus) => {
      if (!userId || !challengeId) {
        console.log('Cannot find userId or challengeId')
        return
      }
      console.log('Setting user completion status to', newStatus)
      return setCompletionStatus(userId, challengeId, newStatus)
    },
    onMutate: async (newStatus: CompletionStatus) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['challengeStatus', userId, challengeId],
      })

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData<CompletionStatus>([
        'challengeStatus',
        userId,
        challengeId,
      ])

      // Optimistically update to the new value
      queryClient.setQueryData(['challengeStatus', userId, challengeId], newStatus)

      return { previousStatus }
    },
    onError: (error, newStatus, context) => {
      console.error('Failed to update challenge status:', error)
      // Rollback to the previous value on error
      queryClient.setQueryData(['challengeStatus', userId, challengeId], context?.previousStatus)
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({
        queryKey: ['challengeStatus', userId, challengeId],
      })
    },
  })

  return {
    status,
    isLoading,
    error,
    updateStatus,
    setCompleted: () => updateStatus('completed'),
    setInProgress: () => updateStatus('in_progress'),
    setNotStarted: () => updateStatus('not_started'),
  }
}
