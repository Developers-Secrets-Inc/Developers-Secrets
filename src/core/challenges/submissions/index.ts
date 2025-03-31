'use server'

import { compileCode, CompilationResult } from '../../compiler'
import { getPayload } from 'payload'
import config from '@payload-config'

type Submission = {
  testsPassed: number
  testsTotal: number
  code: {
    language: string
    content: string
  }
}

type RunTimeErrorSubmission = Submission & {
  error: string
  lastExpectedOutput: { output: string }[]
}

type WrongAnswerSubmission = Submission & {
  input: string
  output: string
  expectedOutput: string
}

type TimeLimitExceededSubmission = Submission & {
  lastExpectedOutput: { output: string }[]
}

type AcceptedSubmission = Submission

const TIME_LIMIT = 5000 // 5 seconds time limit

const createBaseSubmission = (
  code: { content: string; language: string },
  testsTotal: number,
): Submission => ({
  testsPassed: 0,
  testsTotal,
  code,
})

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
  input,
  output,
  expectedOutput,
})

const handleTimeLimitExceeded = (
  baseSubmission: Submission,
  expectedOutput: string,
): TimeLimitExceededSubmission => ({
  ...baseSubmission,
  lastExpectedOutput: [{ output: expectedOutput }],
})

const handleRuntimeError = (
  baseSubmission: Submission,
  error: unknown,
  expectedOutput: string,
): RunTimeErrorSubmission => ({
  ...baseSubmission,
  error: error instanceof Error ? error.message : 'Unknown error',
  lastExpectedOutput: [{ output: expectedOutput }],
})

const createSubmissionInDatabase = async (
  submission:
    | AcceptedSubmission
    | RunTimeErrorSubmission
    | WrongAnswerSubmission
    | TimeLimitExceededSubmission,
  challengeId: number,
  authorId: string,
) => {
  const payload = await getPayload({ config })

  let submissionType: 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'
  const submissionData: {
    challenge: number
    authorId: string
    testsPassed: number
    testsTotal: number
    code: { language: string; content: string }
    submissionType: 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'
    error?: string
    lastExpectedOutput?: { output: string }[]
    input?: string
    output?: string
    expectedOutput?: string
  } = {
    challenge: challengeId,
    authorId,
    testsPassed: submission.testsPassed,
    testsTotal: submission.testsTotal,
    code: submission.code,
    submissionType: 'accepted', // Set a default value that will be updated below
  }

  // Determine submission type and add specific fields
  if ('error' in submission) {
    submissionType = 'runtimeError'
    submissionData.error = submission.error
    submissionData.lastExpectedOutput = submission.lastExpectedOutput
  } else if ('input' in submission) {
    submissionType = 'wrongAnswer'
    submissionData.input = submission.input
    submissionData.output = submission.output
    submissionData.expectedOutput = submission.expectedOutput
  } else if ('lastExpectedOutput' in submission) {
    submissionType = 'timeLimitExceeded'
    submissionData.lastExpectedOutput = submission.lastExpectedOutput
  } else {
    submissionType = 'accepted'
  }

  submissionData.submissionType = submissionType

  // Create submission in database
  await payload.create({
    collection: 'challenge-submissions',
    data: submissionData,
  })
}

async function executeTest(
  code: { content: string; language: string },
  test: { input: string; expectedOutput: string },
  baseSubmission: Submission,
): Promise<WrongAnswerSubmission | RunTimeErrorSubmission | TimeLimitExceededSubmission | null> {
  const codeWithInput = prepareCodeWithInput(code.content, test.input)

  try {
    const result = (await Promise.race([
      compileCode(codeWithInput, code.language),
      createTimeoutPromise(),
    ])) as CompilationResult

    if (!result.success) {
      return handleCompilationError(
        baseSubmission,
        result.error || 'Runtime Error',
        test.expectedOutput,
      )
    }

    if (!compareOutputs(result.output, test.expectedOutput)) {
      return handleWrongAnswer(
        baseSubmission,
        test.input,
        result.output.trim(),
        test.expectedOutput.trim(),
      )
    }

    return null // Test passed
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Time Limit Exceeded') {
      return handleTimeLimitExceeded(baseSubmission, test.expectedOutput)
    }
    return handleRuntimeError(baseSubmission, error, test.expectedOutput)
  }
}

export const submitCode = async (
  code: {
    content: string
    language: string
  },
  tests: {
    input: string
    expectedOutput: string
  }[],
  challengeId: string | number,
  authorId: string,
): Promise<
  AcceptedSubmission | RunTimeErrorSubmission | WrongAnswerSubmission | TimeLimitExceededSubmission
> => {
  const baseSubmission = createBaseSubmission(code, tests.length)
  let testsPassed = 0

  try {
    for (const test of tests) {
      const testResult = await executeTest(code, test, baseSubmission)

      if (testResult) {
        // Convert challengeId to number if it's a string
        const numericChallengeId =
          typeof challengeId === 'string' ? parseInt(challengeId, 10) : challengeId
        await createSubmissionInDatabase(testResult, numericChallengeId, authorId)
        return testResult
      }

      testsPassed++
    }

    // All tests passed
    const acceptedSubmission = {
      ...baseSubmission,
      testsPassed,
    } as AcceptedSubmission

    // Convert challengeId to number if it's a string
    const numericChallengeId =
      typeof challengeId === 'string' ? parseInt(challengeId, 10) : challengeId
    await createSubmissionInDatabase(acceptedSubmission, numericChallengeId, authorId)
    return acceptedSubmission
  } catch (error: unknown) {
    const errorSubmission = handleRuntimeError(
      baseSubmission,
      error,
      tests[testsPassed]?.expectedOutput || '',
    )
    // Convert challengeId to number if it's a string
    const numericChallengeId =
      typeof challengeId === 'string' ? parseInt(challengeId, 10) : challengeId
    await createSubmissionInDatabase(errorSubmission, numericChallengeId, authorId)
    return errorSubmission
  }
}
