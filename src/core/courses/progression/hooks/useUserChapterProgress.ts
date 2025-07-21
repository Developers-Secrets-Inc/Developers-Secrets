'use client'

import { useCallback } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  getUserChapterCompletionStatus,
  updateUserChapterCompletionStatus,
} from '@/core/courses/progression/completion-status' // Actions for chapters
import { UserChapterProgress } from '@/payload-types' // Type for chapter progress
import { toast } from 'sonner'

// Re-export CompletionStatus type for consistency if needed, or import from a shared location
export type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

interface UseUserChapterProgressProps {
  chapterId: number
  userId: string | null // Allow null for userId
  initialStatus?: CompletionStatus // Make initialStatus optional
  enabled?: boolean
}

// Query key factory
const getUserChapterProgressQueryKey = (userId: string | null, chapterId: number) =>
  ['userChapterProgress', userId, chapterId] as const

/**
 * Hook to manage and query the completion status of a specific course chapter for a user.
 */
export function useUserChapterProgress({
  chapterId,
  userId,
  initialStatus = 'not_started', // Default initial status if not provided
  enabled = true,
}: UseUserChapterProgressProps) {
  const queryClient = useQueryClient()
  const queryKey = getUserChapterProgressQueryKey(userId, chapterId)

  // Query to fetch the current chapter completion status
  const { data: currentStatus = initialStatus, isLoading: isInitialLoading } =
    useQuery<CompletionStatus>({
      queryKey,
      queryFn: async () => {
        if (!userId) return 'not_started' // Return default if no user
        // Assuming getUserChapterCompletionStatus handles the case where no record exists
        return await getUserChapterCompletionStatus(userId, chapterId)
      },
      initialData: initialStatus,
      enabled: enabled && !!userId, // Only enable if userId is present and hook is enabled
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: true,
    })

  // Mutation to update the chapter completion status (might be less used if server hook handles updates)
  const mutation = useMutation({
    mutationFn: (newStatus: CompletionStatus) => {
      if (!userId) return Promise.reject(new Error('User ID is missing'))
      return updateUserChapterCompletionStatus(userId, chapterId, newStatus)
    },

    // Optimistic update logic (similar to part completion hook)
    onMutate: async (newStatus: CompletionStatus) => {
      if (!userId) return
      await queryClient.cancelQueries({ queryKey })
      const previousStatus = queryClient.getQueryData<CompletionStatus>(queryKey)
      queryClient.setQueryData(queryKey, newStatus)
      return { previousStatus }
    },

    onError: (error: Error, newStatus, context) => {
      if (!userId) return
      const errorMsg = error.message
      toast.error(`Failed to update chapter status: ${errorMsg}`)
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(queryKey, context.previousStatus)
      } else {
        // If no previous status, invalidate to refetch from server
        queryClient.invalidateQueries({ queryKey })
      }
    },

    onSuccess: (data: UserChapterProgress | null) => {
      if (!userId) return
      // Update the query cache with the confirmed status from the server response
      if (data?.completionStatus) {
        queryClient.setQueryData(queryKey, data.completionStatus)
      } else {
        // If update somehow failed server-side or returned null, invalidate to be safe
        queryClient.invalidateQueries({ queryKey })
      }
    },
    // Optional: Invalidate query onSettled to ensure consistency
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey })
    // }
  })

  // Exposed function to trigger the status update
  const updateStatus = useCallback(
    (newStatus: CompletionStatus) => {
      if (!userId) {
        toast.error('Cannot update status: User not logged in.')
        return
      }
      mutation.mutate(newStatus)
    },
    [mutation, userId],
  )

  return {
    status: currentStatus,
    updateStatus, // Function to call to change status
    isLoading: mutation.isPending, // Loading state during mutation
    isInitialLoading: isInitialLoading, // Loading state for the initial fetch
    error: mutation.error instanceof Error ? mutation.error.message : null, // Error from mutation
  }
}
