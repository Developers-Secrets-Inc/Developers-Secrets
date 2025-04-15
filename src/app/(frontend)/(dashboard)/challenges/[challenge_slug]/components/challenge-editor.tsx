'use client'

import { CompletionDialog } from '@/core/challenges/components/completion-dialog'
import { handleChallengeCompletion } from '@/core/challenges/actions'
import { getChallengeCompletionData } from '@/core/challenges'
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
  const [completionData, setCompletionData] = useState<Awaited<
    ReturnType<typeof getChallengeCompletionData>
  > | null>(null)
  const { visualStatus, persistedStatus, updateVisualStatus, updatePersistedStatus } =
    useContext(ChallengeStatusContext)!

  // Précharger les données de complétion
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
      // Si c'est la première soumission et que le statut est 'not_started'
      if (persistedStatus === 'not_started') {
        await updatePersistedStatus('in_progress')
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
      if (submission.type === 'accepted' && persistedStatus !== 'completed') {
        // Mettre à jour immédiatement le statut visuel
        updateVisualStatus('completed')

        // Vérifier uniquement si la solution est débloquée
        const wasUnlocked = await getUserIsSolutionUnlocked(userId, challenge.id)
        if (completionData) {
          setCompletionData({
            ...completionData,
            wasUnlocked,
          })
        }

        // Show completion dialog
        setShowCompletionDialog(true)

        // Handle challenge completion in the background
        handleChallengeCompletion(challenge, userId)
          .then(() => updatePersistedStatus('completed'))
          .catch(console.error)
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
