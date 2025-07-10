'use client'

import { useMutation } from '@tanstack/react-query'
import { SupportedLanguage } from '../challenge-editor/store'
import { submitCode } from '@/core/challenges/submissions/index.client'

interface SubmitCodeArgs {
  userId: string
  challengeId: number
  code: string
  language: SupportedLanguage
}

export const useSubmitCode = () => {
  const {
    mutateAsync: submitCodeMutation,
    isPending: isLoadingSubmit,
    data: submissionResult,
    error: submissionError,
  } = useMutation({
    mutationFn: async (options: SubmitCodeArgs) => {
      // The new `submitCode` function directly calls the secure server action.
      // The server action will execute the code against trusted test cases
      // and return an authoritative result, including detailed test outcomes.
      const result = await submitCode(options)

      if (!result) {
        throw new Error('Submission failed on the server.')
      }

      // The server response is now the source of truth.
      return result
    },
  })

  return {
    submitCode: submitCodeMutation,
    isLoadingSubmit,
    // The structure of submissionResult now directly matches
    // what the server action returns.
    submissionResult,
    submissionError,
  }
}
