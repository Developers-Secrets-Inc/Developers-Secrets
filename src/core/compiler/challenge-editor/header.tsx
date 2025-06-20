'use client'

import { Button } from '@/components/ui/button'
import { Play, Send, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChallengeEditorStore } from './store'

type CodeFunction = () => void

export const LanguageSelector = () => {
  const { currentLanguage, availableLanguages, changeLanguage } = useChallengeEditorStore()

  if (availableLanguages.length === 1) {
    return <span className="font-medium text-sm">{availableLanguages[0].label}</span>
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentLanguage} onValueChange={changeLanguage}>
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

      {/* {showPythonStatus && <PyodideLoadingStatus pyodideStatus={pyodideStatus} />} */}
    </div>
  )
}

const LoadingIcon = ({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: React.ReactNode
}) => {
  return isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : children
}

export const RunButton = ({
  onRun,
  isRunning,
  isDisabled,
}: {
  onRun?: CodeFunction
  isRunning: boolean
  isDisabled: boolean
}) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8"
      onClick={onRun}
      disabled={isRunning || isDisabled}
    >
      <LoadingIcon isLoading={isRunning}>
        <Play size={14} className="mr-1" />
      </LoadingIcon>
      Run
    </Button>
  )
}

export const SubmitButton = ({
  onSubmit,
  isSubmitting,
  isDisabled,
}: {
  onSubmit: () => void
  isSubmitting: boolean
  isDisabled: boolean
}) => {
  return (
    <Button
      variant="default"
      size="sm"
      className="h-8"
      onClick={onSubmit}
      disabled={isSubmitting || isDisabled}
    >
      <LoadingIcon isLoading={isSubmitting}>
        <Send size={14} className="mr-1" />
      </LoadingIcon>
      Submit
    </Button>
  )
}

export const ChallengeIDEHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b flex items-center justify-between px-3 py-2 bg-muted/20">
      {children}
    </div>
  )
}

export const ChallengeIDEHeaderLeftPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center">{children}</div>
}

export const ChallengeIDEHeaderRightPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>
}
