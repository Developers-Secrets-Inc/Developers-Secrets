import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOnboarding, addSelectedGoals } from '@/core/onboarding'
import { UserOnboarding } from '@/payload-types'

export const useGoals = (userId: string) => {
  const queryClient = useQueryClient()
  const queryKey = ['onboarding', userId]

  // Fetch onboarding document
  const {
    data: onboarding,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getOnboarding(userId),
  })

  // Mutation for optimistic update
  const { mutate: setGoals, status } = useMutation({
    mutationFn: (goals: { value: string; label: string }[]) => addSelectedGoals(userId, goals),
    onMutate: async (goals) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<UserOnboarding>(queryKey)
      queryClient.setQueryData<UserOnboarding>(queryKey, (old) =>
        old ? { ...old, selectedGoals: goals } : old,
      )
      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData<UserOnboarding>(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const isUpdating = status === 'pending'

  return {
    selectedGoals: onboarding?.selectedGoals || [],
    isLoading,
    isError,
    error,
    setGoals,
    isUpdating,
  }
}
