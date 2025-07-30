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
import { getCoursePartCompletionStatus } from '../../progression'
import { toast } from '../../progression/components/part-completion-toast'
import { useCoursePartUserStatus } from '../../progression/hooks/use-course-part-completion-status'
import { useSubmissionStore } from '../stores/submissions-store'

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

  const { setInProgress, setCompleted } = useCoursePartUserStatus(coursePart.id, user.id)

  const { setSubmissionResult, setTestResults, setIsSubmitting, clearResults } =
    useSubmissionStore()

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

    await setInProgress()

        console.log(submission)
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
        toast({
          name: coursePart.name,
          difficulty: coursePart.difficulty,
        })
        await setCompleted()

        queryClient.invalidateQueries({
          queryKey: getQueryKey(coursePart.id, user.id, coursePart.slug),
        })
      }
    }

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
