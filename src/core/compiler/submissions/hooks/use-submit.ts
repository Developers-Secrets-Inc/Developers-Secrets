'use client'

import { useMutation } from '@tanstack/react-query'
import { submitCode } from '..'
import { compileCode, compileFileStructure } from '@/core/compiler'
import { FileStructureForExecution } from '@/core/compiler/utils/file-structure'

// Import Language type from the submissions module
type Language = 'python' | 'javascript' | 'typescript'

type SubmitCodeInput =
  | { type: 'single'; code: string; language: Language }
  | { type: 'structure'; fileStructure: FileStructureForExecution }

interface SubmitCodeArgs {
  code: SubmitCodeInput
  testCases: {
    input: SubmitCodeInput
    expectedOutput: SubmitCodeInput
  }[]
}

// Helper functions
const executeCodeWithInput = async (codeInput: SubmitCodeInput, testInput?: SubmitCodeInput) => {
  if (codeInput.type === 'single') {
    const inputContent = testInput?.type === 'single' ? testInput.code : ''
    const combinedCode = `${codeInput.code}\n${inputContent}`
    return await compileCode(combinedCode, codeInput.language)
  } else {
    const modifiedStructure = testInput
      ? mergeInputIntoFileStructure(codeInput.fileStructure, testInput)
      : codeInput.fileStructure
    return await compileFileStructure(modifiedStructure)
  }
}

const mergeInputIntoFileStructure = (
  structure: FileStructureForExecution,
  input: SubmitCodeInput,
): FileStructureForExecution => {
  if (input.type === 'single') {
    // Add input to main file
    const modifiedFiles = structure.files.map((file) =>
      file === structure.mainFile ? { ...file, content: `${file.content}\n${input.code}` } : file,
    )

    const modifiedMainFile = structure.mainFile
      ? { ...structure.mainFile, content: `${structure.mainFile.content}\n${input.code}` }
      : null

    return {
      ...structure,
      files: modifiedFiles,
      mainFile: modifiedMainFile,
    }
  }
  // For structure input, merge files (implementation depends on requirements)
  return structure
}

const extractInputContent = (input: SubmitCodeInput): string => {
  return input.type === 'single' ? input.code : input.fileStructure.mainFile?.content || ''
}

const createSingleSubmission = (code: string, language: Language): SubmitCodeInput => ({
  type: 'single',
  code,
  language,
})

const createStructureSubmission = (fileStructure: FileStructureForExecution): SubmitCodeInput => ({
  type: 'structure',
  fileStructure,
})

export const useSubmit = () => {
  const {
    mutateAsync: submitCodeMutation,
    isPending: isLoading,
    data: submissionResult,
    error: submissionError,
  } = useMutation({
    mutationFn: async ({ code, testCases }: SubmitCodeArgs) => {
      // Convert to legacy format for submitCode function
      const legacyCode =
        code.type === 'single'
          ? { content: code.code, language: code.language }
          : { content: code.fileStructure.mainFile?.content || '', language: 'python' as Language }

      const legacyTestCases = testCases.map((tc) => ({
        input: {
          content: extractInputContent(tc.input),
          language: tc.input.type === 'single' ? tc.input.language : ('python' as Language),
        },
        expectedOutput: {
          content: extractInputContent(tc.expectedOutput),
          language:
            tc.expectedOutput.type === 'single'
              ? tc.expectedOutput.language
              : ('python' as Language),
        },
      }))

      const submission = await submitCode(legacyCode, legacyTestCases)
      if (!submission) {
        throw new Error('Submission failed')
      }

      const testResults = await Promise.all(
        testCases.map(async (tc, index) => {
          const result = await executeCodeWithInput(code, tc.input)

          let cleanOutput = result.success ? result.output : result.error || 'No output'

          // Clean output based on input type
          if (tc.input.type === 'single') {
            cleanOutput = cleanOutput.replace(new RegExp(`^${tc.input.code}[\n\r]*`), '').trim()
          }

          return {
            success: index < submission.testsPassed,
            input: extractInputContent(tc.input),
            expectedOutput: extractInputContent(tc.expectedOutput),
            actualOutput: cleanOutput,
          }
        }),
      )

      return { submission, testResults }
    },
  })

  return {
    // Main unified function
    submit: submitCodeMutation,

    // Helper functions for creating inputs
    createSingleSubmission,
    createStructureSubmission,

    // States and results
    isLoading,
    submissionResult: submissionResult?.submission,
    testResults: submissionResult?.testResults,
    submissionError,
  }
}
