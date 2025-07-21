'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react'
// Import the type for test results, adjust path if needed
import type { CoursePartTestResult } from '../submissions/testing.client'

// Define the shape of the state shared by the editor
interface EditorState {
  currentCode: string
  currentLanguage: string
  runOutput: string | null
  lastTestResult: CoursePartTestResult | null
}

// Define the shape of the context value, including state and update functions
interface EditorStateContextValue extends EditorState {
  // Explicit setters for components that manage the state (like CourseCodeEditor)
  _setCurrentCode: (code: string) => void
  _setCurrentLanguage: (language: string) => void
  _setRunOutput: (output: string | null) => void
  _setLastTestResult: (result: CoursePartTestResult | null) => void
  // Potentially add getters or combined functions if needed later
}

// Create the context with a default value (throws error if used outside provider)
const EditorStateContext = createContext<EditorStateContextValue | undefined>(undefined)

// Define props for the provider
interface EditorStateProviderProps {
  children: ReactNode
  initialLanguage?: string // Allow setting an initial language
}

// Create the Provider component
export const EditorStateProvider = ({
  children,
  initialLanguage = 'javascript', // Default initial language
}: EditorStateProviderProps) => {
  const [currentCode, setCurrentCode] = useState<string>('') // Initial code can be set later if needed
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLanguage)
  const [runOutput, setRunOutput] = useState<string | null>(null)
  const [lastTestResult, setLastTestResult] = useState<CoursePartTestResult | null>(null)

  // Use useCallback for setter functions passed down to avoid unnecessary re-renders
  const _setCurrentCode = useCallback((code: string) => {
    setCurrentCode(code)
  }, [])

  const _setCurrentLanguage = useCallback((language: string) => {
    setCurrentLanguage(language)
  }, [])

  const _setRunOutput = useCallback((output: string | null) => {
    setRunOutput(output)
  }, [])

  const _setLastTestResult = useCallback((result: CoursePartTestResult | null) => {
    setLastTestResult(result)
  }, [])

  // Memoize the context value
  const value = useMemo(
    () => ({
      currentCode,
      currentLanguage,
      runOutput,
      lastTestResult,
      _setCurrentCode,
      _setCurrentLanguage,
      _setRunOutput,
      _setLastTestResult,
    }),
    [
      currentCode,
      currentLanguage,
      runOutput,
      lastTestResult,
      _setCurrentCode,
      _setCurrentLanguage,
      _setRunOutput,
      _setLastTestResult,
    ],
  )

  return <EditorStateContext.Provider value={value}>{children}</EditorStateContext.Provider>
}

// Create the custom hook for consuming the context
export const useEditorState = (): EditorStateContextValue => {
  const context = useContext(EditorStateContext)
  if (context === undefined) {
    throw new Error('useEditorState must be used within an EditorStateProvider')
  }
  return context
}

// Export the state type if needed elsewhere
export type { EditorState }
