'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSolutionUnlockStatus, markSolutionAsUnlocked } from '@/core/courses/progression/actions'

interface UseSolutionUnlockStatusProps {
  partId: number
  userId: string | null
  initialStatus?: boolean // Optional initial status
  enabled?: boolean
}

// Query key factory
const getSolutionUnlockStatusQueryKey = (userId: string | null, partId: number) =>
  ['solutionUnlockStatus', userId, partId] as const

/**
 * Hook to manage and query the solution unlock status for a specific course part.
 */
export function useSolutionUnlockStatus({
  partId,
  userId,
  initialStatus = false, // Default to false (locked)
  enabled = true,
}: UseSolutionUnlockStatusProps) {
  const queryClient = useQueryClient()
  const queryKey = getSolutionUnlockStatusQueryKey(userId, partId)

  // Query to fetch the current unlock status
  const { data: isUnlocked = initialStatus, isLoading: isFetchingStatus } = useQuery<boolean>({
    queryKey,
    queryFn: async () => {
      if (!userId) return false // Not unlocked if no user
      return getSolutionUnlockStatus(userId, partId)
    },
    initialData: initialStatus,
    enabled: enabled && !!userId, // Only enable if userId is present and hook is enabled
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
    refetchOnWindowFocus: true,
  })

  // Mutation to mark the solution as unlocked
  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User ID is missing')
      const result = await markSolutionAsUnlocked(userId, partId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to unlock solution')
      }
      return true // Indicate success
    },
    onMutate: async () => {
      if (!userId) return
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData<boolean>(queryKey)

      // Optimistically update to the new value (true = unlocked)
      queryClient.setQueryData(queryKey, true)

      // Return a context object with the previous value
      return { previousStatus }
    },
    onError: (error: Error, _, context) => {
      if (!userId) return
      toast.error(`Failed to unlock solution: ${error.message}`)
      // Roll back to the previous value on error
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(queryKey, context.previousStatus)
      }
    },
    onSuccess: () => {
      // Optional: Re-invalidate on success to ensure consistency, though optimistic update handles UI
      // queryClient.invalidateQueries({ queryKey })
      toast.info('Solution unlocked!') // Give feedback on success
    },
    onSettled: () => {
      if (!userId) return
      // Always refetch after error or success to ensure sync with server
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    isUnlocked,
    unlockSolution: mutation.mutate, // Expose the mutate function
    unlockSolutionAsync: mutation.mutateAsync, // Expose async version if needed
    isLoading: mutation.isPending, // Is mutation running?
    isFetchingStatus, // Is initial query fetching?
    error: mutation.error instanceof Error ? mutation.error.message : null,
  }
}
