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
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { Loader2, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const isDevelopment = process.env.NODE_ENV === 'development'

interface LevelUpAnimationProps {
  level: number
  onComplete: () => void
}

function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 p-8 bg-background rounded-lg shadow-xl"
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
      >
        <Trophy className="w-16 h-16 text-yellow-500" />
        <motion.h2
          className="text-2xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Level Up!
        </motion.h2>
        <motion.p
          className="text-4xl font-extrabold text-primary"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          Level {level}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

interface ExperienceBarProps {
  currentExp: number
  previousExp: number
  maxExp: number
  animate: boolean
  onLevelUp?: () => void
}

function ExperienceBar({
  currentExp,
  previousExp,
  maxExp,
  animate: shouldAnimate,
  onLevelUp,
}: ExperienceBarProps) {
  const controls = useAnimation()

  // Determine initial and target percentages based directly on props
  const initialPercentage = (previousExp / maxExp) * 100
  const targetPercentage = (currentExp / maxExp) * 100

  useEffect(() => {
    if (shouldAnimate) {
      // Animate from the previous value percentage to the current target percentage
      controls.start({
        width: [`${initialPercentage}%`, `${targetPercentage}%`],
        transition: {
          duration: 1.5,
          ease: [0.25, 1, 0.5, 1], // EaseOutExpo
          onComplete: () => {
            if (currentExp >= maxExp && onLevelUp) {
              onLevelUp()
            }
          },
        },
      })
    } else {
      // Instantly set width if not animating
      controls.set({ width: `${targetPercentage}%` })
    }
  }, [
    shouldAnimate,
    currentExp,
    previousExp,
    maxExp,
    controls,
    onLevelUp,
    initialPercentage,
    targetPercentage,
  ])
  // Added previousExp, initialPercentage, targetPercentage to dependencies

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="tabular-nums">
          {currentExp} / {maxExp} XP
        </span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary origin-left"
          initial={{ width: `${initialPercentage}%` }} // Set initial width explicitly
          animate={controls}
        />
      </div>
    </div>
  )
}

interface LevelDisplayProps {
  level: number
  hasLeveledUp: boolean
}

function LevelDisplay({ level, hasLeveledUp }: LevelDisplayProps) {
  return (
    <motion.div
      className="text-sm font-medium flex items-center gap-2"
      animate={
        hasLeveledUp
          ? {
              scale: [1, 1.2, 1],
              color: ['inherit', '#10B981', 'inherit'],
            }
          : {}
      }
      transition={{ duration: 0.5 }}
    >
      <span>Level</span>
      <motion.span
        key={level}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-bold"
      >
        {level}
      </motion.span>
    </motion.div>
  )
}

interface ChallengeCompletionDialogProps {
  isOpen: boolean
  onClose: () => void
  challengeId: number
  userId: string
  challengeSlug: string
}

export function ChallengeCompletionDialog({
  isOpen,
  onClose,
  challengeId,
  userId,
  challengeSlug,
}: ChallengeCompletionDialogProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [experienceGained, setExperienceGained] = useState<number>(0)
  const [nextChallengeUrl, setNextChallengeUrl] = useState<string>('/challenges')
  const [currentLevel, setCurrentLevel] = useState<number>(1)
  const [previousLevel, setPreviousLevel] = useState<number>(1)
  const [currentExp, setCurrentExp] = useState<number>(0)
  const [previousExp, setPreviousExp] = useState<number>(0)
  const [nextLevelExp, setNextLevelExp] = useState<number>(100)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpsRemaining, setLevelUpsRemaining] = useState<number[]>([])
  const [isAnimatingExp, setIsAnimatingExp] = useState(false)
  const [hasLeveledUp, setHasLeveledUp] = useState(false)

  // États pour la simulation en mode développement
  const [simulatedExp, setSimulatedExp] = useState<number>(0)
  const [simulatedLevel, setSimulatedLevel] = useState<number>(1)
  const [previousSimulatedLevel, setPreviousSimulatedLevel] = useState<number>(1)
  const [simulatedCurrentExp, setSimulatedCurrentExp] = useState<number>(0)
  const [previousSimulatedExp, setPreviousSimulatedExp] = useState<number>(0)
  const [simulatedLevelUps, setSimulatedLevelUps] = useState<number[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsAnimatingExp(false)
      setShowLevelUp(false)
      setHasLeveledUp(false)
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await getChallengeCompletionData(userId, challengeId, challengeSlug)

        const expToAdd = data.wasUnlocked ? 0 : data.challengeExperience
        setExperienceGained(expToAdd)
        setNextChallengeUrl(data.nextChallengeUrl)
        setPreviousLevel(data.gamificationInfo.currentLevel)
        setCurrentLevel(data.gamificationInfo.currentLevel)
        setPreviousExp(data.gamificationInfo.currentExperience)
        setCurrentExp(data.gamificationInfo.currentExperience)
        setNextLevelExp(data.gamificationInfo.nextLevelExperience)
        setSimulatedLevel(data.gamificationInfo.currentLevel)
        setPreviousSimulatedLevel(data.gamificationInfo.currentLevel)
        setSimulatedCurrentExp(data.gamificationInfo.currentExperience)
        setPreviousSimulatedExp(data.gamificationInfo.currentExperience)

        if (expToAdd > 0) {
          setIsAnimatingExp(true)
          const updatedInfo = await addExperience(userId, expToAdd)
          const levelsGained = updatedInfo.currentLevel - data.gamificationInfo.currentLevel
          setCurrentLevel(updatedInfo.currentLevel)
          setCurrentExp(updatedInfo.currentExperience)

          if (levelsGained > 0) {
            setHasLeveledUp(true)
            setLevelUpsRemaining(
              Array.from(
                { length: levelsGained },
                (_, i) => data.gamificationInfo.currentLevel + i + 1,
              ),
            )
          }
        }
      } catch (error) {
        console.error('Error loading challenge completion data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isOpen, userId, challengeId, challengeSlug])


  const handleLevelUpComplete = () => {
    setShowLevelUp(false)
    if (levelUpsRemaining.length > 0) {
      const [_, ...remainingLevels] = levelUpsRemaining
      setLevelUpsRemaining(remainingLevels)
      setPreviousExp(0)
      setIsAnimatingExp(true)
    } else {
      setIsAnimatingExp(false)
      setHasLeveledUp(false)
    }
  }

  const handleExperienceBarLevelUp = () => {
    if (levelUpsRemaining.length > 0) {
      setShowLevelUp(true)
    }
  }

  const simulateExperienceGain = (amount: number) => {
    setIsSimulating(true)
    setSimulatedExp(amount)
    setIsAnimatingExp(true)
    setPreviousSimulatedExp(simulatedCurrentExp)
    setPreviousSimulatedLevel(simulatedLevel)

    let newExp = simulatedCurrentExp + amount
    let newLevel = simulatedLevel
    const newLevelUps: number[] = []

    while (newExp >= nextLevelExp) {
      newExp -= nextLevelExp
      newLevel++
      newLevelUps.push(newLevel)
    }

    setSimulatedCurrentExp(newExp)
    setSimulatedLevel(newLevel)

    if (newLevelUps.length > 0) {
      setHasLeveledUp(true)
      setSimulatedLevelUps(newLevelUps)
    }
  }

  const handleSimulatedLevelUpComplete = () => {
    setShowLevelUp(false)
    if (simulatedLevelUps.length > 0) {
      const [_, ...remainingLevels] = simulatedLevelUps
      setSimulatedLevelUps(remainingLevels)
      setPreviousSimulatedExp(0)
      setIsAnimatingExp(true)
    } else {
      setIsAnimatingExp(false)
      setHasLeveledUp(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Challenge Completed! 🎉</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4 py-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading completion details...</span>
                </div>
              ) : experienceGained === 0 ? (
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
                      <LevelDisplay
                        level={isSimulating ? simulatedLevel : currentLevel}
                        hasLeveledUp={hasLeveledUp}
                      />
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Experience quantity={isSimulating ? simulatedExp : experienceGained} />
                      </motion.div>
                    </div>
                    <ExperienceBar
                      currentExp={isSimulating ? simulatedCurrentExp : currentExp}
                      previousExp={isSimulating ? previousSimulatedExp : previousExp}
                      maxExp={nextLevelExp}
                      animate={isAnimatingExp}
                      onLevelUp={
                        isSimulating ? handleSimulatedLevelUpComplete : handleExperienceBarLevelUp
                      }
                    />
                  </div>
                  {isDevelopment && (
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">Development Tools</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateExperienceGain(50)}
                        >
                          +50 XP
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateExperienceGain(150)}
                        >
                          +150 XP
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateExperienceGain(500)}
                        >
                          +500 XP
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href="/challenges">Back to Challenges</Link>
            </Button>
            <Button asChild disabled={isLoading}>
              <Link href={nextChallengeUrl}>Next Challenge</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showLevelUp &&
          (isSimulating ? simulatedLevelUps.length > 0 : levelUpsRemaining.length > 0) && (
            <LevelUpAnimation
              level={isSimulating ? simulatedLevelUps[0] : levelUpsRemaining[0]}
              onComplete={isSimulating ? handleSimulatedLevelUpComplete : handleLevelUpComplete}
            />
          )}
      </AnimatePresence>
    </>
  )
}
