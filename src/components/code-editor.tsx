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
} from '@/core/compiler'

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
  readOnly?: boolean
  height?: string
  theme?: 'vs' | 'vs-dark' | 'hc-black'
  showLanguageSelector?: boolean
  availableLanguages?: ProgrammingLanguage[]
  onLanguageChange?: (language: string) => void
  tests?: Test[]
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

/**
 * Default terminal style
 */
const TERMINAL_STYLE = {
  backgroundColor: '#1a1b26',
  color: '#ffffff',
  fontFamily: 'monospace',
  padding: '12px',
  height: '100%',
  overflow: 'auto',
  whiteSpace: 'pre-wrap' as const,
}

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

/**
 * Header component with language selector and run button
 */
type EditorHeaderProps = {
  currentLanguage: string
  showLanguageSelector: boolean
  availableLanguages: ProgrammingLanguage[]
  isRunning: boolean
  readOnly: boolean
  onLanguageChange: (value: string) => void
  onRunCode: () => void
  pyodideStatus: 'loading' | 'loaded' | 'error' | 'uninitialized'
}

const EditorHeader = ({
  currentLanguage,
  showLanguageSelector,
  availableLanguages,
  isRunning,
  readOnly,
  onLanguageChange,
  onRunCode,
  pyodideStatus,
}: EditorHeaderProps) => {
  const languageLabel = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)
  const isPythonSelected = currentLanguage === 'python'
  const showPythonStatus = isPythonSelected && pyodideStatus !== 'loaded'

  return (
    <div className="border-b flex items-center justify-between px-3 py-2 bg-muted/20">
      <div className="flex items-center">
        {showLanguageSelector ? (
          <div className="flex items-center gap-2">
            <Select value={currentLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[155px] h-8">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showPythonStatus && (
              <div className="text-xs flex items-center">
                {pyodideStatus === 'loading' && (
                  <>
                    <Loader2 size={12} className="animate-spin mr-1" />
                    <span className="text-yellow-500">Loading Python...</span>
                  </>
                )}
                {pyodideStatus === 'error' && (
                  <span className="text-red-500">Python load failed</span>
                )}
                {pyodideStatus === 'uninitialized' && (
                  <span className="text-gray-500">Python not initialized</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="font-medium text-sm">{languageLabel}</span>
        )}
      </div>

      <div className="flex items-center">
        <Button
          variant="default"
          size="sm"
          className="h-8"
          onClick={onRunCode}
          disabled={isRunning || readOnly || (isPythonSelected && pyodideStatus !== 'loaded')}
        >
          {isRunning ? (
            <>
              <Loader2 size={14} className="mr-1 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play size={14} className="mr-1" />
              Run
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

/**
 * Terminal tabs component
 */
type TerminalTabsProps = {
  activeTab: TerminalTab
  isTerminalOpen: boolean
  onTabChange: (value: string) => void
  onChevronClick: (e: React.MouseEvent) => void
  onDoubleClick: (e: React.MouseEvent) => void
}

const TerminalTabs = ({
  activeTab,
  isTerminalOpen,
  onTabChange,
  onChevronClick,
  onDoubleClick,
}: TerminalTabsProps) => (
  <div
    className={cn(
      'border-t flex items-center justify-between px-1 h-10',
      isTerminalOpen ? 'border-b-0' : '',
    )}
    onDoubleClick={onDoubleClick}
  >
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
      <TabsList className="bg-transparent tabs-list-container">
        <TabsTrigger value="tests" className="flex items-center gap-1.5">
          <Beaker size={14} />
          <span>Test Results</span>
        </TabsTrigger>

        <Separator orientation="vertical" className="h-3 mx-1" />

        <TabsTrigger value="output" className="flex items-center gap-1.5">
          <FileOutput size={14} />
          <span>Output</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>

    {/* Icon to indicate if terminal is open or closed */}
    <div
      className="flex items-center cursor-pointer p-1 hover:bg-muted rounded-sm"
      onClick={onChevronClick}
      title={isTerminalOpen ? 'Close terminal' : 'Open terminal'}
    >
      {isTerminalOpen ? (
        <ChevronDown size={16} className="text-muted-foreground" />
      ) : (
        <ChevronUp size={16} className="text-muted-foreground" />
      )}
    </div>
  </div>
)

/**
 * Terminal content component
 */
type TerminalContentProps = {
  activeTab: TerminalTab
  testOutput: string
  executionOutput: string
  onTabChange: (value: string) => void
  isTerminalOpen: boolean
}

const TerminalContent = ({
  activeTab,
  testOutput,
  executionOutput,
  onTabChange,
  isTerminalOpen,
}: TerminalContentProps) => (
  <div
    className={cn(
      'transition-all duration-300 ease-in-out overflow-hidden',
      isTerminalOpen ? 'h-[30%] opacity-100' : 'h-0 opacity-0',
    )}
  >
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value)} className="h-full">
      <TabsContent value="tests" className="h-full p-0 m-0">
        <div style={TERMINAL_STYLE}>
          {testOutput || '> Test results will appear here after running your code.'}
        </div>
      </TabsContent>

      <TabsContent value="output" className="h-full p-0 m-0">
        <div style={TERMINAL_STYLE}>
          {executionOutput || '> No output available. Run your code to see results.'}
        </div>
      </TabsContent>
    </Tabs>
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
  readOnly = false,
  theme = 'vs-dark',
  showLanguageSelector = true,
  availableLanguages = DEFAULT_LANGUAGES,
  onLanguageChange,
  tests = [],
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
   * Formats test results for display
   */
  const formatTestResults = () => {
    if (tests.length === 0) {
      return '> No tests available for this challenge.'
    }

    let result = '> Running tests...\n\n'

    tests.forEach((test, index) => {
      const testNumber = index + 1
      const testDescription = test.description ? test.description : `Test #${testNumber}`

      result += `Test ${testNumber}: ${testDescription}\n`
      result += `Input: ${test.input}\n`
      result += `Expected Output: ${test.expectedOutput}\n\n`
    })

    return result
  }

  /**
   * Handles code execution
   */
  const handleRunCode = async () => {
    setIsRunning(true)

    // Clear previous outputs
    setExecutionOutput('')

    // Open terminal if closed
    if (!isTerminalOpen) {
      setIsTerminalOpen(true)
    }

    // Display test results
    setTestOutput(formatTestResults())
    setActiveTab('tests')

    // Execute code
    if (onRun) {
      try {
        onRun(codeByLanguage[currentLanguage] || '')
        setIsRunning(false)
      } catch (error) {
        setExecutionOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setIsRunning(false)
      }
    } else {
      try {
        // Switch to output tab for execution results
        setActiveTab('output')

        // Check if we're trying to run Python
        if (currentLanguage === 'python') {
          // Check if Pyodide is being loaded
          if (isPyodideLoading()) {
            setExecutionOutput(
              'Python interpreter (Pyodide) is still loading. Please wait a moment and try again.',
            )
            setIsRunning(false)
            return
          }

          // Check if Pyodide load failed
          const pyodideError = getPyodideLoadError()
          if (pyodideError) {
            setExecutionOutput(
              `Python interpreter (Pyodide) failed to load: ${pyodideError}. Please refresh the page.`,
            )
            setIsRunning(false)
            return
          }

          // Check if Pyodide is not loaded
          if (!isPyodideLoaded()) {
            setExecutionOutput(
              'Python interpreter (Pyodide) is not initialized yet. Please wait a moment and try again.',
            )
            setIsRunning(false)
            return
          }
        }

        // Use our compiler
        const result: CompilationResult = await compileCode(
          codeByLanguage[currentLanguage] || '',
          currentLanguage,
        )

        if (result.success) {
          setExecutionOutput(`// Execution result:\n${result.output || '(No output)'}`)
        } else {
          setExecutionOutput(`// Execution error:\n${result.error || 'Unknown error'}`)
        }
      } catch (error) {
        setExecutionOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setIsRunning(false)
      }
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
        testOutput={testOutput}
        executionOutput={executionOutput}
        onTabChange={handleTabChange}
        isTerminalOpen={isTerminalOpen}
      />
    </div>
  )
}
