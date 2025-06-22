'use client'

import { Button } from '@/components/ui/button'
import {
  getCompletionStatus,
  isSolutionUnlocked,
} from '@/core/challenges/user-progression/completion-status'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { addExperience } from '@/core/gamification/level'
import { handleChallengeCompletionForQuests } from '@/core/gamification/quests/actions'
import { Loader2, Send } from 'lucide-react'

import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { useChallengeSubmissions } from '@/core/challenges/submissions/hooks/use-challenge-submissions'
import { useChallengeEditorStore } from '../store'
import { useSubmitCode } from '../../hooks/use-submit-code'
import { useQueryClient } from '@tanstack/react-query'
import { solutionQueryKeys } from '@/core/challenges/hooks/use-solution-queries'

const LoadingIcon = ({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: React.ReactNode
}) => {
  return isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : children
}

const PureSubmitButton = ({
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

export const SubmitButton = ({
  challenge,
  userId,
}: {
  challenge: {
    id: number
    baseExperience?: number | null
  }
  userId: string
}) => {
  const {
    setActiveTerminalTab,
    isTerminalOpen,
    toggleTerminal,
    codeByLanguage,
    currentLanguage,
    availableLanguages,
    setTestResults,
    openCompletionDialog,
    setIsLoadingSubmit,
  } = useChallengeEditorStore()
  const { submitCode: submitCodeHook, isLoadingSubmit } = useSubmitCode()
  const { setInProgress, setCompleted, status } = useChallengeUserStatus(challenge.id)
  const { createSubmission } = useChallengeSubmissions(challenge.id)
  const queryClient = useQueryClient()

  const handleSubmit = async () => {
    setIsLoadingSubmit(true)
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
    setIsLoadingSubmit(false)
    setTestResults(testResults)
    createSubmission(submission)

    if (submission.testsPassed === testCases.length) {
      if (!((await getCompletionStatus(userId, challenge.id)) === 'completed')) {
        openCompletionDialog()

        if (!(await isSolutionUnlocked(userId, challenge.id))) {
          await addExperience(userId, challenge.baseExperience ?? 50)
        }

        await handleChallengeCompletionForQuests(userId)

        await trackAchievementProgress(userId, 'challenges_completed', 1)
      }

      await setCompleted()
      queryClient.invalidateQueries({
        queryKey: solutionQueryKeys.solutionUnlock(userId, challenge.id),
      })
    } else if (status === 'not_started' && submission.testsPassed < testCases.length) {
      setInProgress()
    }
  }

  return (
    <PureSubmitButton onSubmit={handleSubmit} isSubmitting={isLoadingSubmit} isDisabled={false} />
  )
}
