import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrCreateUserOnboarding, addOrUpdateSelectedConcepts } from '@/core/onboarding'
import { UserOnboarding } from '@/payload-types'

export const useTechnologyConcept = (userId: string) => {
  const queryClient = useQueryClient()
  const queryKey = ['user-onboarding', userId]

  // Fetch onboarding document
  const {
    data: onboarding,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getOrCreateUserOnboarding(userId),
  })

  // Mutation for optimistic update
  const { mutate: setConcepts, status } = useMutation({
    mutationFn: (concepts: { value: string; label: string }[]) =>
      addOrUpdateSelectedConcepts(userId, concepts),
    onMutate: async (concepts) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<UserOnboarding>(queryKey)
      queryClient.setQueryData<UserOnboarding>(queryKey, (old) =>
        old ? { ...old, selectedConcepts: concepts } : old,
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
    selectedConcepts: onboarding?.selectedConcepts || [],
    isLoading,
    isError,
    error,
    setConcepts,
    isUpdating,
  }
}
