'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  Dialog,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Experience } from '@/components/challenges/challenge-experience'
import { LevelDisplay } from './completion/level-display'
import { ExperienceBar } from './completion/experience-bar'
import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'

interface CompletionDialogProps {
  experienceGained: number
  currentLevel: number
  currentExperience: number
  nextLevelExperience: number
  nextChallengeUrl: string
  hasUnlockedSolution: boolean
}

export const CompletionDialog = ({
  experienceGained,
  currentLevel,
  currentExperience,
  nextLevelExperience,
  nextChallengeUrl,
  hasUnlockedSolution,
}: CompletionDialogProps) => {
  const { showCompletionDialog, closeCompletionDialog } = useChallengeEditorStore()

  return (
    <Dialog open={showCompletionDialog} onOpenChange={closeCompletionDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Challenge Completed!</DialogTitle>
          {hasUnlockedSolution ? (
            <DialogDescription>
              You&apos;ve unlocked the solution for this challenge, so no experience points were
              awarded this time.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Congratulations! You have successfully completed this challenge.
            </DialogDescription>
          )}
        </DialogHeader>
        {!hasUnlockedSolution && (
          <div className="w-full space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LevelDisplay level={currentLevel} />
                <Experience quantity={experienceGained} />
              </div>
              <ExperienceBar currentExp={currentExperience} maxExp={nextLevelExperience} />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" asChild>
            <Link href="/challenges">Back to Challenges</Link>
          </Button>
          <Button asChild>
            <Link href={nextChallengeUrl}>Next Challenge</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
