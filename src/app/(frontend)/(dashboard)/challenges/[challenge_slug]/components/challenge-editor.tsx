'use client'

import { ChallengeCompletionDialog } from '@/components/challenges/challenge-completion-dialog'
import { handleChallengeCompletion } from '@/core/challenges/actions'
import { ChallengeStatusContext } from '@/core/challenges/components/challenge-status-provider'
import { handleSubmission } from '@/core/challenges/submissions/client-actions'
import {
  AcceptedSubmission,
  RunTimeErrorSubmission,
  TimeLimitExceededSubmission,
  WrongAnswerSubmission,
} from '@/core/challenges/submissions/index.client'
import { CodeEditor } from '@/core/compiler/components/editor'
import { Challenge } from '@/payload-types'
import { nanoid } from 'nanoid'
import { useContext, useState } from 'react'
import { toast } from 'sonner'

type ChallengeEditorProps = {
  initialCode: string
  language: string
  availableLanguages: {
    value: string
    label: string
  }[]
  codeVersions: Record<string, string>
  tests: Record<string, { input: string; expectedOutput: string }[]>
  challenge: Challenge
  userId: string
}

export function ChallengeEditor({
  initialCode,
  language,
  availableLanguages,
  codeVersions,
  tests,
  challenge,
  userId,
}: ChallengeEditorProps) {
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const { status, updateStatus } = useContext(ChallengeStatusContext)!

  const handleSubmit = async (
    submission:
      | AcceptedSubmission
      | RunTimeErrorSubmission
      | WrongAnswerSubmission
      | TimeLimitExceededSubmission,
  ) => {
    try {
      // Si c'est la première soumission et que le statut est 'not_started'
      if (status === 'not_started') {
        await updateStatus('in_progress')
      }

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
      if (typeof window.addTempSubmission === 'function') {
        window.addTempSubmission(tempSubmission)
      } else {
        console.warn('addTempSubmission not available - skipping optimistic update')
      }

      // Envoyer la soumission au serveur
      const result = await handleSubmission(submission, challenge.id, userId)

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to submit')
      }

      // Mettre à jour la soumission avec les données du serveur
      if (typeof window.updateSubmission === 'function') {
        window.updateSubmission(tempId, {
          id: result.data.id.toString(),
          submissionType: result.data.submissionType,
          testsPassed: result.data.testsPassed,
          testsTotal: result.data.testsTotal,
          createdAt: result.data.createdAt,
          code: result.data.code,
        })
      } else {
        console.warn('updateSubmission not available - skipping optimistic update')
      }

      // If the submission is successful and all tests passed
      if (submission.type === 'accepted' && status !== 'completed') {
        // Show completion dialog immediately (optimistic UI)
        setShowCompletionDialog(true)

        // Update status to completed
        await updateStatus('completed')



        // Handle challenge completion in the background
        handleChallengeCompletion(challenge, userId).catch(console.error)
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
        showLanguageSelector={availableLanguages.length > 1}
        availableLanguages={availableLanguages}
        codeVersions={codeVersions}
        tests={tests}
        onSubmit={handleSubmit}
      />

      <ChallengeCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        challengeId={challenge.id}
        userId={userId}
      />
    </>
  )
}
