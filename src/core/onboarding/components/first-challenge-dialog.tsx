'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getRandomUncompletedChallenge } from '@/api/challenges'

interface FirstChallengeDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function FirstChallengeDialog({ isOpen, onClose, userId }: FirstChallengeDialogProps) {
  const router = useRouter()
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false)

  const handleTakeMeHome = () => {
    router.push('/home') // Redirect to the dashboard
    onClose()
  }

  const handleCompleteFirstChallenge = async () => {
    setIsLoadingChallenge(true)
    try {
      const challenge = await getRandomUncompletedChallenge(userId)

      if (!challenge) {
        throw new Error(
          'All challenges seems to be completed, this is not a normal behavior since the user just created his account. You may need to check the backend of the recommended challenges.',
        )
      }

      router.push(`/challenges/${challenge.slug}/description?onboarding=true`)
      onClose()
    } catch (error) {
      console.error('Failed to get recommended challenge:', error)
      setIsLoadingChallenge(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Onboarding Complete!</DialogTitle>
          <DialogDescription>
            You&apos;ve successfully completed the onboarding process. What would you like to do
            next?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTakeMeHome}>
            Take Me Home
          </Button>
          <Button
            onClick={handleCompleteFirstChallenge}
            className="flex-1 cursor-pointer gap-2"
            disabled={isLoadingChallenge}
          >
            Complete a first challenge
            {isLoadingChallenge && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
