'use client'

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'

// Define the shape of the state managed by the editor context
interface ChallengeEditorState {
  // Store code for each language separately
  currentCodeByLanguage: Record<string, string>
  currentLanguage: string
  // Potentially add other editor-related state later if needed (e.g., isRunning)
}

// Define the shape of the context value, including state and update functions
interface ChallengeEditorContextValue extends ChallengeEditorState {
  setCurrentCode: (language: string, code: string) => void
  setCurrentLanguage: (language: string) => void
}

// Create the context with an undefined default value (throws error if used outside provider)
const ChallengeEditorContext = createContext<ChallengeEditorContextValue | undefined>(
  undefined,
)

// Define props for the provider
interface ChallengeEditorProviderProps {
  children: ReactNode
  initialCodePerLanguage?: Record<string, string>
  initialLanguage?: string
}

// Create the Provider component
export const ChallengeEditorProvider = ({
  children,
  initialCodePerLanguage = {},
  initialLanguage = 'javascript', // Default initial language
}: ChallengeEditorProviderProps) => {
  const [currentCodeByLanguage, setCurrentCodeByLanguage] = useState<Record<string, string>>(
    initialCodePerLanguage,
  )
  const [currentLanguage, setCurrentLanguageState] = useState<string>(initialLanguage)

  // Function to update code for the *current* language
  const setCurrentCode = useCallback(
    (language: string, code: string) => {
      setCurrentCodeByLanguage((prev) => ({
        ...prev,
        [language]: code,
      }))
    },
    [],
  )

  // Function to update the current language
  const setCurrentLanguage = useCallback((language: string) => {
    setCurrentLanguageState(language)
    // Optional: Initialize code for the new language if it doesn't exist
    if (!(language in currentCodeByLanguage)) {
      setCurrentCodeByLanguage((prev) => ({
        ...prev,
        [language]: initialCodePerLanguage[language] || '', // Use initial or empty
      }))
    }
  }, [currentCodeByLanguage, initialCodePerLanguage])


  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      currentCodeByLanguage,
      currentLanguage,
      setCurrentCode,
      setCurrentLanguage,
    }),
    [
      currentCodeByLanguage,
      currentLanguage,
      setCurrentCode,
      setCurrentLanguage,
    ],
  )

  return (
    <ChallengeEditorContext.Provider value={value}>
      {children}
    </ChallengeEditorContext.Provider>
  )
}

// Create the custom hook for consuming the context
export const useChallengeEditor = (): ChallengeEditorContextValue => {
  const context = useContext(ChallengeEditorContext)
  if (context === undefined) {
    throw new Error(
      'useChallengeEditor must be used within a ChallengeEditorProvider',
    )
  }
  return context
} 