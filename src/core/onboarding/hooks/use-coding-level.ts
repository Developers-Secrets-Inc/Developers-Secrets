import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOnboarding, setCodingLevel } from '@/core/onboarding'
import { CodingLevel, UserOnboarding } from '@/core/onboarding/types'

export const useCodingLevel = (userId: string) => {
  const queryClient = useQueryClient()
  const queryKey = ['onboarding', userId]

  // Fetch the entire onboarding document
  const {
    data: onboardingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getOnboarding(userId),
    // Add options like staleTime, etc., as needed
  })

  const codingLevel = onboardingData?.codingLevel || undefined // Extract codingLevel, default to undefined

  // Mutation to update the coding level with optimistic update
  const { mutate: setCodingLevelMutation, status } = useMutation({
    mutationFn: (newCodingLevel: CodingLevel) => setCodingLevel(userId, newCodingLevel),

    // Optimistic update
    onMutate: async (newCodingLevel: CodingLevel) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousOnboardingData = queryClient.getQueryData<UserOnboarding>(queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData<UserOnboarding>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, codingLevel: newCodingLevel }
      })

      // Return a context object with the snapshotted value
      return { previousOnboardingData }
    },

    // If the mutation fails, use the context we returned from onMutate to roll back
    onError: (err, newCodingLevel, context) => {
      if (context?.previousOnboardingData) {
        queryClient.setQueryData<UserOnboarding>(queryKey, context.previousOnboardingData)
      }
      // Optionally show an error message (e.g., using a toast library)
      console.error('Failed to update coding level:', err)
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const isUpdating = status === 'pending'

  return {
    codingLevel,
    isLoading,
    isError,
    error,
    setCodingLevel: setCodingLevelMutation,
    isUpdating,
  }
}
