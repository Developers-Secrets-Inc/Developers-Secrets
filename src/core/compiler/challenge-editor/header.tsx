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
import { useRunCode } from '../hooks/use-run-code'
import { useSubmitCode } from '../hooks/use-submit-code'
import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { useChallengeSubmissions } from '@/core/challenges/submissions/hooks/use-challenge-submissions'
import { handleChallengeCompletion } from '@/core/challenges/actions'
import { Challenge } from '@/payload-types'

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

export const RunButton = ({ onRun }: { onRun?: CodeFunction }) => {
  const {
    currentLanguage,
    codeByLanguage,
    setActiveTerminalTab,
    toggleTerminal,
    setExecutionOutput,
    setIsLoadingRun,
    isTerminalOpen,
  } = useChallengeEditorStore()
  const { isLoadingRun, executionOutput, runCode: runCodeHook } = useRunCode()

  const handleRun = async () => {
    if (onRun) onRun()

    setActiveTerminalTab('output')
    if (!isTerminalOpen) {
      toggleTerminal()
    }

    const code = codeByLanguage[currentLanguage]
    setIsLoadingRun(true)
    await runCodeHook({ code, language: currentLanguage })
    setExecutionOutput(executionOutput)
    setIsLoadingRun(false)
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8"
      onClick={handleRun}
      disabled={isLoadingRun}
    >
      {isLoadingRun ? (
        <Loader2 size={14} className="mr-1 animate-spin" />
      ) : (
        <Play size={14} className="mr-1" />
      )}
      Run
    </Button>
  )
}

export const SubmitButton = ({
  challenge,
  userId,
  onSubmit,
}: {
  challenge: Challenge
  userId: string
  onSubmit?: CodeFunction
}) => {
  const {
    currentLanguage,
    codeByLanguage,
    availableLanguages,
    setTestResults,
    setActiveTerminalTab,
    toggleTerminal,
    isTerminalOpen,
    openCompletionDialog,
  } = useChallengeEditorStore()
  const { submitCode: submitCodeHook, isLoadingSubmit } = useSubmitCode()
  const { setInProgress, setCompleted, status } = useChallengeUserStatus(challenge.id)
  const { createSubmission } = useChallengeSubmissions(challenge.id)

  const handleSubmit = async () => {
    if (onSubmit) onSubmit()

    setActiveTerminalTab('tests')
    if (!isTerminalOpen) {
      toggleTerminal()
    }

    const code = codeByLanguage[currentLanguage]
    const languageConfig = availableLanguages.find((lang) => lang.value === currentLanguage)

    if (!languageConfig) {
      setTestResults([
        {
          success: false,
          input: '',
          expectedOutput: '',
          actualOutput: 'Error: No test cases found for this language',
        },
      ])
      return
    }

    const testCases = languageConfig.testCases.map((tc) => ({
      input: { content: tc.input, language: currentLanguage },
      expectedOutput: { content: tc.expectedOutput, language: currentLanguage },
    }))

    const { submission, testResults } = await submitCodeHook({
      code: { content: code, language: currentLanguage },
      testCases,
    })
    setTestResults(testResults)
    createSubmission(submission)

    if (submission.testsPassed === testCases.length) {
      setCompleted()
    } else if (status === 'not_started' && submission.testsPassed < testCases.length) {
      setInProgress()
    }

    openCompletionDialog()
    await handleChallengeCompletion(challenge, userId)
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="h-8"
      onClick={handleSubmit}
      disabled={isLoadingSubmit}
    >
      {isLoadingSubmit ? (
        <Loader2 size={14} className="mr-1 animate-spin" />
      ) : (
        <Send size={14} className="mr-1" />
      )}
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
