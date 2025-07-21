'use client'

import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react'
import { PartCompletionToastInternal } from './completion-toast'
// Import the necessary shadcn/ui Toast components
import { ToastProvider as ShadcnToastProvider, ToastViewport } from '@/components/ui/toast'

// Define the shape of the props the toast will accept
interface PartCompletionToastProps {
  xpEarned: number
  solutionUnlocked?: boolean
}

// Define the shape of the context value
interface CompletionToastContextValue {
  showToast: (props: PartCompletionToastProps) => void
}

// Create the context with a dummy default value
const CompletionToastContext = createContext<CompletionToastContextValue>({
  showToast: () => {
    console.warn('CompletionToastProvider not found!')
  },
})

// Create the Provider component
export const CompletionToastProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentProps, setCurrentProps] = useState<PartCompletionToastProps | null>(null)

  const showToast = useCallback((props: PartCompletionToastProps) => {
    setCurrentProps(props)
    setIsOpen(true) // Open the toast
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <CompletionToastContext.Provider value={{ showToast }}>
      {children}
      {/* Wrap the internal toast rendering with the required shadcn/ui provider and viewport */}
      <ShadcnToastProvider swipeDirection="right">
        <PartCompletionToastInternal isOpen={isOpen} props={currentProps} onClose={handleClose} />
        <ToastViewport className="sm:left-auto sm:right-0" /> {/* Position viewport */}
      </ShadcnToastProvider>
    </CompletionToastContext.Provider>
  )
}

// Create the hook for easy consumption
export const useCompletionToast = (): CompletionToastContextValue => {
  const context = useContext(CompletionToastContext)
  if (context === undefined) {
    throw new Error('useCompletionToast must be used within a CompletionToastProvider')
  }
  return context
}

// Export the props type for use elsewhere
export type { PartCompletionToastProps }
