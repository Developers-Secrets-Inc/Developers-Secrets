'use client'

import { Button } from '@/components/ui/button'
import {
  getCompletionStatus,
  isSolutionUnlocked,
} from '@/core/challenges/user-progression/completion-status'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { addExperience } from '@/core/gamification/level'
import { useQuestActions } from '@/core/gamification/quests/hooks/use-quests'
import { Loader2, Send } from 'lucide-react'

import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { solutionQueryKeys } from '@/core/challenges/hooks/use-solution-queries'
import { useChallengeSubmissions } from '@/core/challenges/submissions/hooks/use-challenge-submissions'
import { useQueryClient } from '@tanstack/react-query'
import { useSubmitCode } from '../../hooks/use-submit-code'
import { useChallengeEditorStore } from '../store'
import { updateChallengeStreak } from '@/core/gamification/streaks/challenges'
import { useChallengeStreak } from '@/core/gamification/streaks/challenges/hooks/use-challenge-streak'
import { addCurrency } from '@/core/gamification/marketplace/currency'
import { useChallengeStore } from '@/core/challenges/store'
import { dispatch } from '@/core/events'

// Map icon names to actual LucideIcon components
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
      id="challenge-submit-button"
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
  const { progressQuest } = useQuestActions()
  const queryClient = useQueryClient()
  const { updateStreak } = useChallengeStreak(userId)
  const { currencyOnCompletion } = useChallengeStore()

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
      const isAlreadyCompleted = (await getCompletionStatus(userId, challenge.id)) === 'completed'

      if (!isAlreadyCompleted) {
        openCompletionDialog()

        progressQuest({ eventType: 'challengesCompleted', userId })

        const solutionUnlocked = await isSolutionUnlocked(userId, challenge.id)

        const gamificationPromises: Promise<any>[] = [
          trackAchievementProgress(userId, 'challenges_completed', 1),
          updateStreak.mutateAsync(),
          addCurrency(userId, currencyOnCompletion, 'Challenge completion'),
        ]

        if (!solutionUnlocked) {
          gamificationPromises.push(addExperience(userId, challenge.baseExperience ?? 50))
        }

        // On n'a plus besoin de récupérer le résultat ici
        await Promise.all(gamificationPromises)
      }

      await setCompleted()
      await dispatch('challenge.completed', { challengeId: challenge.id, userId: userId })
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
