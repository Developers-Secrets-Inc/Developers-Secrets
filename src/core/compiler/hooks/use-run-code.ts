'use client'

import { useMutation } from '@tanstack/react-query'
import { compileCode } from '../index'
import { SupportedLanguage } from '../challenge-editor/store'

export const useRunCode = () => {
  const {
    mutateAsync: runCode,
    isPending: isLoadingRun,
    error,
    data: executionOutput,
  } = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: SupportedLanguage }) => {
      const result = await compileCode(code, language)
      if (!result.success) {
        return result.error
      }
      return result.output
    },
  })

  return {
    isLoadingRun,
    executionOutput,
    runCode,
    error,
  }
}
