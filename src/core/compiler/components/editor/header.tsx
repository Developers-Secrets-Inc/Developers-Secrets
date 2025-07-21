'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Play, Send } from 'lucide-react'
import { PyodideLoadingStatus } from './pyodide-loading-status'
import { useEditorStore } from './store'

type ProgrammingLanguage = {
  value: string
  label: string
}

/**
 * Header component with language selector and run button
 */
type EditorHeaderProps = {
  showLanguageSelector: boolean
  availableLanguages: ProgrammingLanguage[]
  isRunning: boolean
  readOnly: boolean
  onLanguageChange: (value: string) => void
  onRunCode: () => void
  onSubmitCode?: () => void
  pyodideStatus: 'loading' | 'loaded' | 'error' | 'uninitialized'
}

const LanguageSelector = ({
  availableLanguages,
  onLanguageChange,
  pyodideStatus,
}: {
  availableLanguages: ProgrammingLanguage[]
  onLanguageChange: (value: string) => void
  pyodideStatus: 'loading' | 'loaded' | 'error' | 'uninitialized'
}) => {
  const { currentLanguage } = useEditorStore()

  const isPythonSelected = currentLanguage === 'python'
  const showPythonStatus = isPythonSelected && pyodideStatus !== 'loaded'


  return (
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

      {showPythonStatus && <PyodideLoadingStatus pyodideStatus={pyodideStatus} />}
    </div>
  )
}

export const RunButton = ({
  isRunning,
  readOnly,
  onRunCode,
  isPythonSelected,
  pyodideStatus,
}: {
  isRunning: boolean
  readOnly: boolean
  onRunCode: () => void
  isPythonSelected: boolean
  pyodideStatus: 'loading' | 'loaded' | 'error' | 'uninitialized'
}) => {
  const isDisabled = isRunning || readOnly || (isPythonSelected && pyodideStatus !== 'loaded')
  return (
    <Button variant="secondary" size="sm" className="h-8" onClick={onRunCode} disabled={isDisabled}>
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

export const SubmitButton = ({
  isRunning,
  readOnly,
  onSubmit,
}: {
  isRunning: boolean
  readOnly: boolean
  onSubmit: () => void
}) => {
  return (
    <Button
      variant="default"
      size="sm"
      className="h-8"
      onClick={onSubmit}
      disabled={isRunning || readOnly}
    >
      <Send size={14} className="mr-1" />
      Submit
    </Button>
  )
}

export const EditorHeader = ({
  showLanguageSelector,
  availableLanguages,
  isRunning,
  readOnly,
  onLanguageChange,
  onRunCode,
  onSubmitCode,
  pyodideStatus,
}: EditorHeaderProps) => {
  const { currentLanguage } = useEditorStore()

  const languageLabel = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)
  const isPythonSelected = currentLanguage === 'python'

  return (
    <div className="border-b flex items-center justify-between px-3 py-2 bg-muted/20">
      <div className="flex items-center">
        {showLanguageSelector ? (
          <LanguageSelector
            availableLanguages={availableLanguages}
            onLanguageChange={onLanguageChange}
            pyodideStatus={pyodideStatus}
          />
        ) : (
          <span className="font-medium text-sm">{languageLabel}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <RunButton
          isRunning={isRunning}
          readOnly={readOnly}
          onRunCode={onRunCode}
          isPythonSelected={isPythonSelected}
          pyodideStatus={pyodideStatus}
        />
        {onSubmitCode && (
          <SubmitButton isRunning={isRunning} readOnly={readOnly} onSubmit={onSubmitCode} />
        )}
      </div>
    </div>
  )
}
