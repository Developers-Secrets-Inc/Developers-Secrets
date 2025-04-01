'use client'

import { useRef, useState, useEffect } from 'react'
import { Editor, OnMount } from '@monaco-editor/react'
import { Loader2, FileOutput, ChevronUp, ChevronDown, Play, Beaker } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  compileCode,
  CompilationResult,
  isPyodideLoaded,
  isPyodideLoading,
  getPyodideLoadError,
  testCode,
} from '@/core/compiler'
import { EditorHeader } from './header'
import { TerminalContent, TerminalTabs, TestResult } from './terminal'
import { submitCode } from '@/core/challenges/submissions/index.client'

// ==============================
// Types
// ==============================

/**
 * Represents a test case for code evaluation
 */
type Test = {
  id?: string
  description?: string
  input: string
  expectedOutput: string
}

/**
 * Available terminal tabs
 */
type TerminalTab = 'tests' | 'output'

/**
 * Programming language definition
 */
type ProgrammingLanguage = {
  value: string
  label: string
}

/**
 * Props for the CodeEditor component
 */
type CodeEditorProps = {
  initialCode: string
  language: string
  onChange?: (value: string) => void
  onRun?: (code: string) => void
  onSubmit?: (
    code: { content: string; language: string },
    tests: { input: string; expectedOutput: string }[],
  ) => void
  readOnly?: boolean
  height?: string
  theme?: 'vs' | 'vs-dark' | 'hc-black'
  showLanguageSelector?: boolean
  availableLanguages?: ProgrammingLanguage[]
  onLanguageChange?: (language: string) => void
  tests?: Record<string, { input: string; expectedOutput: string }[]>
  codeVersions?: Record<string, string>
}

// ==============================
// Constants
// ==============================

/**
 * Default available programming languages
 */
const DEFAULT_LANGUAGES: ProgrammingLanguage[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
]

type Language = 'python' | 'javascript' | 'typescript'

/**
 * Default terminal style
 */

// ==============================
// Sub-components
// ==============================

/**
 * Loading component displayed while the editor is loading
 */
const EditorLoading = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading editor...</span>
  </div>
)

// ==============================
// Main Component
// ==============================

/**
 * Code editor component using Monaco Editor with integrated test runner
 */
export function CodeEditor({
  initialCode = '',
  language = 'javascript',
  onChange,
  onRun,
  onSubmit,
  readOnly = false,
  theme = 'vs-dark',
  showLanguageSelector = true,
  availableLanguages = DEFAULT_LANGUAGES,
  onLanguageChange,
  tests = {},
  codeVersions = {},
}: CodeEditorProps) {
  // ==============================
  // State
  // ==============================
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>(() => {
    // Initialiser avec les versions de code fournies
    const initialState = { ...codeVersions }
    // Si le langage actuel n'a pas de code initial, utiliser initialCode
    if (!initialState[language]) {
      initialState[language] = initialCode
    }
    return initialState
  })
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [testOutput, setTestOutput] = useState<string>('')
  const [executionOutput, setExecutionOutput] = useState<string>('')
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TerminalTab>('tests')
  const [isRunning, setIsRunning] = useState(false)
  const [pyodideStatus, setPyodideStatus] = useState<
    'loading' | 'loaded' | 'error' | 'uninitialized'
  >(
    isPyodideLoading()
      ? 'loading'
      : isPyodideLoaded()
        ? 'loaded'
        : getPyodideLoadError()
          ? 'error'
          : 'uninitialized',
  )
  const editorRef = useRef<unknown>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  // ==============================
  // Effects
  // ==============================

  // Effet pour mettre à jour le code quand les codeVersions changent
  useEffect(() => {
    setCodeByLanguage((prev) => ({
      ...prev,
      ...codeVersions,
    }))
  }, [codeVersions])

  // Listen for Pyodide load events
  useEffect(() => {
    const handlePyodideLoaded = () => {
      setPyodideStatus('loaded')
    }

    const handlePyodideLoadError = () => {
      setPyodideStatus('error')
    }

    // Check initial status
    if (isPyodideLoading()) {
      setPyodideStatus('loading')
    } else if (isPyodideLoaded()) {
      setPyodideStatus('loaded')
    } else if (getPyodideLoadError()) {
      setPyodideStatus('error')
    } else {
      setPyodideStatus('uninitialized')
    }

    // Add event listeners
    document.addEventListener('pyodideLoaded', handlePyodideLoaded)
    document.addEventListener('pyodideLoadError', handlePyodideLoadError)

    // Cleanup
    return () => {
      document.removeEventListener('pyodideLoaded', handlePyodideLoaded)
      document.removeEventListener('pyodideLoadError', handlePyodideLoadError)
    }
  }, [])

  // ==============================
  // Handlers
  // ==============================

  /**
   * Handles editor initialization
   */
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure Monaco theme
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1b26',
      },
    })

    if (theme === 'vs-dark') {
      monaco.editor.setTheme('custom-dark')
    }

    editor.focus()
  }

  /**
   * Handles code changes in the editor
   */
  const handleCodeChange = (value: string = '') => {
    setCodeByLanguage((prev) => ({
      ...prev,
      [currentLanguage]: value,
    }))
    onChange?.(value)
  }

  /**
   * Handles language selection changes
   */
  const handleLanguageChange = (value: string) => {
    // Sauvegarder le code actuel avant de changer de langage
    setCodeByLanguage((prev) => ({
      ...prev,
      [currentLanguage]: prev[currentLanguage] || '',
    }))

    // Changer de langage
    setCurrentLanguage(value)

    // Notifier le parent du changement
    onLanguageChange?.(value)
  }

  /**
   * Toggles terminal visibility
   */
  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen)
  }

  /**
   * Handles double-click on tab bar
   */
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.tabs-list-container')) {
      toggleTerminal()
    }
  }

  /**
   * Handles chevron click to toggle terminal
   */
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTerminal()
  }

  /**
   * Handles tab selection changes
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value as TerminalTab)
    if (!isTerminalOpen) {
      setIsTerminalOpen(true)
    }
  }

  /**
   * Handles code execution
   */
  const handleRunCode = async () => {
    setIsRunning(true)

    // Clear previous outputs
    setExecutionOutput('')
    setTestResults([])

    // Open terminal if closed
    if (!isTerminalOpen) {
      setIsTerminalOpen(true)
    }

    try {
      const currentCode = codeByLanguage[currentLanguage] || ''

      // First, execute the code without tests to get the general output
      const executionResult = await compileCode(currentCode, currentLanguage)
      setExecutionOutput(
        executionResult.success
          ? executionResult.output || '(No output)'
          : `Error: ${executionResult.error || 'Unknown error'}`,
      )

      // Then run the tests for the current language
      const currentTests = tests[currentLanguage] || []
      const results: TestResult[] = []

      for (const test of currentTests) {
        const testCode = `${currentCode}\n${test.input}`
        const result = await compileCode(testCode, currentLanguage)

        results.push({
          success: result.success && result.output.trim() === test.expectedOutput.trim(),
          input: test.input,
          expectedOutput: test.expectedOutput,
          actualOutput: result.success ? result.output : result.error || 'No output',
        })
      }

      setTestResults(results)

      // Switch to output tab to show execution result
      setActiveTab('output')
    } catch (error) {
      setExecutionOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  /**
   * Handles code submission
   */
  const handleSubmitCode = async () => {
    // First run the tests
    setIsRunning(true)
    setTestResults([])

    try {
      const currentCode = codeByLanguage[currentLanguage] || ''
      const currentTests = tests[currentLanguage] || []
      const results: TestResult[] = []

      for (const test of currentTests) {
        const testCode = `${currentCode}\n${test.input}`
        const result = await compileCode(testCode, currentLanguage)

        results.push({
          success: result.success && result.output.trim() === test.expectedOutput.trim(),
          input: test.input,
          expectedOutput: test.expectedOutput,
          actualOutput: result.success ? result.output : result.error || 'No output',
        })
      }

      setTestResults(results)

      // Submit the code regardless of test results

      
      const submission = await submitCode(
        {
          content: currentCode,
          language: currentLanguage as Language,
        },
        currentTests.map((test) => ({
          input: {
            content: test.input,
            language: currentLanguage as Language,
          },
          expectedOutput: {
            content: test.expectedOutput,
            language: currentLanguage as Language,
          },
        })),
      )

      console.log('Submission', submission)
      setActiveTab('output')
    } catch (error) {
      setExecutionOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  // ==============================
  // Render
  // ==============================
  return (
    <div className="h-full flex flex-col border overflow-hidden">
      {/* Editor header */}
      <EditorHeader
        currentLanguage={currentLanguage}
        showLanguageSelector={showLanguageSelector}
        availableLanguages={availableLanguages}
        isRunning={isRunning}
        readOnly={readOnly}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        onSubmitCode={onSubmit ? handleSubmitCode : undefined}
        pyodideStatus={pyodideStatus}
      />

      {/* Code editor panel */}
      <div
        className={cn(
          'flex-grow transition-all duration-300 ease-in-out',
          isTerminalOpen ? 'h-[calc(70%-40px)]' : 'h-[calc(100%-80px)]',
        )}
      >
        <Editor
          height="100%"
          language={currentLanguage}
          value={codeByLanguage[currentLanguage] || ''}
          theme={theme}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          loading={<EditorLoading />}
          options={{
            readOnly,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>

      {/* Terminal tabs */}
      <TerminalTabs
        activeTab={activeTab}
        isTerminalOpen={isTerminalOpen}
        onTabChange={handleTabChange}
        onChevronClick={handleChevronClick}
        onDoubleClick={handleDoubleClick}
      />

      {/* Terminal content */}
      <TerminalContent
        activeTab={activeTab}
        testResults={testResults}
        executionOutput={executionOutput}
        onTabChange={handleTabChange}
        isTerminalOpen={isTerminalOpen}
      />
    </div>
  )
}
