import { toast } from 'sonner'

// Types
export type CompilationResult = {
  success: boolean
  output: string
  error?: string
}

// Check if we're in a browser environment before using workers
export const isBrowser = typeof window !== 'undefined'

// Helper function to check if Pyodide is loaded
export const isPyodideLoaded = (): boolean => {
  if (!isBrowser) return false
  return !!(window as any).isPyodideLoaded && !!(window as any).pyodide
}

// Helper function to check if Pyodide is currently loading
export const isPyodideLoading = (): boolean => {
  if (!isBrowser) return false
  return !!(window as any).isPyodideLoading
}

// Helper function to get any Pyodide load error
export const getPyodideLoadError = (): string | null => {
  if (!isBrowser) return null
  return (window as any).pyodideLoadError || null
}

// JavaScript Worker
const createJavaScriptWorker = (code: string): Promise<CompilationResult> => {
  if (!isBrowser) {
    return Promise.resolve({
      success: false,
      output: '',
      error: 'JavaScript execution is only available in the browser',
    })
  }

  return new Promise((resolve) => {
    // Create a new worker from the external file, specifying it's a module
    const worker = new Worker(new URL('./workers/eval-worker.mjs', import.meta.url), {
      type: 'module',
    })

    // Handle messages from the worker
    worker.onmessage = (e) => {
      worker.terminate()
      resolve(e.data)
    }

    // Handle errors
    worker.onerror = (e) => {
      worker.terminate()
      resolve({
        success: false,
        output: '',
        error: e.message,
      })
    }

    // Send the code to the worker
    worker.postMessage(code)
  })
}

// TypeScript Worker
const createTypeScriptWorker = (code: string): Promise<CompilationResult> => {
  if (!isBrowser) {
    return Promise.resolve({
      success: false,
      output: '',
      error: 'TypeScript execution is only available in the browser',
    })
  }

  return new Promise((resolve) => {
    // Create a new worker from the external file, specifying it's a module
    const worker = new Worker(new URL('./workers/eval-worker.mjs', import.meta.url), {
      type: 'module',
    })

    worker.onmessage = (e) => {
      worker.terminate()
      resolve(e.data)
    }

    worker.onerror = (e) => {
      worker.terminate()
      resolve({
        success: false,
        output: '',
        error: e.message,
      })
    }

    worker.postMessage(code)
  })
}

// Python compilation using Pyodide
const compilePython = async (code: string): Promise<CompilationResult> => {
  if (!isBrowser) {
    return {
      success: false,
      output: '',
      error: 'Python execution is only available in the browser',
    }
  }

  try {
    if (isPyodideLoading()) {
      return {
        success: false,
        output: '',
        error: 'Python interpreter (Pyodide) is still loading. Please wait a moment and try again.',
      }
    }

    const loadError = getPyodideLoadError()
    if (loadError) {
      return {
        success: false,
        output: '',
        error: `Python interpreter (Pyodide) failed to load: ${loadError}. Please refresh the page.`,
      }
    }

    const pyodide = (window as any).pyodide
    if (!pyodide) {
      return {
        success: false,
        output: '',
        error:
          'Python interpreter (Pyodide) is not initialized yet. Please wait a moment and try again.',
      }
    }

    // Redirect stdout to capture print statements
    await pyodide.runPythonAsync(`
      import sys
      import io
      sys.stdout = io.StringIO()
    `)

    // Run the Python code
    await pyodide.runPythonAsync(code)

    // Get the captured stdout
    let output: string = await pyodide.runPythonAsync(`sys.stdout.getvalue()`)
    output = output.trim()

    // Reset stdout
    await pyodide.runPythonAsync(`sys.stdout = sys.__stdout__`)

    return {
      success: true,
      output,
    }
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes('PythonError:')) {
      const errorLines = errorMessage.split('\n')
      const pythonErrorLine = errorLines.find(
        (line) => line.includes('PythonError:') && !line.includes('Traceback'),
      )
      if (pythonErrorLine) {
        errorMessage = pythonErrorLine.replace('PythonError:', '').trim()
      }
    }

    return {
      success: false,
      output: '',
      error: errorMessage,
    }
  }
}

export async function compileCode(code: string, language: string): Promise<CompilationResult> {
  if (!isBrowser) {
    return {
      success: false,
      output: '',
      error: 'Code compilation is only available in the browser',
    }
  }

  try {
    switch (language) {
      case 'python':
        return await compilePython(code)
      case 'javascript':
        return await createJavaScriptWorker(code)
      case 'typescript':
        return await createTypeScriptWorker(code)
      default:
        return {
          success: false,
          output: '',
          error: `Unsupported language: ${language}`,
        }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    toast.error(`Compilation error: ${errorMessage}`)
    return {
      success: false,
      output: '',
      error: errorMessage,
    }
  }
}

type Language = 'python' | 'javascript' | 'typescript'

type Code = {
  content: string
  language: Language
}

type Test = {
  input: Code
  expectedOutput: Code
}

type TestResult = {
  success: boolean
  output: string
}

const mergeCode = (first: Code, second: Code): Code => {
  return {
    content: `${first.content}\n${second.content}`,
    language: first.language,
  }
}

export const testCode = async (code: Code, tests: Test[]): Promise<TestResult[]> => {
  const results: TestResult[] = []

  for (const test of tests) {
    const mergedCode = mergeCode(code, test.input)
    console.log(mergedCode)
    const result = await compileCode(mergedCode.content, mergedCode.language)

    results.push({
      success: result.output === test.expectedOutput.content,
      output: result.output,
    })
  }

  return results
}
