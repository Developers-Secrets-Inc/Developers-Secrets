'use client'

import { useCodePrecheck } from './use-code-precheck'
import { SupportedLanguage } from '../challenge-editor/store'
import { useState, useCallback } from 'react'

/**
 * A refactored hook to handle client-side code execution for the "Run" button.
 * It now uses the `useCodePrecheck` hook, which leverages a Web Worker for
 * non-blocking, optimized execution (especially for Python with Pyodide).
 */
export const useRunCode = () => {
  const { isChecking: isLoadingRun, error: precheckError, executePreCheck } = useCodePrecheck()

  const [executionOutput, setExecutionOutput] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const runCode = useCallback(
    async ({ code, language }: { code: string; language: SupportedLanguage }) => {
      setExecutionOutput(undefined)
      setError(null)

      try {
        const result = await executePreCheck(code, language)
        if (result.success) {
          setExecutionOutput(result.output)
        } else {
          setError(result.error || 'An unknown error occurred.')
        }
      } catch (e: any) {
        setError(e.message || 'An execution error occurred.')
      }
    },
    [executePreCheck],
  )

  return {
    isLoadingRun,
    executionOutput,
    runCode,
    error: error || precheckError, // Combine errors from both hooks
  }
}
