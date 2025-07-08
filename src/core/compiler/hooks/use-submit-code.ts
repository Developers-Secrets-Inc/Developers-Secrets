'use client'

import { useMutation } from '@tanstack/react-query'
import { SupportedLanguage } from '../challenge-editor/store'
import { submitCode } from '@/core/challenges/submissions/index.client'
import { compileCode } from '..';

interface SubmitCodeArgs {
  code: { content: string; language: SupportedLanguage }
  testCases: {
    input: { content: string; language: SupportedLanguage }
    expectedOutput: { content: string; language: SupportedLanguage }
  }[]
}


export const useSubmitCode = () => {
  const {
    mutateAsync: submitCodeMutation,
    isPending: isLoadingSubmit,
    data: submissionResult,
    error: submissionError,
  } = useMutation({
    mutationFn: async ({ code, testCases }: SubmitCodeArgs) => {
      const submission = await submitCode(code, testCases)
      if (!submission) {
        throw new Error('Submission failed')
      }

      const testResults = await Promise.all(
        testCases.map(async (tc, index) => {
          const testCode = `${code.content}\n${tc.input.content}`
          const result = await compileCode(testCode, code.language)

          let cleanOutput = result.success ? result.output : result.error || 'No output'
          cleanOutput = cleanOutput.replace(new RegExp(`^${tc.input.content}[\n\r]*`), '').trim()

          return {
            success: index < submission.testsPassed,
            input: tc.input.content,
            expectedOutput: tc.expectedOutput.content,
            actualOutput: cleanOutput,
          }
        }),
      )

      return { submission, testResults }
    },
  })

  return {
    submitCode: submitCodeMutation,
    isLoadingSubmit,
    submissionResult: submissionResult?.submission,
    testResults: submissionResult?.testResults,
    submissionError,
  }
}
