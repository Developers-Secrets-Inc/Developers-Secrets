'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CoursePartSubmission as PayloadSubmission } from '@/payload-types'
import {
  getCoursePartSubmissions,
  createCoursePartSubmission as clientCreateSubmission,
} from '../client-actions'

// Define the explicit shape of the submission data used within the hook/UI
export type CoursePartSubmission = {
  id: string // Explicitly string
  submissionType: PayloadSubmission['submissionType']
  testsPassed: PayloadSubmission['testsPassed']
  testsTotal: PayloadSubmission['testsTotal']
  createdAt: PayloadSubmission['createdAt']
  code: PayloadSubmission['code']
  // Include failure detail fields if needed
  error?: PayloadSubmission['error']
  input?: PayloadSubmission['input']
  output?: PayloadSubmission['output']
  expectedOutput?: PayloadSubmission['expectedOutput']
  lastExpectedOutput?: PayloadSubmission['lastExpectedOutput']
}

// Type for the data passed to the mutation function
// Ensure this matches what createCoursePartSubmission client action expects
type CreateSubmissionInput = Omit<PayloadSubmission, 'id' | 'createdAt' | 'updatedAt'> & {
  part: number
}

// Counter for temporary IDs during optimistic updates
let tempIdCounter = -1

export const useCoursePartSubmissions = (
  partId: number,
  userId: string | null,
  initialData?: CoursePartSubmission[], // Add optional initialData
) => {
  const queryClient = useQueryClient()
  const queryKey = ['coursePartSubmissions', partId, userId] as const

  const {
    data: submissions = initialData || [], // Use initialData for default state if provided
    isLoading,
    isFetching,
  } = useQuery<CoursePartSubmission[]>({
    queryKey,
    queryFn: async () => {
      if (!userId) return [] // Don't fetch if userId is null
      const data = await getCoursePartSubmissions(partId, userId)
      // Map the raw payload data to the explicit hook/UI shape
      return data.map(
        (submission): CoursePartSubmission => ({
          id: submission.id.toString(), // Convert server ID to string here
          submissionType: submission.submissionType,
          testsPassed: submission.testsPassed,
          testsTotal: submission.testsTotal,
          createdAt: submission.createdAt,
          code: submission.code,
          error: submission.error,
          input: submission.input,
          output: submission.output,
          expectedOutput: submission.expectedOutput,
          lastExpectedOutput: submission.lastExpectedOutput,
        }),
      )
    },
    enabled: !!userId, // Only run query if userId is available
    staleTime: 60000, // Cache for 1 minute
    initialData: initialData, // Explicitly pass initialData here
    placeholderData: undefined, // Remove placeholderData if using initialData
  })

  const addSubmission = useMutation({
    mutationFn: async (submissionInput: CreateSubmissionInput) => {
      const result = await clientCreateSubmission(submissionInput)
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to submit course part code')
      }
      return result.data // Return the created submission from the server
    },
    // Optimistic Update Logic
    onMutate: async (newSubmissionInput) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueryData<CoursePartSubmission[]>(queryKey) || []

      // Create a temporary submission object matching the explicit type
      const tempId = tempIdCounter--
      const tempSubmission: CoursePartSubmission = {
        id: tempId.toString(), // Already string
        submissionType: newSubmissionInput.submissionType,
        testsPassed: newSubmissionInput.testsPassed,
        testsTotal: newSubmissionInput.testsTotal,
        createdAt: new Date().toISOString(),
        code: newSubmissionInput.code,
        error: newSubmissionInput.error,
        input: newSubmissionInput.input,
        output: newSubmissionInput.output,
        expectedOutput: newSubmissionInput.expectedOutput,
        lastExpectedOutput: newSubmissionInput.lastExpectedOutput,
      }

      // Optimistically update to the new value (add to the start of the list)
      queryClient.setQueryData<CoursePartSubmission[]>(queryKey, [
        tempSubmission,
        ...previousSubmissions,
      ])

      // Return a context object with the snapshotted value and tempId
      return { previousSubmissions, tempId }
    },
    // On success, replace the temporary submission with the real one from the server
    onSuccess: (serverSubmission, _, context) => {
      if (!context) return

      queryClient.setQueryData<CoursePartSubmission[]>(queryKey, (old = []) =>
        old.map((submission) =>
          submission.id === context.tempId.toString()
            ? {
                // Map server data to our explicit hook/UI type
                id: serverSubmission.id.toString(), // Convert server ID to string
                submissionType: serverSubmission.submissionType,
                testsPassed: serverSubmission.testsPassed,
                testsTotal: serverSubmission.testsTotal,
                createdAt: serverSubmission.createdAt,
                code: serverSubmission.code,
                error: serverSubmission.error,
                input: serverSubmission.input,
                output: serverSubmission.output,
                expectedOutput: serverSubmission.expectedOutput,
                lastExpectedOutput: serverSubmission.lastExpectedOutput,
              }
            : submission,
        ),
      )
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context) => {
      if (context?.previousSubmissions) {
        queryClient.setQueryData(queryKey, context.previousSubmissions)
      }
      // TODO: Add user feedback (e.g., toast notification)
    },
    // Always refetch after error or success:
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey });
    // } // Optional: uncomment if you always want to refetch
  })

  return {
    submissions,
    isLoading,
    isFetching,
    addSubmission: addSubmission.mutateAsync, // Expose mutateAsync for promise handling
    isSubmitting: addSubmission.isPending, // Expose pending state
  }
}
