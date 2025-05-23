import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOnboarding, addSelectedTechnologiesToLearn } from '@/core/onboarding'
import { UserOnboarding } from '@/payload-types'

const PYTHON_TECH = [{ value: 'python', label: 'Python' }]

export const useTechnologyToLearn = (userId: string) => {
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
  const { mutate: setTechnology, status } = useMutation({
    mutationFn: () => addSelectedTechnologiesToLearn(userId, PYTHON_TECH),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<UserOnboarding>(queryKey)
      queryClient.setQueryData<UserOnboarding>(queryKey, (old) =>
        old ? { ...old, selectedTechnologiesToLearn: PYTHON_TECH } : old,
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
    selectedTechnology: onboarding?.selectedTechnologiesToLearn || PYTHON_TECH,
    isLoading,
    isError,
    error,
    setTechnology,
    isUpdating,
  }
}
