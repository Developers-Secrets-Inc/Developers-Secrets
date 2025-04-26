'use client'

import { cn } from '@/lib/utils'
import { OnMount } from '@monaco-editor/react'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  compileCode,
  CompilationResult,
  getPyodideLoadError,
  isPyodideLoaded,
  isPyodideLoading,
} from '@/core/compiler'
import {
  GenericCodeEditorContext,
  GenericCodeEditorContextType,
  ProgrammingLanguage,
  PyodideStatus,
} from './context'
import { Header, LanguageSelector, RunButton, SubmitButton } from './header'
import { Footer, Tabs, TabTrigger, TabContent } from './footer'
import { EditorArea } from './editor-area'

// Default languages constant if needed by the provider
const DEFAULT_LANGUAGES: ProgrammingLanguage[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  // Add other default supported languages if needed
]

// Prop type includes the override now
type CodeEditorProviderProps = {
  initialCodePerLanguage?: Record<string, string>
  initialLanguage?: string
  availableLanguages?: ProgrammingLanguage[]
  onCodeChangeProp?: (code: string, language: string) => void // Renamed to avoid clash
  onLanguageChangeProp?: (language: string) => void // Renamed to avoid clash
  readOnly?: boolean
  theme?: 'vs' | 'vs-dark' | 'hc-black'
  showLanguageSelector?: boolean
  defaultCode?: string
  children: React.ReactNode
  onRunOverride?: (getCode: () => { code: string; lang: string }) => Promise<void>
  onSubmitOverride?: (getCode: () => { code: string; lang: string }) => Promise<void>
}

// Main Provider Component
function CodeEditorProvider({
  initialCodePerLanguage = {},
  initialLanguage = 'javascript',
  availableLanguages = DEFAULT_LANGUAGES,
  onCodeChangeProp,
  onLanguageChangeProp,
  readOnly = false,
  theme = 'vs-dark',
  showLanguageSelector = true,
  defaultCode = '',
  onRunOverride,
  onSubmitOverride,
  children,
}: CodeEditorProviderProps) {
  // State remains here
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>(() => {
    const initialState = { ...initialCodePerLanguage }
    if (!initialState[initialLanguage] && defaultCode) {
      initialState[initialLanguage] = defaultCode
    }
    availableLanguages.forEach((lang) => {
      if (!(lang.value in initialState)) {
        initialState[lang.value] = defaultCode
      }
    })
    return initialState
  })

  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage)
  const [runOutput, setRunOutput] = useState<string | null>(null)
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [activeTab, setActiveTabState] = useState<string>('output')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>(
    isPyodideLoading()
      ? 'loading'
      : isPyodideLoaded()
        ? 'loaded'
        : getPyodideLoadError()
          ? 'error'
          : 'uninitialized',
  )
  const editorRef = useRef<any>(null)

  // Handlers - wrapped in useCallback where appropriate
  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || ''
      setCodeByLanguage((prev) => ({
        ...prev,
        [currentLanguage]: newCode,
      }))
      onCodeChangeProp?.(newCode, currentLanguage)
    },
    [currentLanguage, onCodeChangeProp],
  )

  const handleLanguageChange = useCallback(
    (value: string) => {
      setCurrentLanguage(value)
      onLanguageChangeProp?.(value)
      editorRef.current?.focus()
    },
    [onLanguageChangeProp],
  )

  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen((prev) => !prev)
  }, [])

  const setActiveTab = useCallback((tabId: string) => {
    setActiveTabState(tabId)
    // Optionally open terminal when tab changes
    // if (!isTerminalOpen) setIsTerminalOpen(true);
  }, [])

  const handleRunCodeInternal = useCallback(async () => {
    setIsRunning(true)
    setRunOutput(null)
    setActiveTabState('output')
    if (!isTerminalOpen) {
      setIsTerminalOpen(true)
    }
    try {
      const currentCode = codeByLanguage[currentLanguage] || ''
      const result = await compileCode(currentCode, currentLanguage)
      setRunOutput(
        result.success
          ? result.output || '(No output)'
          : `Error: ${result.error || 'Unknown error'}`,
      )
    } catch (error) {
      setRunOutput(`Execution Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }, [codeByLanguage, currentLanguage, isTerminalOpen])

  // Getter function to pass to the override
  const getCodeState = useCallback(() => {
    return { code: codeByLanguage[currentLanguage] || '', lang: currentLanguage }
  }, [codeByLanguage, currentLanguage])

  // Determine the action for the run button
  const runAction = useMemo(() => {
    if (onRunOverride) {
      return async () => {
        setIsRunning(true)
        try {
          await onRunOverride(getCodeState)
        } finally {
          setIsRunning(false)
        }
      }
    }
    return handleRunCodeInternal
  }, [onRunOverride, getCodeState, handleRunCodeInternal])

  // Determine the action for the submit button
  const submitAction = useMemo(() => {
    if (onSubmitOverride) {
      return async () => {
        setIsSubmitting(true)
        try {
          await onSubmitOverride(getCodeState)
        } finally {
          setIsSubmitting(false)
        }
      }
    }
    return undefined
  }, [onSubmitOverride, getCodeState])

  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor
      // Define theme (could also be passed via prop/context)
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: { 'editor.background': '#1a1b26' },
      })
      if (theme === 'vs-dark') {
        monaco.editor.setTheme('custom-dark')
      }
      editor.focus()
    },
    [theme],
  )

  // Effects for syncing props and pyodide status
  useEffect(() => {
    const targetState = { ...initialCodePerLanguage }
    if (!targetState[initialLanguage]) {
      targetState[initialLanguage] = codeByLanguage[initialLanguage] ?? defaultCode
    }
    availableLanguages.forEach((lang) => {
      if (!(lang.value in targetState)) {
        targetState[lang.value] = codeByLanguage[lang.value] ?? defaultCode
      }
    })
    setCodeByLanguage((currentState) => {
      const currentStateKeys = Object.keys(currentState)
      const targetStateKeys = Object.keys(targetState)
      let changed = false
      if (currentStateKeys.length !== targetStateKeys.length) {
        changed = true
      } else {
        for (const key of targetStateKeys) {
          if (!currentState.hasOwnProperty(key) || currentState[key] !== targetState[key]) {
            changed = true
            break
          }
        }
      }
      if (changed) {
        return { ...currentState, ...targetState }
      }
      return currentState
    })
  }, [initialCodePerLanguage, availableLanguages, defaultCode, initialLanguage])

  useEffect(() => {
    if (initialLanguage !== currentLanguage) {
      setCurrentLanguage(initialLanguage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLanguage])

  useEffect(() => {
    const handlePyodideLoaded = () => setPyodideStatus('loaded')
    const handlePyodideLoadError = () => setPyodideStatus('error')
    if (isPyodideLoading()) setPyodideStatus('loading')
    else if (isPyodideLoaded()) setPyodideStatus('loaded')
    else if (getPyodideLoadError()) setPyodideStatus('error')
    else setPyodideStatus('uninitialized')
    document.addEventListener('pyodideLoaded', handlePyodideLoaded)
    document.addEventListener('pyodideLoadError', handlePyodideLoadError)
    return () => {
      document.removeEventListener('pyodideLoaded', handlePyodideLoaded)
      document.removeEventListener('pyodideLoadError', handlePyodideLoadError)
    }
  }, [])

  // Prepare context value
  const contextValue: GenericCodeEditorContextType = {
    codeByLanguage,
    currentLanguage,
    isRunning,
    isSubmitting,
    pyodideStatus,
    isTerminalOpen,
    activeTab,
    runOutput,
    availableLanguages,
    readOnly,
    theme,
    showLanguageSelector,
    editorRef,
    handleCodeChange,
    handleLanguageChange,
    toggleTerminal,
    setActiveTab,
    handleEditorDidMount,
    runAction,
    submitAction,
  }

  return (
    <GenericCodeEditorContext.Provider value={contextValue}>
      <div className="h-full flex flex-col border overflow-hidden bg-background">{children}</div>
    </GenericCodeEditorContext.Provider>
  )
}

// Export the provider component
export { CodeEditorProvider }

// Export sub-components grouped under a namespace object
export const GenericCodeEditor = {
  Header,
  LanguageSelector,
  RunButton,
  SubmitButton,
  EditorArea,
  Footer,
  Tabs,
  TabTrigger,
  TabContent,
}
