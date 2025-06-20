'use client'

import { CompletionDialog } from '@/core/challenges/components/completion-dialog.client'
import { handleChallengeCompletion } from '@/core/challenges/actions'
import { getChallengeCompletionData } from '@/core/challenges/actions'
import { getUserIsSolutionUnlocked } from '@/core/challenges/user-progression'
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
import { useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useChallengeEditor } from '@/core/challenges/contexts/challenge-editor-context'

type ChallengeEditorProps = {
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
  language,
  availableLanguages,
  codeVersions,
  tests,
  challenge,
  userId,
}: ChallengeEditorProps) {
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [completionData, setCompletionData] = useState<Awaited<
    ReturnType<typeof getChallengeCompletionData>
  > | null>(null)
  const { visualStatus, persistedStatus, updateVisualStatus, updatePersistedStatus } =
    useContext(ChallengeStatusContext)!

  const { currentCodeByLanguage, currentLanguage, setCurrentCode, setCurrentLanguage } =
    useChallengeEditor()

  useEffect(() => {
    if (language !== currentLanguage) {
      setCurrentLanguage(language)
    }
  }, [language, currentLanguage, setCurrentLanguage])

  useEffect(() => {
    const preloadCompletionData = async () => {
      try {
        const data = await getChallengeCompletionData(userId, challenge.id, challenge.slug)
        setCompletionData(data)
      } catch (error) {
        console.error('Error preloading completion data:', error)
      }
    }
    preloadCompletionData()
  }, [userId, challenge.id, challenge.slug])

  const handleSubmit = async (
    submission:
      | AcceptedSubmission
      | RunTimeErrorSubmission
      | WrongAnswerSubmission
      | TimeLimitExceededSubmission,
  ) => {
    try {
      if (persistedStatus === 'not_started') {
        await updatePersistedStatus('in_progress')
      }

      const tempId = nanoid()
      const tempSubmission = {
        id: tempId,
        submissionType: submission.type,
        testsPassed: submission.testsPassed,
        testsTotal: submission.testsTotal,
        createdAt: new Date().toISOString(),
        code: submission.code,
      }
      if (typeof window.addTempSubmission === 'function') {
        window.addTempSubmission(tempSubmission)
      } else {
        console.warn('addTempSubmission not available - skipping optimistic update')
      }

      const result = await handleSubmission(submission, challenge.id, userId)

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to submit')
      }

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

      if (submission.type === 'accepted' && persistedStatus !== 'completed') {
        updateVisualStatus('completed')
        const wasUnlocked = await getUserIsSolutionUnlocked(userId, challenge.id)
        if (completionData) {
          setCompletionData({ ...completionData, wasUnlocked })
        }
        setShowCompletionDialog(true)
        handleChallengeCompletion(challenge, userId, submission.code.language)
          .then(() => updatePersistedStatus('completed'))
          .catch(console.error)
      }
    } catch (error) {
      console.error('Error submitting code:', error)
      toast.error('Failed to submit code. Please try again.')
    }
  }

  const handleCodeChange = (newCode: string = '') => {
    setCurrentCode(currentLanguage, newCode)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
  }

  return (
    <>
      <CodeEditor
        key={currentLanguage}
        initialCode={currentCodeByLanguage[currentLanguage] || ''}
        language={currentLanguage}
        showLanguageSelector={availableLanguages.length > 1}
        availableLanguages={availableLanguages}
        codeVersions={codeVersions}
        tests={tests}
        onSubmit={handleSubmit}
        onChange={handleCodeChange}
        onLanguageChange={handleLanguageChange}
      />

      {showCompletionDialog && completionData && (
        <CompletionDialog
          open={showCompletionDialog}
          onOpen={() => setShowCompletionDialog(false)}
          experienceGained={completionData.challengeExperience}
          currentLevel={completionData.gamificationInfo.currentLevel}
          currentExperience={completionData.gamificationInfo.currentExperience}
          nextLevelExperience={completionData.gamificationInfo.nextLevelExperience}
          nextChallengeUrl={completionData.nextChallengeUrl}
          hasUnlockedSolution={completionData.wasUnlocked}
        />
      )}
    </>
  )
}
