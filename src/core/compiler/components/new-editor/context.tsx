'use client'

import { OnMount } from '@monaco-editor/react'
import React, { createContext, useContext } from 'react'

// Types that need to be shared
export type ProgrammingLanguage = {
  value: string
  label: string
}

export type PyodideStatus = 'loading' | 'loaded' | 'error' | 'uninitialized'

// Context Type Definition
export interface GenericCodeEditorContextType {
  // State
  codeByLanguage: Record<string, string>
  currentLanguage: string
  isRunning: boolean // For simple run action
  isSubmitting: boolean // For submit action
  pyodideStatus: PyodideStatus
  isTerminalOpen: boolean
  activeTab: string // Keep as string for flexibility
  runOutput: string | null // Output from simple run
  availableLanguages: ProgrammingLanguage[]
  readOnly: boolean
  theme: 'vs' | 'vs-dark' | 'hc-black'
  editorRef: React.MutableRefObject<any | null>

  // Handlers
  handleCodeChange: (value: string | undefined) => void
  handleLanguageChange: (value: string) => void
  toggleTerminal: () => void
  setActiveTab: (tabId: string) => void
  handleEditorDidMount: OnMount
  runAction: () => Promise<void> // Action for the RUN button
  submitAction?: () => Promise<void> // Optional action for SUBMIT button
}

// Create Context
export const GenericCodeEditorContext = createContext<GenericCodeEditorContextType | null>(null)

// Hook for easy consumption
export const useGenericCodeEditor = (): GenericCodeEditorContextType => {
  const context = useContext(GenericCodeEditorContext)
  if (!context) {
    throw new Error('useGenericCodeEditor must be used within a GenericCodeEditor provider')
  }
  return context
}
