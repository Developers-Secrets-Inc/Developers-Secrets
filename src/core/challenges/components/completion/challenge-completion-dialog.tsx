'use client'

import { Experience } from '@/components/challenges/challenge-experience'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getChallengeCompletionData } from '@/core/challenges'
import { addExperience } from '@/core/gamification/level'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { LevelUpAnimation } from './level-up-animation'
import { ExperienceBar } from './experience-bar'
import { LevelDisplay } from './level-display'
import { DevTools } from './dev-tools'
import { useCompletionState } from '../../hooks/use-completion-state'

interface ChallengeCompletionDialogProps {
  isOpen: boolean
  onClose: () => void
  challengeId: number
  userId: string
  challengeSlug: string
  initialData?: Awaited<ReturnType<typeof getChallengeCompletionData>>
}


type Completion = {
    isLoading: boolean
    experienceGained: number
    nextChallengeUrl: string
}

type Progress = {
    level: number
    experience: number
    nextLevelExperience: number
}


/* 

On ne doit pas charger les données de ce composant, il doit déjà être chargé dans le layout. On doit lui donner les différentes informations :
- La quantité d'expérience gagnée dans le challenge. 
    - On ne prends pas encompte le fait que la solution est débloquée ou non. On aura un props supplémentaire et un calcul interne.
- L'expérience et le niveau actuel de l'utilisateur.
- Est-ce qu'il a débloqué la solution ?

*/

export function ChallengeCompletionDialog({
  isOpen,
  onClose,
  challengeId,
  userId,
  challengeSlug,
  initialData,
}: ChallengeCompletionDialogProps) {


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Challenge Completed! 🎉</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4 py-4">
              {completion.isLoading && !initialData ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading completion details...</span>
                </div>
              ) : completion.experienceGained === 0 ? (
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
                      <LevelDisplay level={progress.level} hasLeveledUp={animation.hasLeveledUp} />
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Experience quantity={completion.experienceGained} />
                      </motion.div>
                    </div>
                    <ExperienceBar
                      currentExp={progress.experience}
                      previousExp={progress.experience - completion.experienceGained}
                      maxExp={progress.nextLevelExperience}
                      animate={animation.isAnimatingExp}
                      onLevelUp={() => {
                        if (animation.levelUpsRemaining.length > 0) {
                          showLevelUpAnimation(animation.levelUpsRemaining)
                        }
                      }}
                    />
                  </div>
                  <DevTools onExperienceGain={simulateExperienceGain} />
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href="/challenges">Back to Challenges</Link>
            </Button>
            <Button asChild disabled={completion.isLoading}>
              <Link href={completion.nextChallengeUrl}>Next Challenge</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {animation.showLevelUp && animation.levelUpsRemaining.length > 0 && (
          <LevelUpAnimation
            level={animation.levelUpsRemaining[0]}
            onComplete={handleLevelUpComplete}
          />
        )}
      </AnimatePresence>
    </>
  )
}
