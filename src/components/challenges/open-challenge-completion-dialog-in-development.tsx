'use client'

import { Button } from '@/components/ui/button'
import { ChallengeCompletionDialog } from '@/components/challenges/challenge-completion-dialog'
import { useState } from 'react'
import { Trophy } from 'lucide-react'

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
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!isDevelopment) {
    return null
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="gap-2">
        <Trophy size={16} />
        Test Completion
      </Button>

      <ChallengeCompletionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        challengeId={challengeId}
        userId={userId}
        challengeSlug={challengeSlug}
      />
    </>
  )
}
