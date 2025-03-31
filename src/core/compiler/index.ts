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
      URL.revokeObjectURL(blobURL)
      worker.terminate()
      resolve(e.data)
    }

    // Handle errors
    worker.onerror = (e) => {
      URL.revokeObjectURL(blobURL)
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
    const blob = new Blob([
      `
      self.onmessage = function(e) {
        try {
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

    const blobURL = URL.createObjectURL(blob)
    const worker = new Worker(blobURL)

    worker.onmessage = (e) => {
      URL.revokeObjectURL(blobURL)
      worker.terminate()
      resolve(e.data)
    }

    worker.onerror = (e) => {
      URL.revokeObjectURL(blobURL)
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
    const output = await pyodide.runPythonAsync(`sys.stdout.getvalue()`)

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
