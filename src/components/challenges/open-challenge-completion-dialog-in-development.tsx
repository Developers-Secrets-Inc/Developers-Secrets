'use client'

import { Button } from '@/components/ui/button'
import { CompletionDialog } from '@/core/challenges/components/completion-dialog'
import { getChallengeCompletionData } from '@/core/challenges/actions'
import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import { Loader2 } from 'lucide-react'

interface OpenChallengeCompletionDialogInDevelopmentProps {
  challengeId: number
  userId: string
  challengeSlug: string
}

export function OpenChallengeCompletionDialogInDevelopment({
  challengeId,
  userId,
  challengeSlug,
}: OpenChallengeCompletionDialogInDevelopmentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [completionData, setCompletionData] = useState<Awaited<
    ReturnType<typeof getChallengeCompletionData>
  > | null>(null)
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Pré-charger les données au montage du composant
  useEffect(() => {
    const preloadData = async () => {
      try {
        const data = await getChallengeCompletionData(userId, challengeId, challengeSlug)
        setCompletionData(data)
      } catch (error) {
        console.error('Failed to preload completion data:', error)
      }
    }
    if (isDevelopment) {
      preloadData()
    }
  }, [challengeId, userId, challengeSlug, isDevelopment])

  const handleOpenDialog = async () => {
    if (completionData) {
      // Si les données sont déjà chargées, ouvrir directement
      setIsDialogOpen(true)
      return
    }

    // Sinon, charger les données avec un état de chargement
    setIsLoading(true)
    try {
      const data = await getChallengeCompletionData(userId, challengeId, challengeSlug)
      setCompletionData(data)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Failed to load completion data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isDevelopment) {
    return null
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenDialog}
        className="gap-2"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Trophy size={16} />}
        {isLoading ? 'Loading...' : 'Test Completion'}
      </Button>

      {isDialogOpen && completionData && (
        <CompletionDialog
          open={true}
          onOpen={() => setIsDialogOpen(false)}
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
