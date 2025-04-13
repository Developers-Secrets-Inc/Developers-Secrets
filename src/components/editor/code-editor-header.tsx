import { Button } from '@/components/ui/button'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '@radix-ui/react-select'
import { Loader2, Play } from 'lucide-react'

// ==============================
// Types
// ==============================

type ProgrammingLanguage = {
  value: string
  label: string
}

type PythonStatus = 'loading' | 'error' | 'uninitialized' | 'loaded'

type CodeEditorHeaderProps = {
  currentLanguage: string
  showLanguageSelector: boolean
  availableLanguages: ProgrammingLanguage[]
  isRunning: boolean
  readOnly: boolean
  onLanguageChange: (value: string) => void
  onRunCode: () => void
  pyodideStatus: PythonStatus
}

type RunCodeButtonProps = {
  isDisabled: boolean
  isRunning: boolean
  onRunCode: () => void
}

type PythonStatusProps = {
  pyodideStatus: PythonStatus
}

type LanguageSelectorProps = {
  currentLanguage: string
  availableLanguages: ProgrammingLanguage[]
  onLanguageChange: (value: string) => void
}

type LanguageDisplayProps = {
  languageName: string
}

type LanguageSectionProps = {
  currentLanguage: string
  showLanguageSelector: boolean
  availableLanguages: ProgrammingLanguage[]
  onLanguageChange: (value: string) => void
  pyodideStatus: PythonStatus
}

// ==============================
// Utilities
// ==============================

const capitalizeString = (languageName: string): string => {
  return languageName.charAt(0).toUpperCase() + languageName.slice(1)
}

// ==============================
// Sub-components
// ==============================

/**
 * Component for displaying Python loading state
 */
const LoadingPython = () => (
  <div className="flex items-center">
    <Loader2 size={12} className="animate-spin mr-1" />
    <span className="text-yellow-500">Loading Python...</span>
  </div>
)

/**
 * Component for displaying error messages
 */
const StatusMessage = ({ text, color }: { text: string; color: string }) => (
  <span className={color}>{text}</span>
)

const PythonStatus = ({ pyodideStatus }: PythonStatusProps) => {
  const status: Record<PythonStatus, React.ReactNode> = {
    loading: <LoadingPython />,
    error: <StatusMessage text="Python load failed" color="text-red-500" />,
    uninitialized: <StatusMessage text="Python not initialized" color="text-gray-500" />,
    loaded: null,
  }

  return <div className="text-xs flex items-center">{status[pyodideStatus]}</div>
}

const RunningButton = () => (
  <>
    <Loader2 size={14} className="mr-1 animate-spin" />
    Running...
  </>
)

const RunButton = () => (
  <>
    <Play size={14} className="mr-1" />
    Run
  </>
)

const RunCodeButton = ({ isDisabled, isRunning, onRunCode }: RunCodeButtonProps) => {
  return (
    <Button variant="default" size="sm" className="h-8" onClick={onRunCode} disabled={isDisabled}>
      {isRunning ? <RunningButton /> : <RunButton />}
    </Button>
  )
}

/**
 * Language selector dropdown
 */
const LanguageSelector = ({
  currentLanguage,
  availableLanguages,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
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
  )
}

/**
 * Simple display of language name when selector is not shown
 */
const LanguageDisplay = ({ languageName }: LanguageDisplayProps) => {
  return <span className="font-medium text-sm">{languageName}</span>
}

/**
 * Section that handles language selection or display
 */
const LanguageSection = ({
  currentLanguage,
  showLanguageSelector,
  availableLanguages,
  onLanguageChange,
  pyodideStatus,
}: LanguageSectionProps) => {
  const languageLabel = capitalizeString(currentLanguage)
  const isPythonSelected = currentLanguage === 'python'
  const showPythonStatus = isPythonSelected && pyodideStatus !== 'loaded'

  if (!showLanguageSelector) {
    return <LanguageDisplay languageName={languageLabel} />
  }

  return (
    <div className="flex items-center gap-2">
      <LanguageSelector
        currentLanguage={currentLanguage}
        availableLanguages={availableLanguages}
        onLanguageChange={onLanguageChange}
      />
      {showPythonStatus && <PythonStatus pyodideStatus={pyodideStatus} />}
    </div>
  )
}

// ==============================
// Main Component
// ==============================

/**
 * Header component for code editor with language selector and run button
 */
export const CodeEditorHeader = (props: CodeEditorHeaderProps) => {
  const {
    currentLanguage,
    showLanguageSelector,
    availableLanguages,
    isRunning,
    readOnly,
    onLanguageChange,
    onRunCode,
    pyodideStatus,
  } = props

  const isPythonSelected = currentLanguage === 'python'
  const isDisabled = isRunning || readOnly || (isPythonSelected && pyodideStatus !== 'loaded')

  return (
    <div className="border-b flex items-center justify-between px-3 h-12 bg-muted/20">
      <div className="flex items-center">
        <LanguageSection
          currentLanguage={currentLanguage}
          showLanguageSelector={showLanguageSelector}
          availableLanguages={availableLanguages}
          onLanguageChange={onLanguageChange}
          pyodideStatus={pyodideStatus}
        />
      </div>

      <div className="flex items-center">
        <RunCodeButton isRunning={isRunning} onRunCode={onRunCode} isDisabled={isDisabled} />
      </div>
    </div>
  )
}
