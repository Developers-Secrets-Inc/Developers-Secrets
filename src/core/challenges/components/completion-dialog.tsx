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

interface CompletionDialogProps {
  open: boolean
  onOpen: () => void
  experienceGained: number
  currentLevel: number
  currentExperience: number
  nextLevelExperience: number
  nextChallengeUrl: string
  hasUnlockedSolution: boolean
}

export const CompletionDialog = ({
  open,
  onOpen,
  experienceGained,
  currentLevel,
  currentExperience,
  nextLevelExperience,
  nextChallengeUrl,
  hasUnlockedSolution,
}: CompletionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Challenge Completed! 🎉</DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-4 py-4">
            {hasUnlockedSolution ? (
              <p>
                You&apos;ve unlocked the solution for this challenge, so no experience points were
                awarded this time.
              </p>
            ) : (
              <div className="w-full space-y-4">
                <div className="text-center">
                  Congratulations! You have successfully completed this challenge.
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LevelDisplay level={currentLevel} />
                    <Experience quantity={experienceGained} />
                  </div>
                  <ExperienceBar currentExp={currentExperience} maxExp={nextLevelExperience} />
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
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
