import { Sandbox } from '@e2b/code-interpreter'
import type { Execution } from '@e2b/code-interpreter'

// Define the types for compilation and test results.
// These are adapted from existing types in the project.
export type CompilationResult = {
  success: boolean
  output: string
  error?: string
}

export type E2BTestResult = {
  success: boolean
  input: string
  expectedOutput: string
  actualOutput: string
}

// Check for E2B API Key
const E2B_API_KEY = process.env.E2B_API_KEY

if (!E2B_API_KEY) {
  console.error('E2B_API_KEY is not set. Please set it in your environment variables.')
}

/**
 * Executes user code in an E2B sandbox and returns the compilation/test results.
 * This function handles the full lifecycle: creating a sandbox, executing code,
 * capturing output, and killing the sandbox.
 * @param code The user's code to execute.
 * @param language The programming language of the code. Currently, only 'python' is supported by this implementation.
 * @param testCases An array of test cases, each with an input expression to be evaluated and its expected output.
 * @returns A promise that resolves to an object containing success status, output, and detailed test results.
 */
export async function executeCodeInE2B(
  code: string,
  language: string,
  testCases: Array<{ input: string; expectedOutput: string }>,
): Promise<{ compilationResult: CompilationResult; testResults: E2BTestResult[] }> {
  if (!E2B_API_KEY) {
    return {
      compilationResult: { success: false, output: '', error: 'E2B service not configured.' },
      testResults: [],
    }
  }

  if (language !== 'python') {
    return {
      compilationResult: {
        success: false,
        output: '',
        error: `Language '${language}' is not supported in this version. Only 'python' is available.`,
      },
      testResults: [],
    }
  }

  let sandbox: Sandbox | undefined
  const testResults: E2BTestResult[] = []
  let overallSuccess = true
  let finalError = ''

  try {
    // Create a new sandbox instance for the execution session.
    // The 'code-interpreter' template is specifically designed for running code snippets.
    sandbox = await Sandbox.create({ apiKey: E2B_API_KEY })

    // If there are no test cases, just run the code once.
    if (testCases.length === 0) {
      const execution = await sandbox.runCode(code)
      const output = execution.logs.stdout.join('\n')
      const error = execution.logs.stderr.join('\n')

      return {
        compilationResult: {
          success: !error,
          output: output,
          error: error,
        },
        testResults: [],
      }
    }

    for (const testCase of testCases) {
      const codeToRun = `${code}\n\n${testCase.input}`

      const execution: Execution = await sandbox.runCode(codeToRun)

      const actualOutput = execution.logs.stdout.join('\n').trim()
      const errorOutput = execution.logs.stderr.join('\n').trim()

      const success = !errorOutput && actualOutput === testCase.expectedOutput

      testResults.push({
        success,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: errorOutput || actualOutput,
      })

      if (!success) {
        overallSuccess = false
        if (errorOutput && !finalError) {
          finalError = errorOutput
        }
      }
    }
  } catch (error: any) {
    console.error('Error during E2B sandbox execution:', error)
    overallSuccess = false
    finalError = error.message || 'An unknown error occurred during code execution.'
  } finally {
    if (sandbox) {
      // Kill the sandbox after execution to free up resources immediately.
      // For this simple, non-pooling version, killing is more straightforward than pausing.
      await sandbox.kill()
    }
  }

  return {
    compilationResult: {
      success: overallSuccess,
      // For now, output and error are aggregated at the test level.
      // This can be refined to provide a general execution output if needed.
      output: '',
      error: finalError,
    },
    testResults: testResults,
  }
}
