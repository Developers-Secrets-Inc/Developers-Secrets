'use client'

import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useFooterStore } from '@/core/compiler/code-editor/store/footer-store'
import { useSubmit } from '@/core/compiler/submissions/hooks/use-submit'
import { transformFileTreeToExecutionStructure } from '@/core/compiler/utils/file-structure'
import { useUser } from '@/core/users/contexts/user-context'
import { isNone } from '@/lib/maybe'
import { Exercice } from '@/payload-types'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { useCoursePart } from '../../contexts/course-part-context'
import { getQueryKey } from '../../navigation/hooks/use-course-part-lock-status'
import { getCoursePartCompletionStatus, setCoursePartCompletionStatus } from '../../progression'
import { toast } from '../../progression/components/part-completion-toast'
import { useCoursePartUserStatus } from '../../progression/hooks/use-course-part-completion-status'
import { useSubmissionStore } from '../stores/submissions-store'
import { useQuestActions } from '@/core/gamification/quests/hooks/use-quests'
import { isSolutionUnlocked } from '../../progression/solution'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { addExperience } from '@/core/gamification/level'
import { useRevalidateChapterProgression } from '../../progression/hooks/useRevalidateChapterProgression'

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
  const { coursePart, metadata } = useCoursePart()
  const { user } = useUser()
  const queryClient = useQueryClient()

  const { setActiveTab, openPanel } = useFooterStore()
  const { submit, isLoading } = useSubmit()
  const { fileTree } = useEditorStore()

  const { revalidate } = useRevalidateChapterProgression();

  const { setSubmissionResult, setTestResults, setIsSubmitting, clearResults } =
    useSubmissionStore()

      const { progressQuest } = useQuestActions()


  const handleSubmit = async () => {
    setActiveTab('tests')
    openPanel()
    setIsSubmitting(true)
    clearResults()

    const executionStructure = transformFileTreeToExecutionStructure(fileTree)

    // We need a global submission config, where nothing is linked to the database and then a specific logic to mutate course part submissions

    const { submission, testResults } = await submit({
      code: { type: 'structure', fileStructure: executionStructure },
      testCases: (coursePart.exercice?.value as Exercice).languages[0].testCases.map(
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

    await setCoursePartCompletionStatus({
      partId: coursePart.id,
      userId: user.id,
      newStatus: 'in_progress',
    })

    
    if (submission.testsPassed === testResults.length) {

      // This create more initial load, we need to find a secure way to improve it.
      const currentCompletionStatus = await getCoursePartCompletionStatus({
        userId: user.id,
        partId: coursePart.id,
      })

      const isAlreadyCompleted = isNone(currentCompletionStatus)
        ? false
        : currentCompletionStatus.value.completionStatus === 'completed'
          ? true
          : false


      if (!isAlreadyCompleted) {
          const solutionUnlockedResult = await isSolutionUnlocked({partId: coursePart.id, userId: user.id})
          const solutionAlreadyUnlocked = !isNone(solutionUnlockedResult) && solutionUnlockedResult.value.isSolutionUnlocked

        toast({
            name: coursePart.name,
            difficulty: coursePart.difficulty,
            solutionAlreadyUnlocked,
          })
          
        await setCoursePartCompletionStatus({
          partId: coursePart.id,
          userId: user.id,
          newStatus: 'completed',
        })

        queryClient.invalidateQueries({
          queryKey: getQueryKey(coursePart.id, user.id, coursePart.slug),
        })
        


          // Most of this code should not be located here, this component has way too much responsibility. 
          // But we need to find a way to create an event system that is handled on the client but can perform 
          // secure server actions. 

          // For exemple, quest progress needs to be on the client to reflect live changes (should it really ?)
          // Should we have client mutations like this ? Because we can just use revalidation on focus.
          
          // Current quest data (which is not from the server to avoid more load)

          progressQuest({ eventType: 'challengesCompleted', userId: user.id })


          const difficultyMultiplier = {
            easy: 50,
            medium: 100,
            hard: 150,
            horrible: 200,
          }

          const gamificationPromises: Promise<any>[] = [
            trackAchievementProgress(user.id, 'challenges_completed', 1),
            // updateStreak.mutateAsync(),
            // addCurrency(userId, currencyOnCompletion, 'Challenge completion'),
          ]

          if (!solutionAlreadyUnlocked) {
            gamificationPromises.push(addExperience(user.id, difficultyMultiplier[coursePart.difficulty] ?? 50))
          }

          // On n'a plus besoin de récupérer le résultat ici
          await Promise.all(gamificationPromises)
      }
    }


    console.log('yo')
    queryClient.invalidateQueries({
      queryKey: ['coursePartStatus', user.id, coursePart.id],
    });
    revalidate(metadata.chapterSlug, user.id)
    console.log("yea")
    setIsSubmitting(false)
    
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="h-8"
      id="challenge-submit-button"
      onClick={handleSubmit}
    >
      <LoadingIcon isLoading={isLoading}>
        <Send size={14} className="mr-1" />
      </LoadingIcon>
      Submit
    </Button>
  )
}
