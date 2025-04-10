import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSubmissions } from '..'
import { handleSubmission } from '../client-actions'
import {
  AcceptedSubmission,
  RunTimeErrorSubmission,
  TimeLimitExceededSubmission,
  WrongAnswerSubmission,
} from '../index.client'

export type Submission = {
  id: string
  submissionType: 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'
  testsPassed: number
  testsTotal: number
  createdAt: string
  code: {
    language: string
    content: string
  }
}

let tempIdCounter = -1

export const useSubmissions = (challengeId: number, userId: string) => {
  const queryClient = useQueryClient()
  const queryKey = ['submissions', challengeId, userId] as const

  const {
    data: submissions = [],
    isLoading,
    isFetching,
  } = useQuery<Submission[]>({
    queryKey,
    queryFn: async () => {
      const data = await getSubmissions(challengeId, userId)
      return data.map((submission) => ({
        id: submission.id.toString(),
        submissionType: submission.submissionType,
        testsPassed: submission.testsPassed,
        testsTotal: submission.testsTotal,
        createdAt: submission.createdAt,
        code: submission.code,
      }))
    },
    staleTime: 60000,
    placeholderData: (previousData) => previousData,
  })

  const addSubmission = useMutation({
    mutationFn: async (
      submission:
        | AcceptedSubmission
        | RunTimeErrorSubmission
        | WrongAnswerSubmission
        | TimeLimitExceededSubmission,
    ) => {
      const result = await handleSubmission(submission, challengeId, userId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit')
      }
      return result.data
    },
    onMutate: async (newSubmission) => {
      await queryClient.cancelQueries({ queryKey })
      const previousSubmissions = queryClient.getQueryData<Submission[]>(queryKey) || []

      const tempId = tempIdCounter--
      const tempSubmission: Submission = {
        id: tempId.toString(),
        submissionType: newSubmission.type,
        testsPassed: newSubmission.testsPassed,
        testsTotal: newSubmission.testsTotal,
        createdAt: new Date().toISOString(),
        code: newSubmission.code,
      }

      queryClient.setQueryData<Submission[]>(queryKey, [tempSubmission, ...previousSubmissions])

      return { previousSubmissions, tempId }
    },
    onSuccess: (serverSubmission, _, context) => {
      if (!context) return

      const currentSubmissions = queryClient.getQueryData<Submission[]>(queryKey) || []

      // Remplacer la soumission temporaire par celle du serveur
      const updatedSubmissions = currentSubmissions.map((submission) =>
        submission.id === context.tempId.toString()
          ? {
              id: serverSubmission.id.toString(),
              submissionType: serverSubmission.submissionType,
              testsPassed: serverSubmission.testsPassed,
              testsTotal: serverSubmission.testsTotal,
              createdAt: serverSubmission.createdAt,
              code: serverSubmission.code,
            }
          : submission,
      )

      queryClient.setQueryData<Submission[]>(queryKey, updatedSubmissions)
    },
    onError: (_, __, context) => {
      if (context?.previousSubmissions) {
        queryClient.setQueryData(queryKey, context.previousSubmissions)
      }
    },
  })

  return {
    submissions,
    isLoading,
    isFetching,
    addSubmission,
  }
}
