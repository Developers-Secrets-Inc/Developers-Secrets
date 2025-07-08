import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrCreateUserOnboarding, addOrUpdateSelectedTechnologies } from '@/core/onboarding'
import { UserOnboarding } from '@/payload-types'

export const useTechnology = (userId: string) => {
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
  const { mutate: setTechnologies, status } = useMutation({
    mutationFn: (technologies: { value: string; label: string }[]) =>
      addOrUpdateSelectedTechnologies(userId, technologies),
    onMutate: async (technologies) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<UserOnboarding>(queryKey)
      queryClient.setQueryData<UserOnboarding>(queryKey, (old) =>
        old ? { ...old, selectedLanguages: technologies } : old,
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
    selectedTechnologies: onboarding?.selectedLanguages || [],
    isLoading,
    isError,
    error,
    setTechnologies,
    isUpdating,
  }
}
