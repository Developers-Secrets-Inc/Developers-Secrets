'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Play, Send } from 'lucide-react'
import { PyodideLoadingStatus } from '../editor/pyodide-loading-status'
import { useGenericCodeEditor } from './context'

// Sub-component: Language Selector
export const LanguageSelector = ({ showLanguageSelector = true }: { showLanguageSelector?: boolean }) => {
  const {
    currentLanguage,
    availableLanguages,
    handleLanguageChange,
    pyodideStatus,
  } = useGenericCodeEditor()

  if (!showLanguageSelector) {
    const languageLabel =
      availableLanguages.find((lang) => lang.value === currentLanguage)?.label || currentLanguage
    return <span className="font-medium text-sm">{languageLabel}</span>
  }

  const isPythonSelected = currentLanguage === 'python'
  const showPythonStatus = isPythonSelected && pyodideStatus !== 'loaded'

  return (
    <div className="flex items-center gap-2">
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-8">
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
      {showPythonStatus && <PyodideLoadingStatus pyodideStatus={pyodideStatus} />}
    </div>
  )
}

// Sub-component: Run Button
export const RunButton = () => {
  const { isRunning, readOnly, runAction, pyodideStatus, currentLanguage } = useGenericCodeEditor()

  const isPythonSelected = currentLanguage === 'python'

  // Initial disabled state only considers running/readonly
  let isDisabled = isRunning || readOnly

  if (isPythonSelected && pyodideStatus !== 'loaded') {
    isDisabled = true
  }

  return (
    <Button variant="secondary" size="sm" className="h-8" onClick={runAction} disabled={isDisabled}>
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
  )
}

// NEW Sub-component: Submit Button
export const SubmitButton = () => {
  const { isSubmitting, readOnly, submitAction, isRunning } = useGenericCodeEditor()

  // Disable if no submitAction provided, or if running/submitting
  const isDisabled = !submitAction || isSubmitting || isRunning || readOnly

  return (
    <Button
      variant="default" // Use default variant for primary action
      size="sm"
      className="h-8"
      onClick={submitAction} // Use submitAction from context
      disabled={isDisabled}
    >
      {isSubmitting ? (
        <>
          <Loader2 size={14} className="mr-1 animate-spin" />
          Checking...
        </>
      ) : (
        <>
          <Send size={14} className="mr-1" /> {/* Use Send icon */}
          <span>Submit</span> {/* Wrap text in span */}
        </>
      )}
    </Button>
  )
}

// Main Header component (Layout Wrapper - simplified)
export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b flex items-center justify-between px-3 py-2 bg-muted/20 h-12 flex-shrink-0">
      {/* Render children directly for flexible layout by parent */}
      {children}
    </div>
  )
}
