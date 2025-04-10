'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Experience } from '@/components/challenges/challenge-experience'
import Link from 'next/link'

interface ChallengeCompletionDialogProps {
  isOpen: boolean
  onClose: () => void
  challengeId: number
  userId: string
}

export function ChallengeCompletionDialog({
  isOpen,
  onClose,
  challengeId,
  userId,
}: ChallengeCompletionDialogProps) {
  // TODO: Load challenge data asynchronously
  const experienceGained = 100 // Arbitrary value for now

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Challenge Completed! 🎉</DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-4 py-4">
            <p>Congratulations! You have successfully completed this challenge.</p>
            <Experience quantity={experienceGained} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" asChild>
            <Link href="/challenges">Back to Challenges</Link>
          </Button>
          <Button asChild>
            <Link href="/challenges/next">Next Challenge</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
