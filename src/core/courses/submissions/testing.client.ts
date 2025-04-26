'use client'

import { CompilationResult, compileCode } from '@/core/compiler'

// --- Types for Course Test Execution ---

// Basic code structure (mirroring challenge submission)
type Language = 'python' | 'javascript' | 'typescript' // Assuming same supported languages
type CodeSubmission = {
  content: string
  language: Language
}

// Basic test case structure for courses
type CoursePartTest = {
  input: string
  expectedOutput: string
}

// Base structure for all test results
type CoursePartTestRunBase = {
  testsPassed: number
  testsTotal: number
  code: CodeSubmission
}

// Specific result types
export type CoursePartTestPassed = CoursePartTestRunBase & {
  type: 'passed'
}

export type CoursePartRuntimeError = CoursePartTestRunBase & {
  type: 'runtimeError'
  error: string
  failedTestInput: string // Input that caused the error
  failedTestExpectedOutput: string // Expected output for the failing test
}

export type CoursePartWrongAnswer = CoursePartTestRunBase & {
  type: 'wrongAnswer'
  input: string
  output: string
  expectedOutput: string
}

export type CoursePartTimeLimitExceeded = CoursePartTestRunBase & {
  type: 'timeLimitExceeded'
  failedTestInput: string // Input that timed out
  failedTestExpectedOutput: string // Expected output for the timed-out test
}

// Union type for all possible results
export type CoursePartTestResult =
  | CoursePartTestPassed
  | CoursePartRuntimeError
  | CoursePartWrongAnswer
  | CoursePartTimeLimitExceeded

// --- Test Execution Logic ---

const TIME_LIMIT = 5000 // 5 seconds time limit, same as challenges for now

const createTimeoutPromise = (): Promise<never> =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Time Limit Exceeded'))
    }, TIME_LIMIT)
  })

// Helper to merge code and input for execution
const prepareCodeWithInput = (code: string, input: string): string => `${code}\n${input}`

// Helper for output comparison
const compareOutputs = (output: string, expectedOutput: string): boolean =>
  output.trim() === expectedOutput.trim()

/**
 * Runs the user's code against the test cases for a course part.
 * Adapted from challenge submission logic. Does NOT save results.
 * @param code The user's code submission.
 * @param tests An array of test cases for the course part.
 * @returns A promise resolving to a CoursePartTestResult object.
 */
export const runCoursePartTests = async (
  code: CodeSubmission,
  tests: CoursePartTest[],
): Promise<CoursePartTestResult> => {
  const baseResult: CoursePartTestRunBase = {
    testsPassed: 0,
    testsTotal: tests.length,
    code,
  }

  for (const test of tests) {
    const codeWithInput = prepareCodeWithInput(code.content, test.input)

    try {
      const result = (await Promise.race([
        compileCode(codeWithInput, code.language),
        createTimeoutPromise(),
      ])) as CompilationResult // Cast result after race

      if (!result.success) {
        // Handle Runtime Error during compilation/execution
        return {
          ...baseResult,
          type: 'runtimeError',
          error: result.error || 'Unknown runtime error',
          failedTestInput: test.input,
          failedTestExpectedOutput: test.expectedOutput,
        }
      }

      if (!compareOutputs(result.output, test.expectedOutput)) {
        // Handle Wrong Answer
        return {
          ...baseResult,
          type: 'wrongAnswer',
          input: test.input,
          output: result.output.trim(), // Send trimmed output
          expectedOutput: test.expectedOutput,
        }
      }

      // Test passed, increment counter
      baseResult.testsPassed++
    } catch (error: unknown) {
      // Handle Time Limit Exceeded or other unexpected errors from Promise.race
      if (error instanceof Error && error.message === 'Time Limit Exceeded') {
        return {
          ...baseResult,
          type: 'timeLimitExceeded',
          failedTestInput: test.input,
          failedTestExpectedOutput: test.expectedOutput,
        }
      }
      // Handle other unexpected errors
      return {
        ...baseResult,
        type: 'runtimeError', // Treat other errors as runtime errors
        error: error instanceof Error ? error.message : 'Unknown error during test execution',
        failedTestInput: test.input,
        failedTestExpectedOutput: test.expectedOutput,
      }
    }
  }

  // If loop completes, all tests passed
  return {
    ...baseResult,
    type: 'passed',
  }
}
