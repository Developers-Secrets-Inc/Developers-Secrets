import { CompilationResult, compileCode, testCode } from '@/core/compiler'

type Submission = {
  testsPassed: number
  testsTotal: number
  code: {
    language: string
    content: string
  }
}

type RunTimeErrorSubmission = Submission & {
  type: 'runtimeError'
  error: string
  lastExpectedOutput: { output: string }[]
}

type WrongAnswerSubmission = Submission & {
  type: 'wrongAnswer'
  input: string
  output: string
  expectedOutput: string
}

type TimeLimitExceededSubmission = Submission & {
  type: 'timeLimitExceeded'
  lastExpectedOutput: { output: string }[]
}

type AcceptedSubmission = Submission & {
  type: 'accepted'
}

type Language = 'python' | 'javascript' | 'typescript'

type CodeSubmission = {
  content: string
  language: Language
}

type Test = {
  input: CodeSubmission
  expectedOutput: CodeSubmission
}

const createBaseSubmission = (
  code: { content: string; language: string },
  testsTotal: number,
): Submission => ({
  testsPassed: 0,
  testsTotal,
  code,
})

const TIME_LIMIT = 5000 // 5 seconds time limit

const createTimeoutPromise = (): Promise<never> =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Time Limit Exceeded'))
    }, TIME_LIMIT)
  })

const prepareCodeWithInput = (code: string, input: string): string => `${input}\n${code}`

const compareOutputs = (output: string, expectedOutput: string): boolean =>
  output.trim() === expectedOutput.trim()

const handleCompilationError = (
  baseSubmission: Submission,
  error: string,
  expectedOutput: string,
): RunTimeErrorSubmission => ({
  ...baseSubmission,
  type: 'runtimeError',
  error,
  lastExpectedOutput: [{ output: expectedOutput }],
})

const handleWrongAnswer = (
  baseSubmission: Submission,
  input: string,
  output: string,
  expectedOutput: string,
): WrongAnswerSubmission => ({
  ...baseSubmission,
  type: 'wrongAnswer',
  input,
  output,
  expectedOutput,
})

const handleTimeLimitExceeded = (
  baseSubmission: Submission,
  expectedOutput: string,
): TimeLimitExceededSubmission => ({
  ...baseSubmission,
  type: 'timeLimitExceeded',
  lastExpectedOutput: [{ output: expectedOutput }],
})

const handleRuntimeError = (
  baseSubmission: Submission,
  error: unknown,
  expectedOutput: string,
): RunTimeErrorSubmission => ({
  ...baseSubmission,
  type: 'runtimeError',
  error: error instanceof Error ? error.message : 'Unknown error',
  lastExpectedOutput: [{ output: expectedOutput }],
})

const executeTest = async (
  code: CodeSubmission,
  test: Test,
  baseSubmission: Submission,
): Promise<WrongAnswerSubmission | RunTimeErrorSubmission | TimeLimitExceededSubmission | null> => {
  const codeWithInput = prepareCodeWithInput(code.content, test.input.content)

  try {
    const result = (await Promise.race([
      compileCode(codeWithInput, code.language),
      createTimeoutPromise(),
    ])) as CompilationResult

    if (!result.success) {
      return handleCompilationError(
        baseSubmission,
        result.error || 'Runtime Error',
        test.expectedOutput.content,
      )
    }

    if (!compareOutputs(result.output, test.expectedOutput.content)) {
      return handleWrongAnswer(
        baseSubmission,
        test.input.content,
        result.output.trim(),
        test.expectedOutput.content,
      )
    }

    return null // Test passed
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Time Limit Exceeded') {
      return handleTimeLimitExceeded(baseSubmission, test.expectedOutput.content)
    }
    return handleRuntimeError(baseSubmission, error, test.expectedOutput.content)
  }
}

export const submitCode = async (
  code: CodeSubmission,
  tests: Test[],
): Promise<
  AcceptedSubmission | RunTimeErrorSubmission | WrongAnswerSubmission | TimeLimitExceededSubmission
> => {
  const baseSubmission = createBaseSubmission(code, tests.length)
  let testsPassed = 0

  for (const test of tests) {
    try {
      const testResult = await executeTest(code, test, baseSubmission)

      // If we got a test result (error case), return it immediately
      if (testResult) {
        return {
          ...testResult,
          testsPassed,
        }
      }

      // Test passed successfully
      testsPassed++
    } catch (error: unknown) {
      // Handle any unexpected errors during test execution
      return handleRuntimeError(
        { ...baseSubmission, testsPassed },
        error,
        test.expectedOutput.content,
      )
    }
  }

  // If we've made it here, all tests have passed
  return {
    ...baseSubmission,
    testsPassed,
    type: 'accepted',
  } as AcceptedSubmission
}
