import { CompilationResult, compileCode, compileFileStructure } from '@/core/compiler'
import { FileStructureForExecution } from '@/core/compiler/utils/file-structure'

/**
 * Base type for any code submission.
 */
export type Submission = {
  testsPassed: number
  testsTotal: number
  code: {
    language: string
    content: string
  }
}

/**
 * Represents a submission that resulted in a runtime error.
 */
export type RunTimeErrorSubmission = Submission & {
  type: 'runtimeError'
  error: string
  lastExpectedOutput: { output: string }[]
}

/**
 * Represents a submission that passed some tests but failed due to a wrong answer.
 */
export type WrongAnswerSubmission = Submission & {
  type: 'wrongAnswer'
  input: string
  output: string
  expectedOutput: string
}

/**
 * Represents a submission that exceeded the allocated time limit.
 */
export type TimeLimitExceededSubmission = Submission & {
  type: 'timeLimitExceeded'
  lastExpectedOutput: { output: string }[]
}

/**
 * Represents a submission that passed all tests.
 */
export type AcceptedSubmission = Submission & {
  type: 'accepted'
}

/**
 * Supported programming languages.
 */
type Language = 'python' | 'javascript' | 'typescript'

/**
 * Represents a piece of code submitted for compilation or testing.
 * Can be either a simple code string or a complete file structure.
 */
type CodeSubmission = 
  | {
      type: 'single'
      content: string
      language: Language
    }
  | {
      type: 'structure'
      fileStructure: FileStructureForExecution
    }

/**
 * Defines a single test case with input and expected output.
 */
type Test = {
  input: CodeSubmission
  expectedOutput: CodeSubmission
}

/**
 * Details of a failed test case, used internally by `runAllTests`.
 */
type TestResultErrorDetails = {
  input: string
  expectedOutput: string
  actualOutput?: string
  error?: string
  type: 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'
}

/**
 * Creates the base submission object that is common to all submission types.
 * 
 * @param code - The submitted code (either single code or file structure)
 * @param testsTotal - The total number of tests in the challenge
 * @returns The base submission object
 */
const createBaseSubmission = (
  code: CodeSubmission,
  testsTotal: number,
): Submission => {
  // Extract the main code for the submission record
  const submissionCode = code.type === 'single' 
    ? { content: code.content, language: code.language }
    : { 
        content: code.fileStructure.mainFile?.content || '', 
        language: code.fileStructure.mainFile?.language || 'python' 
      }
  
  return {
    testsPassed: 0,
    testsTotal,
    code: submissionCode,
  }
}

/**
 * Time limit for code execution in milliseconds (5 seconds).
 */
const TIME_LIMIT = 5000

/**
 * Creates a promise that rejects after the time limit, used to enforce execution time constraints.
 * 
 * @returns A promise that rejects with 'Time Limit Exceeded' error
 */
const createTimeoutPromise = (): Promise<never> =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Time Limit Exceeded'))
    }, TIME_LIMIT)
  })

/**
 * Prepares code for execution by combining input with the main code.
 * For file structures, the input is added to the main file.
 * 
 * @param code - The code submission (single or file structure)
 * @param input - The input to be provided to the code
 * @returns Either the combined code string or modified file structure
 */
const prepareCodeWithInput = (
  code: CodeSubmission, 
  input: string
): CodeSubmission => {
  if (code.type === 'single') {
    return {
      ...code,
      content: `${code.content}\n${input}`
    }
  } else {
    // For file structures, add input to the main file
    const modifiedFileStructure = {
      ...code.fileStructure,
      files: code.fileStructure.files.map(file => 
        file === code.fileStructure.mainFile 
          ? { ...file, content: `${file.content}\n${input}` }
          : file
      ),
      mainFile: code.fileStructure.mainFile 
        ? { 
            ...code.fileStructure.mainFile, 
            content: `${code.fileStructure.mainFile.content}\n${input}` 
          }
        : null
    }
    
    return {
      ...code,
      fileStructure: modifiedFileStructure
    }
  }
}

/**
 * Compares the actual output with the expected output.
 * 
 * @param output - The actual output from code execution
 * @param expectedOutput - The expected output defined in the test case
 * @returns True if outputs match (after trimming), false otherwise
 */
const compareOutputs = (output: string, expectedOutput: string): boolean =>
  output.trim() === expectedOutput.trim()

/**
 * Runs all tests for a given code submission and returns the number of passed tests 
 * and details of the first failed test if any.
 * 
 * @param code - The code submission to test
 * @param tests - Array of test cases to run
 * @returns Object containing the number of passed tests and optional details of the first failure
 */
const runAllTests = async (
  code: CodeSubmission,
  tests: Test[],
): Promise<{ passed: number; failedTest?: TestResultErrorDetails }> => {
  let testsPassed = 0

  for (const test of tests) {
    const codeWithInput = prepareCodeWithInput(code, test.input.content)
    try {
      let result: CompilationResult
      
      // Use appropriate compilation method based on code type
      if (codeWithInput.type === 'single') {
        result = (await Promise.race([
          compileCode(codeWithInput.content, codeWithInput.language),
          createTimeoutPromise(),
        ])) as CompilationResult
      } else {
        result = (await Promise.race([
          compileFileStructure(codeWithInput.fileStructure),
          createTimeoutPromise(),
        ])) as CompilationResult
      }

      if (!result.success) {
        return {
          passed: testsPassed,
          failedTest: {
            type: 'runtimeError',
            input: test.input.content,
            expectedOutput: test.expectedOutput.content,
            error: result.error || 'Runtime Error',
          },
        }
      }

      if (!compareOutputs(result.output, test.expectedOutput.content)) {
        return {
          passed: testsPassed,
          failedTest: {
            type: 'wrongAnswer',
            input: test.input.content,
            expectedOutput: test.expectedOutput.content,
            actualOutput: result.output.trim(),
          },
        }
      }

      testsPassed++
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Time Limit Exceeded') {
        return {
          passed: testsPassed,
          failedTest: {
            type: 'timeLimitExceeded',
            input: test.input.content,
            expectedOutput: test.expectedOutput.content,
          },
        }
      }
      return {
        passed: testsPassed,
        failedTest: {
          type: 'runtimeError',
          input: test.input.content,
          expectedOutput: test.expectedOutput.content,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }
  return { passed: testsPassed }
}

/**
 * Helper function to create a single code submission from legacy parameters.
 * This maintains backward compatibility with existing code.
 * 
 * @param content - The code content
 * @param language - The programming language
 * @returns A CodeSubmission object
 */
const createSingleCodeSubmission = (
  content: string, 
  language: Language
): CodeSubmission => ({
  type: 'single',
  content,
  language
})

/**
 * Helper function to create a file structure submission.
 * 
 * @param fileStructure - The file structure for execution
 * @returns A CodeSubmission object
 */
export const createFileStructureSubmission = (
  fileStructure: FileStructureForExecution
): CodeSubmission => ({
  type: 'structure',
  fileStructure
})

/**
 * Submits code for evaluation against a set of test cases.
 * 
 * @param code - The code submission to evaluate (can be single code or file structure)
 * @param tests - Array of test cases to run against the code
 * @returns A submission result object indicating success or failure with details
 */
export const submitCode = async (
  code: CodeSubmission | { content: string; language: Language },
  tests: Test[],
): Promise<
  AcceptedSubmission | RunTimeErrorSubmission | WrongAnswerSubmission | TimeLimitExceededSubmission
> => {
  // Handle legacy API: if code has content and language properties, convert to new format
  const codeSubmission: CodeSubmission = 'type' in code 
    ? code 
    : createSingleCodeSubmission(code.content, code.language as Language)
  const baseSubmission = createBaseSubmission(code, tests.length)
  const { passed, failedTest } = await runAllTests(code, tests)

  if (failedTest) {
    if (failedTest.type === 'runtimeError') {
      return {
        ...baseSubmission,
        testsPassed: passed,
        type: 'runtimeError',
        error: failedTest.error || 'Unknown error',
        lastExpectedOutput: [{ output: failedTest.expectedOutput }],
      }
    } else if (failedTest.type === 'wrongAnswer') {
      return {
        ...baseSubmission,
        testsPassed: passed,
        type: 'wrongAnswer',
        input: failedTest.input,
        output: failedTest.actualOutput || '',
        expectedOutput: failedTest.expectedOutput,
      }
    } else if (failedTest.type === 'timeLimitExceeded') {
      return {
        ...baseSubmission,
        testsPassed: passed,
        type: 'timeLimitExceeded',
        lastExpectedOutput: [{ output: failedTest.expectedOutput }],
      }
    }
  }

  return {
    ...baseSubmission,
    testsPassed: passed,
    type: 'accepted',
  } as AcceptedSubmission
}
