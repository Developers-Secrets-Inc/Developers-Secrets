import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Play } from 'lucide-react'

type ProgrammingLanguage = {
  value: string
  label: string
}

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

const PyodideLoadingStatus = ({
  pyodideStatus,
}: {
  pyodideStatus: 'loading' | 'loaded' | 'error' | 'uninitialized'
}) => {
  return (
    <div className="text-xs flex items-center">
      {pyodideStatus === 'loading' && (
        <>
          <Loader2 size={12} className="animate-spin mr-1" />
          <span className="text-yellow-500">Loading Python...</span>
        </>
      )}
      {pyodideStatus === 'error' && <span className="text-red-500">Python load failed</span>}
      {pyodideStatus === 'uninitialized' && (
        <span className="text-gray-500">Python not initialized</span>
      )}
    </div>
  )
}

const LanguageSelector = ({
  currentLanguage,
  availableLanguages,
  onLanguageChange,
  pyodideStatus,
}: {
  currentLanguage: string
  availableLanguages: ProgrammingLanguage[]
  onLanguageChange: (value: string) => void
  pyodideStatus: 'loading' | 'loaded' | 'error' | 'uninitialized'
}) => {
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
  return (
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
  )
}

export const EditorHeader = ({
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

  return (
    <div className="border-b flex items-center justify-between px-3 py-2 bg-muted/20">
      <div className="flex items-center">
        {showLanguageSelector ? (
          <LanguageSelector
            currentLanguage={currentLanguage}
            availableLanguages={availableLanguages}
            onLanguageChange={onLanguageChange}
            pyodideStatus={pyodideStatus}
          />
        ) : (
          <span className="font-medium text-sm">{languageLabel}</span>
        )}
      </div>

      <div className="flex items-center">
        <RunButton
          isRunning={isRunning}
          readOnly={readOnly}
          onRunCode={onRunCode}
          isPythonSelected={isPythonSelected}
          pyodideStatus={pyodideStatus}
        />
      </div>
    </div>
  )
}
