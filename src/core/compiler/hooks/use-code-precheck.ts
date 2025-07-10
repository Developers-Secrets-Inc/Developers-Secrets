import { useState, useEffect, useCallback } from 'react'

// Define the structure of the result we expect from the pre-check
interface PreCheckResult {
  success: boolean
  output?: string
  error?: string
}

// Default timeout for the watchdog in milliseconds
const EXECUTION_TIMEOUT = 5000 // 5 seconds

/**
 * A custom hook to manage a Web Worker for pre-checking user code.
 * It handles the worker's lifecycle, state management, and communication,
 * including a timeout mechanism to prevent infinite loops from blocking.
 *
 * @returns An object containing the execution state and a function to trigger the check.
 */
export const useCodePrecheck = (): {
  isChecking: boolean
  result: PreCheckResult | null
  error: string | null
  executePreCheck: (code: string, language: string) => Promise<PreCheckResult>
} => {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const [result, setResult] = useState<PreCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 1. Manage the Worker's Lifecycle
  useEffect(() => {
    // Create the worker instance when the component mounts
    const newWorker = new Worker(new URL('../workers/code-precheck-worker.mjs', import.meta.url), {
      type: 'module',
    })
    setWorker(newWorker)

    // Terminate the worker when the component unmounts to prevent memory leaks
    return () => {
      newWorker.terminate()
    }
  }, []) // The empty dependency array ensures this runs only once on mount/unmount

  // 2. Expose a simple function to execute the pre-check
  const executePreCheck = useCallback(
    (code: string, language: string): Promise<PreCheckResult> => {
      if (!worker) {
        return Promise.reject(new Error('Worker is not initialized.'))
      }

      // Reset states for the new execution
      setIsChecking(true)
      setResult(null)
      setError(null)

      // 3. Implement the Watchdog with Promise.race
      return new Promise((resolve, reject) => {
        const handleSuccess = (event: MessageEvent) => {
          cleanupListeners()
          setIsChecking(false)
          setResult(event.data)
          resolve(event.data)
        }

        const handleError = (event: ErrorEvent) => {
          cleanupListeners()
          setIsChecking(false)
          const errorMessage = event.message || 'An unknown error occurred in the worker.'
          setError(errorMessage)
          reject(new Error(errorMessage))
        }

        const handleTimeout = () => {
          worker.terminate() // Kill the unresponsive worker
          const newWorker = new Worker(
            new URL('../workers/code-precheck-worker.mjs', import.meta.url),
            {
              type: 'module',
            },
          )
          setWorker(newWorker)
          cleanupListeners(newWorker)
          setIsChecking(false)
          const errorMessage = 'Execution timed out. An infinite loop is likely.'
          setError(errorMessage)
          reject(new Error(errorMessage))
        }

        const cleanupListeners = (targetWorker = worker) => {
          targetWorker?.removeEventListener('message', handleSuccess)
          targetWorker?.removeEventListener('error', handleError)
          clearTimeout(timeoutId)
        }

        // Set up listeners for the current execution
        worker.addEventListener('message', handleSuccess)
        worker.addEventListener('error', handleError)

        // Set up the watchdog timer
        const timeoutId = setTimeout(handleTimeout, EXECUTION_TIMEOUT)

        // Send the code to the worker to start the execution
        worker.postMessage({ code, language })
      })
    },
    [worker],
  )

  return { isChecking, result, error, executePreCheck }
}
