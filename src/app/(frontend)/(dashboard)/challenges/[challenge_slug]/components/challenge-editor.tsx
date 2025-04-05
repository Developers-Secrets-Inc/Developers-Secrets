'use client'

import { useState } from 'react'
import { CodeEditor } from '@/core/compiler/components/editor'
import { handleSubmission } from '@/core/challenges/submissions/client-actions'
import { handleChallengeCompletion } from '@/core/challenges/actions'
import {
  WrongAnswerSubmission,
  TimeLimitExceededSubmission,
  RunTimeErrorSubmission,
  AcceptedSubmission,
} from '@/core/challenges/submissions/index.client'
import { ChallengeCompletionDialog } from '@/components/challenges/challenge-completion-dialog'
import { getUserCompletionStatus } from '@/core/challenges/user-progression'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'

type ChallengeEditorProps = {
  initialCode: string
  language: string
  availableLanguages: {
    value: string
    label: string
  }[]
  codeVersions: Record<string, string>
  tests: Record<string, { input: string; expectedOutput: string }[]>
  challengeId: number
  userId: string
}

export function ChallengeEditor({
  initialCode,
  language,
  availableLanguages,
  codeVersions,
  tests,
  challengeId,
  userId,
}: ChallengeEditorProps) {
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  const handleSubmit = async (
    submission:
      | AcceptedSubmission
      | RunTimeErrorSubmission
      | WrongAnswerSubmission
      | TimeLimitExceededSubmission,
  ) => {
    try {
      // Créer un ID temporaire
      const tempId = nanoid()

      // Créer une soumission temporaire
      const tempSubmission = {
        id: tempId,
        submissionType: submission.type,
        testsPassed: submission.testsPassed,
        testsTotal: submission.testsTotal,
        createdAt: new Date().toISOString(),
        code: submission.code,
      }

      // Ajouter la soumission temporaire à la liste
      window.addTempSubmission(tempSubmission)

      // Envoyer la soumission au serveur
      const result = await handleSubmission(submission, challengeId, userId)

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to submit')
      }

      // Mettre à jour la soumission avec les données du serveur
      window.updateSubmission(tempId, {
        id: result.data.id.toString(),
        submissionType: result.data.submissionType,
        testsPassed: result.data.testsPassed,
        testsTotal: result.data.testsTotal,
        createdAt: result.data.createdAt,
        code: result.data.code,
      })

      // If the submission is successful and all tests passed
      if (submission.type === 'accepted') {
        // Check if the challenge is not already completed
        const completionStatus = await getUserCompletionStatus(userId, challengeId)

        if (completionStatus !== 'completed') {
          // Show completion dialog immediately (optimistic UI)
          setShowCompletionDialog(true)

          // Handle challenge completion in the background
          handleChallengeCompletion(challengeId, userId).catch(console.error)
        }
      }
    } catch (error) {
      console.error('Error submitting code:', error)
      toast.error('Failed to submit code. Please try again.')
    }
  }

  return (
    <>
      <CodeEditor
        initialCode={initialCode}
        language={language}
        showLanguageSelector={true}
        availableLanguages={availableLanguages}
        codeVersions={codeVersions}
        tests={tests}
        onSubmit={handleSubmit}
      />

      <ChallengeCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        challengeId={challengeId}
        userId={userId}
      />
    </>
  )
}
