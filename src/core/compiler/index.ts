import { toast } from 'sonner'

// Types
export type CompilationResult = {
  success: boolean
  output: string
  error?: string
}

// JavaScript Worker
const createJavaScriptWorker = (code: string): Promise<CompilationResult> => {
  return new Promise((resolve) => {
    // Create a blob that contains the worker code
    const blob = new Blob([
      `
      self.onmessage = function(e) {
        try {
          // Create a function from the code and execute it
          const result = new Function(e.data)();
          
          // Capture console.log output
          let output = '';
          const originalLog = console.log;
          console.log = function(...args) {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ') + '\\n';
            originalLog.apply(console, args);
          };
          
          // Execute the code
          eval(e.data);
          
          // Restore console.log
          console.log = originalLog;
          
          self.postMessage({ success: true, output });
        } catch (error) {
          self.postMessage({ success: false, error: error.message, output: '' });
        }
      };
      `,
    ])

    // Create a URL for the blob
    const blobURL = URL.createObjectURL(blob)

    // Create a new worker
    const worker = new Worker(blobURL)

    // Handle messages from the worker
    worker.onmessage = (e) => {
      // Revoke the blob URL to free memory
      URL.revokeObjectURL(blobURL)
      // Terminate the worker
      worker.terminate()
      // Resolve with the result
      resolve(e.data)
    }

    // Handle errors
    worker.onerror = (e) => {
      // Revoke the blob URL to free memory
      URL.revokeObjectURL(blobURL)
      // Terminate the worker
      worker.terminate()
      // Resolve with the error
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
  return new Promise((resolve) => {
    // We'll use the same worker approach but with TypeScript transpilation
    // In a real app, you would use the TypeScript compiler API
    // For this example, we'll just execute it as JavaScript

    // Create a blob that contains the worker code
    const blob = new Blob([
      `
      self.onmessage = function(e) {
        try {
          // In a real app, you would transpile TypeScript to JavaScript here
          // For this example, we'll just execute it as JavaScript
          
          // Capture console.log output
          let output = '';
          const originalLog = console.log;
          console.log = function(...args) {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ') + '\\n';
            originalLog.apply(console, args);
          };
          
          // Execute the code
          eval(e.data);
          
          // Restore console.log
          console.log = originalLog;
          
          self.postMessage({ success: true, output });
        } catch (error) {
          self.postMessage({ success: false, error: error.message, output: '' });
        }
      };
      `,
    ])

    // Create a URL for the blob
    const blobURL = URL.createObjectURL(blob)

    // Create a new worker
    const worker = new Worker(blobURL)

    // Handle messages from the worker
    worker.onmessage = (e) => {
      // Revoke the blob URL to free memory
      URL.revokeObjectURL(blobURL)
      // Terminate the worker
      worker.terminate()
      // Resolve with the result
      resolve(e.data)
    }

    // Handle errors
    worker.onerror = (e) => {
      // Revoke the blob URL to free memory
      URL.revokeObjectURL(blobURL)
      // Terminate the worker
      worker.terminate()
      // Resolve with the error
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

// Python compilation using Pyodide
const compilePython = async (code: string): Promise<CompilationResult> => {
  try {
    // Check if Pyodide is still loading
    if (isPyodideLoading()) {
      return {
        success: false,
        output: '',
        error: 'Python interpreter (Pyodide) is still loading. Please wait a moment and try again.',
      }
    }

    // Check if Pyodide failed to load
    const loadError = getPyodideLoadError()
    if (loadError) {
      return {
        success: false,
        output: '',
        error: `Python interpreter (Pyodide) failed to load: ${loadError}. Please refresh the page.`,
      }
    }

    // Get the Pyodide instance from the window object
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
    const output = await pyodide.runPythonAsync(`sys.stdout.getvalue()`)

    // Reset stdout
    await pyodide.runPythonAsync(`sys.stdout = sys.__stdout__`)

    return {
      success: true,
      output,
    }
  } catch (error) {
    // Handle Python errors specifically
    let errorMessage = error instanceof Error ? error.message : String(error)

    // Try to extract cleaner Python error message if possible
    if (errorMessage.includes('PythonError:')) {
      const errorLines = errorMessage.split('\n')
      // Find the line with the actual error message
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
    toast.error(`Compilation error: ${error instanceof Error ? error.message : String(error)}`)
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : String(error),
    }
  }
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
