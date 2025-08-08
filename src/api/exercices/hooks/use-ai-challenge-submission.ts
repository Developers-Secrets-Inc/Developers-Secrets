'use client'

import { useChallenge } from '@/api/challenges/contexts/challenge-context'
import { getQueryKey } from '@/api/challenges/navigation/hooks/use-challenge-tabs-lock-status'
import { useChallengeUIStore } from '@/api/challenges/stores/challenge-ui-store'
import { SubmitCodeInput, useSubmitCode } from '@/api/challenges/submissions/hooks/use-submit-code'
import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import {
  getCompletionStatus,
  isSolutionUnlocked,
} from '@/core/challenges/user-progression/completion-status'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useFooterStore } from '@/core/compiler/code-editor/store/footer-store'
import { transformFileTreeToExecutionStructure } from '@/core/compiler/utils/file-structure'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { addExperience } from '@/core/gamification/level'
import { useQuestActions } from '@/core/gamification/quests/hooks/use-quests'
import { useUser } from '@/core/users/contexts/user-context'
import { AiExercice, Challenge, Exercice } from '@/payload-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { evaluatePrompt } from '../ai'
import { useAiEvaluationStore } from '../ai/store/ai-evaluation-store'

const getTestCases = (
  exercice: Exercice | AiExercice | null | undefined | number,
): {
  input: SubmitCodeInput
  expectedOutput: SubmitCodeInput
}[] => {
  return (exercice as Exercice).languages[0].testCases.map((testCase) => ({
    input: { type: 'single', code: testCase.input, language: 'python' },
    expectedOutput: {
      type: 'single',
      code: testCase.expectedOutput ?? '',
      language: 'python',
    },
  }))
}

export const useAIChallengeSubmission = () => {
  const { challenge } = useChallenge()

  if (!(challenge.exercice?.relationTo === 'ai-exercices')) {
    throw new Error()
  }

  const exercice = challenge.exercice?.value

  const { user } = useUser()
  const { fileTree } = useEditorStore()
  const queryClient = useQueryClient()
  const { progressQuest } = useQuestActions()
  // Le déblocage des onglets se fait maintenant via les dialogs de confirmation

  const { setActiveTab, openPanel } = useFooterStore()
  const { submitCode, isLoadingSubmit } = useSubmitCode()
  const { setInProgress, setCompleted, status } = useChallengeUserStatus(challenge.id, user.id)

  const {
    setSubmissionResult,
    setTestResults,
    setIsSubmitting,
    clearResults,
    setAiAndSubmissionResults,
    startCompilation,
    startEvaluation,
    completeEvaluation,
  } = useAiEvaluationStore()
  const { openCompletionDialog } = useChallengeUIStore()


  // 1. Submit code with tests to check if it is correct. 
  // 2. If the code is correct, evaluate each prompt. 
  // 3. Based on the result of those evaluation, define if the challenge is completed.

  // So we need a server action that check everything and return a final result for the client 
  // to know if the code is the challenge is completed or not to update the UI.
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        setActiveTab('tests')
        openPanel()
        setIsSubmitting(true)
        clearResults()
        startCompilation()

        const executionStructure = transformFileTreeToExecutionStructure(fileTree)

        // We still use a client compilation, which is not secure. Need to change it with E2B
        // for secure server compilation. Also, 'submit' is not the correct term, it should be linked
        // to only 'testing' the code, because that is what it does.

        const { submission, testResults } = await submitCode({
          code: { type: 'structure', fileStructure: executionStructure },
          testCases: getTestCases(challenge.exercice?.value),
        })

        setSubmissionResult(submission)
        setTestResults(testResults)

        await setInProgress()

        if (submission.testsPassed === testResults.length) {
          startEvaluation()
          const promptsResults = await Promise.all(
            ((exercice as AiExercice).prompts || []).map(
              async (prompt) => await evaluatePrompt({ prompt: prompt.content, fileTree }),
            ),
          )

          const successfulAiEvaluations = promptsResults.filter(
            (result) => result.score >= 3,
          ).length
          const totalAiEvaluations = promptsResults.length
          const aiSuccessPercentage =
            totalAiEvaluations > 0 ? (successfulAiEvaluations / totalAiEvaluations) * 100 : 0

          setAiAndSubmissionResults(promptsResults, submission, testResults)

          if (aiSuccessPercentage >= 30) {
            const isAlreadyCompleted =
              (await getCompletionStatus(user.id, challenge.id)) === 'completed'

            await setCompleted()

            if (!isAlreadyCompleted) {
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
        }
      } catch (error) {
        console.error('Submission error:', error)
      } finally {
        completeEvaluation()
      }
    },
  })

  return {
    submit: mutation.mutate,
    isLoading: mutation.isPending,
  }
}
