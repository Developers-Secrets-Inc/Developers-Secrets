import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSubmissions } from '..'

import { useSessionUser } from '@/core/user/hooks/use-user'

export const SUBMISSIONS_QUERY_KEY = 'submissions'

export const useChallengeSubmissions = (
  challengeId: number,
  page: number = 1,
  perPage: number = 10,
) => {
  const { user } = useSessionUser()
  const userId = user?.id

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [SUBMISSIONS_QUERY_KEY, challengeId, userId, page, perPage],
    queryFn: async () => {
      if (!userId) {
        // Cela ne devrait pas se produire si enabled est correctement géré, mais c'est une sécurité
        throw new Error('User ID is not available for fetching submissions.')
      }
      return getSubmissions(challengeId, userId, page, perPage)
    },
    enabled: !!userId,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  })

  return {
    paginationData: data, // Returning the full PaginatedDocs object
    isLoading,
    isError,
    error,
  }
}
