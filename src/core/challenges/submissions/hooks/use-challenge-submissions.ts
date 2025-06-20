import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSubmissions } from '..'
import {
  AcceptedSubmission,
  RunTimeErrorSubmission,
  WrongAnswerSubmission,
  TimeLimitExceededSubmission,
} from '../index.client'
import { handleSubmission } from '../client-actions'
import { useSessionUser } from '@/core/user/hooks/use-user'

export const SUBMISSIONS_QUERY_KEY = 'submissions'

export const useChallengeSubmissions = (challengeId: number) => {
  const { user } = useSessionUser()
  const userId = user?.id

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [SUBMISSIONS_QUERY_KEY, challengeId, userId],
    queryFn: async () => {
      if (!userId) {
        // Cela ne devrait pas se produire si enabled est correctement géré, mais c'est une sécurité
        throw new Error('User ID is not available for fetching submissions.');
      }
      return getSubmissions(challengeId, userId);
    },
    enabled: !!userId,
  })

  const { mutateAsync: createSubmission } = useMutation({
    mutationFn: (
      submissionData:
        | AcceptedSubmission
        | RunTimeErrorSubmission
        | WrongAnswerSubmission
        | TimeLimitExceededSubmission,
    ) => handleSubmission(submissionData, challengeId, userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBMISSIONS_QUERY_KEY] })
    },
  })

  return {
    submissions: data,
    isLoading,
    isError,
    error,
    createSubmission,
  }
}
