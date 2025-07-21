'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

export type ProgrammingLanguage = {
  value: string
  label: string
}

type CodeEditorContextType = {
  code: string
  language: string
  theme: string
  readOnly: boolean
  isRunning: boolean
  availableLanguages: ProgrammingLanguage[]
  setIsRunning: (value: boolean) => void
  updateCode: (newCode: string) => void
  setLanguage: (newLanguage: string) => void
}

const CodeEditorContext = createContext<CodeEditorContextType | undefined>(undefined)

export const CodeEditorProvider = ({
  children,
  initialCode = '',
  initialLanguage = 'javascript',
  availableLanguages,
  theme = 'vs-dark',
  readOnly = false,
}: {
  children: ReactNode
  initialCode?: string
  initialLanguage?: string
  availableLanguages: ProgrammingLanguage[]
  theme?: string
  readOnly?: boolean
}) => {
  const [code, setCode] = useState(initialCode)
  const [isRunning, setIsRunning] = useState(false)
  const [language, setLanguage] = useState(initialLanguage)

  const updateCode = (newCode: string) => setCode(newCode)

  return (
    <CodeEditorContext.Provider
      value={{
        code,
        language,
        availableLanguages,
        theme,
        readOnly,
        isRunning,
        setIsRunning,
        updateCode,
        setLanguage,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  )
}

export const useCodeEditor = () => {
  const context = useContext(CodeEditorContext)
  if (context === undefined) {
    throw new Error('useCodeEditor must be used within a CodeEditorProvider')
  }
  return context
}
