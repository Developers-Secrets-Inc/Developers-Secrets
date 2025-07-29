'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCoursePartCompletionStatus, setCoursePartCompletionStatus } from '..'

type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

export const useCoursePartUserStatus = (partId: number, userId: string) => {
  const queryClient = useQueryClient()

  const {
    data: status,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['coursePartStatus', userId, partId],
    queryFn: () => {
      if (!userId || !partId) {
        throw new Error('User ID or Part ID is undefined in queryFn.')
      }
      return getCoursePartCompletionStatus({userId, partId})
    },
    // enabled: !!userId && !!partId,
  })

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async (newStatus: CompletionStatus) => {
      if (!userId || !partId) {
        console.log('Cannot find userId or partId')
        return
      }
      console.log('Setting user completion status to', newStatus)
      return setCoursePartCompletionStatus({userId, partId, newStatus})
    },
    onMutate: async (newStatus: CompletionStatus) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['coursePartStatus', userId, partId],
      })

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData([
        'coursePartStatus',
        userId,
        partId,
      ])

      // Optimistically update to the new value
      queryClient.setQueryData(['coursePartStatus', userId, partId], {
        _tag: 'some',
        value: { completionStatus: newStatus }
      })

      return { previousStatus }
    },
    onError: (error, newStatus, context) => {
      console.error('Failed to update coursePart status:', error)
      // Rollback to the previous value on error
      queryClient.setQueryData(['coursePartStatus', userId, partId], context?.previousStatus)
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({
        queryKey: ['coursePartStatus', userId, partId],
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
