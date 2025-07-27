'use client'

import { useMutation } from '@tanstack/react-query'
import { compileCode, compileFileStructure } from '../index'
import { SupportedLanguage } from '../challenge-editor/store'
import { FileStructureForExecution } from '../utils/file-structure'

type RunCodeInput =
  | { type: 'single'; code: string; language: SupportedLanguage }
  | { type: 'structure'; fileStructure: FileStructureForExecution }

export const useRunCode = () => {
  const {
    mutateAsync: runCode,
    isPending: isLoadingRun,
    error,
    data: executionOutput,
  } = useMutation({
    mutationFn: async (input: RunCodeInput) => {
      let result

      if (input.type === 'single') {
        result = await compileCode(input.code, input.language)
      } else {
        result = await compileFileStructure(input.fileStructure)
      }

      if (!result.success) {
        return result.error
      }
      return result.output
    },
  })

  // Legacy function for backward compatibility
  const runSingleCode = async (code: string, language: SupportedLanguage) => {
    return runCode({ type: 'single', code, language })
  }

  // New function for file structure execution
  const runFileStructure = async (fileStructure: FileStructureForExecution) => {
    return runCode({ type: 'structure', fileStructure })
  }

  return {
    isLoadingRun,
    executionOutput,
    runCode,
    runSingleCode,
    runFileStructure,
    error,
  }
}
