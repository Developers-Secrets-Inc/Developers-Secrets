// Lazy-loaded pyodide instance
let pyodide

// --- Pyodide Loading and Initialization ---
async function loadPyodideAndInitialize() {
  // Import the main Pyodide script
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js')
  // Load the Pyodide wasm module
  pyodide = await self.loadPyodide()
  console.log('[Pre-check Worker] Pyodide loaded successfully.')
}

// --- Python Execution Logic ---
async function executePython(code) {
  if (!pyodide) {
    self.postMessage({ success: false, error: 'Pyodide is not yet loaded. Please wait.' })
    await loadPyodideAndInitialize()
  }

  // 1. Reset stdout capture for this execution
  let capturedOutput = ''
  pyodide.setStdout({ batched: (s) => (capturedOutput += s + '\n') })

  // 2. Create a fresh, isolated global scope for this execution
  const globals = pyodide.globals.get('dict')()

  try {
    // 3. Execute the code within the isolated scope
    await pyodide.runPythonAsync(code, { globals })
    self.postMessage({ success: true, output: capturedOutput.trim() })
  } catch (error) {
    self.postMessage({ success: false, error: error.message })
  } finally {
    // 4. Clean up the created scope to free memory
    globals.destroy()
  }
}

// --- JavaScript Execution Logic ---
function executeJavaScript(code) {
  // 1. Reset console.log capture for this execution
  let capturedOutput = ''
  const originalLog = console.log
  console.log = (...args) => {
    capturedOutput += args.map((arg) => String(arg)).join(' ') + '\n'
  }

  try {
    // 2. Wrap the code in an IIFE to isolate its scope
    const isolatedCode = `(function(){\n${code}\n})();`
    eval(isolatedCode)
    self.postMessage({ success: true, output: capturedOutput.trim() })
  } catch (error) {
    self.postMessage({ success: false, error: error.message })
  } finally {
    // 3. Restore the original console.log for the worker's own use
    console.log = originalLog
  }
}

// --- Main Worker Logic: The Orchestrator ---
self.addEventListener('message', async (e) => {
  const { code, language } = e.data

  console.log(`[Pre-check Worker] Received code. Language: ${language}`)

  switch (language) {
    case 'python':
      await executePython(code)
      break
    case 'javascript':
    case 'typescript': // For pre-checking, we treat TS as JS
      executeJavaScript(code)
      break
    default:
      self.postMessage({ success: false, error: `Unsupported language for pre-check: ${language}` })
  }
})
