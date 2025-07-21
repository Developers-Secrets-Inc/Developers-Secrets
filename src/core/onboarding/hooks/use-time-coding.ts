import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOnboarding, setTimeCoding } from '@/core/onboarding'
import { TimeCoding, UserOnboarding } from '@/core/onboarding/types'

export const useTimeCoding = (userId: string) => {
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
  })

  const timeCoding = onboardingData?.timeCoding || undefined

  // Mutation to update the timeCoding with optimistic update
  const { mutate: setTimeCodingMutation, status } = useMutation({
    mutationFn: (newTimeCoding: TimeCoding) => setTimeCoding(userId, newTimeCoding),
    onMutate: async (newTimeCoding: TimeCoding) => {
      await queryClient.cancelQueries({ queryKey })
      const previousOnboardingData = queryClient.getQueryData<UserOnboarding>(queryKey)
      queryClient.setQueryData<UserOnboarding>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, timeCoding: newTimeCoding }
      })
      return { previousOnboardingData }
    },
    onError: (err, newTimeCoding, context) => {
      if (context?.previousOnboardingData) {
        queryClient.setQueryData<UserOnboarding>(queryKey, context.previousOnboardingData)
      }
      console.error('Failed to update time coding:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const isUpdating = status === 'pending'

  return {
    timeCoding,
    isLoading,
    isError,
    error,
    setTimeCoding: setTimeCodingMutation,
    isUpdating,
  }
}
