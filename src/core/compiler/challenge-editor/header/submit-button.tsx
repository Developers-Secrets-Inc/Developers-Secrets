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
import { useQueryClient } from '@tanstack/react-query'
import { useSubmitCode } from '../../hooks/use-submit-code'
import { useChallengeEditorStore } from '../store'
import { updateChallengeStreak } from '@/core/gamification/streaks/challenges'
import { useChallengeStreak } from '@/core/gamification/streaks/challenges/hooks/use-challenge-streak'
import { addCurrency } from '@/core/gamification/marketplace/currency'
import { useChallengeStore } from '@/core/challenges/store'

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
    setTestResults,
    openCompletionDialog,
    setIsLoadingSubmit,
  } = useChallengeEditorStore()
  const { submitCode: submitCodeHook, isLoadingSubmit } = useSubmitCode()
  const { setInProgress, setCompleted, status } = useChallengeUserStatus(challenge.id)
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

    const result = await submitCodeHook({
      userId,
      challengeId: challenge.id,
      code,
      language: currentLanguage,
    })

    setIsLoadingSubmit(false)

    if (result) {
      // The server now returns detailed test results.
      // We adapt the shape for the UI if necessary, but here we assume it's compatible.
      // E2BTestResult has { success, input, expectedOutput, actualOutput }
      setTestResults(result.testResults)

      if (result.compilationResult.success) {
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

          await Promise.all(gamificationPromises)
        }

        await setCompleted()
        queryClient.invalidateQueries({
          queryKey: solutionQueryKeys.solutionUnlock(userId, challenge.id),
        })
      } else if (status === 'not_started') {
        setInProgress()
      }
    } else {
      // Handle potential submission error from the hook
      setTestResults([
        {
          success: false,
          input: 'N/A',
          expectedOutput: 'N/A',
          actualOutput: 'Submission failed. Please check the console for errors.',
        },
      ])
    }
  }

  return (
    <PureSubmitButton onSubmit={handleSubmit} isSubmitting={isLoadingSubmit} isDisabled={false} />
  )
}
