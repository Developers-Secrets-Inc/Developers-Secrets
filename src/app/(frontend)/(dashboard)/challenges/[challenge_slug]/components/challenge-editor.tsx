'use client'

import { useState } from 'react'
import { CodeEditor } from '@/core/compiler/components/editor'
import { handleSubmission } from '@/core/challenges/submissions/actions'
import { handleChallengeCompletion } from '@/core/challenges/actions'
import {
  WrongAnswerSubmission,
  TimeLimitExceededSubmission,
  RunTimeErrorSubmission,
  AcceptedSubmission,
} from '@/core/challenges/submissions/index.client'
import { ChallengeCompletionDialog } from '@/components/challenges/challenge-completion-dialog'
import { getUserCompletionStatus } from '@/core/challenges/user-progression'

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
    // First, handle the submission as usual
    await handleSubmission(submission, challengeId, userId)

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
