'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Send } from 'lucide-react'
import { useFooterStore } from '@/core/compiler/code-editor/store/footer-store'
import { useSubmitCode } from '../submissions/hooks/use-submit-code'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { transformFileTreeToExecutionStructure } from '@/core/compiler/utils/file-structure'
import { useChallenge } from '../contexts/challenge-context'
import { useSubmissionResultsStore } from '../submissions/store/submission-results-store'
import { Exercice } from '@/payload-types'
import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { dispatch } from '@/core/events'
import {
  getCompletionStatus,
  isSolutionUnlocked,
} from '@/core/challenges/user-progression/completion-status'
import { addExperience } from '@/core/gamification/level'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { useUser } from '@/core/users/contexts/user-context'
import { useQuestActions } from '@/core/gamification/quests/hooks/use-quests'
import { useQueryClient } from '@tanstack/react-query'
import { useChallengeUIStore } from '../stores/challenge-ui-store'
import { getQueryKey } from '../navigation/hooks/use-challenge-tabs-lock-status'

const LoadingIcon = ({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: React.ReactNode
}) => {
  return isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : children
}

export const SubmitButton = () => {
  const { challenge } = useChallenge()
  const { user } = useUser()
  const { fileTree } = useEditorStore()
  const queryClient = useQueryClient()
  const { progressQuest } = useQuestActions()
  // Le déblocage des onglets se fait maintenant via les dialogs de confirmation

  const { setActiveTab, openPanel } = useFooterStore()
  const { submitCode, isLoadingSubmit } = useSubmitCode()
  const { setInProgress, setCompleted, status } = useChallengeUserStatus(challenge.id, user.id)

  const { setSubmissionResult, setTestResults, setIsSubmitting, clearResults } =
    useSubmissionResultsStore()
  const { openCompletionDialog } = useChallengeUIStore()

  const handleSubmit = async () => {
    try {
      setActiveTab('tests')
      openPanel()
      setIsSubmitting(true)
      clearResults()

      const executionStructure = transformFileTreeToExecutionStructure(fileTree)

      const { submission, testResults } = await submitCode({
        code: { type: 'structure', fileStructure: executionStructure },
        testCases: (challenge.exercice?.value as Exercice).languages[0].testCases.map(
          (testCase) => ({
            input: { type: 'single', code: testCase.input, language: 'python' },
            expectedOutput: {
              type: 'single',
              code: testCase.expectedOutput ?? '',
              language: 'python',
            },
          }),
        ),
      })

      setSubmissionResult(submission)
      setTestResults(testResults)

      await setInProgress()

      console.log(submission)
      if (submission.testsPassed === testResults.length) {
        const isAlreadyCompleted =
          (await getCompletionStatus(user.id, challenge.id)) === 'completed'

        await setCompleted()

        if (!isAlreadyCompleted) {
          // openCompletionDialog()
          openCompletionDialog()
          queryClient.invalidateQueries({
            queryKey: getQueryKey(challenge.id, user.id, challenge.slug),
          })
          progressQuest({ eventType: 'challengesCompleted', userId: user.id })

          const solutionUnlocked = await isSolutionUnlocked(user.id, challenge.id)

          const gamificationPromises: Promise<any>[] = [
            trackAchievementProgress(user.id, 'challenges_completed', 1),
            // updateStreak.mutateAsync(),
            // addCurrency(userId, currencyOnCompletion, 'Challenge completion'),
          ]

          if (!solutionUnlocked) {
            gamificationPromises.push(addExperience(user.id, challenge.baseExperience ?? 50))
          }

          // On n'a plus besoin de récupérer le résultat ici
          await Promise.all(gamificationPromises)

          // Invalider le cache pour que les onglets se mettent à jour
        }
      }

      // await dispatch('challenge.completed', { challengeId: challenge.id, userId: user.id })
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="h-8"
      id="challenge-submit-button"
      onClick={handleSubmit}
    >
      <LoadingIcon isLoading={isLoadingSubmit}>
        <Send size={14} className="mr-1" />
      </LoadingIcon>
      Submit
    </Button>
  )
}
