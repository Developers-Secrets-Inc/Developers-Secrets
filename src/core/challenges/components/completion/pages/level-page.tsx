'use client'

import { useEffect, useState } from 'react'


import { Lock } from 'lucide-react'

// Ajout de framer-motion pour l'animation
import { cn } from '@/lib/utils'
import {
    AnimatePresence,
    motion,
    useAnimation
} from 'framer-motion'

// Imports nécessaires pour le Tooltip
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'




const AnimatedCount = ({
  value,
  className,
  duration = 0.6,
}: {
  value: number
  className?: string
  duration?: number
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration, ease: 'easeInOut' }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

const AnimatedProgressBar = ({
  startPercent,
  endPercent,
  animate: shouldAnimate,
  duration = 1.5,
}: {
  startPercent: number
  endPercent: number
  animate: boolean
  duration?: number
}) => {
  const controls = useAnimation()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      const animateProgress = async () => {
        // Did we level up?
        if (endPercent < startPercent) {
          // 1. Animate to 100%
          await controls.start({
            width: '100%',
            transition: {
              duration: duration * ((100 - startPercent) / (100 - startPercent + endPercent)),
              ease: 'linear',
            },
          })
          // 2. Reset to 0%
          await controls.start({
            width: '0%',
            transition: { duration: 0.1 },
          })
          // 3. Animate to final progress
          await controls.start({
            width: `${endPercent}%`,
            transition: {
              duration: duration * (endPercent / (100 - startPercent + endPercent)),
              ease: 'linear',
            },
          })
        } else {
          // No level up, just a simple animation
          await controls.start({
            width: `${endPercent}%`,
            transition: { duration, ease: 'easeInOut' },
          })
        }
        setHasAnimated(true)
      }
      animateProgress()
    } else if (!shouldAnimate) {
      // Reset to initial state if animation is not triggered
      controls.set({ width: `${startPercent}%` })
      setHasAnimated(false)
    }
  }, [shouldAnimate, startPercent, endPercent, controls, duration, hasAnimated])

  return (
    <div className="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full">
      <motion.div
        className="bg-primary h-full"
        initial={{ width: `${startPercent}%` }}
        animate={controls}
      />
    </div>
  )
}

const UpcomingRewards = () => {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="my-4 flex items-center justify-center space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'rounded-full ring-1 ring-inset transition-all',
                  'flex h-12 w-12 items-center justify-center',
                  'bg-muted ring-border cursor-default',
                )}
              >
                <Lock className="h-5 w-5 text-muted-foreground/50" />
              </div>
            </TooltipTrigger>
            <TooltipContentCustom>
              <p>Upcoming level rewards coming soon!</p>
            </TooltipContentCustom>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export const LevelPage = ({
  initialInfo,
}: {  
  initialInfo: {
    level: number
    currentXp: number,
    xpGained: number
  }
}) => {
  // --- Configuration ---
  const xpPerLevel = (level: number) => level * 100

  // --- Initial State ---
  const {
    level: startLevel,
    currentXp: startCurrentXp,
    xpGained,
  } = initialInfo
  const startProgressPercent = (startCurrentXp / xpPerLevel(startLevel + 1)) * 100

  // --- Final State Calculation ---
  const xpAfterGain = startCurrentXp + xpGained
  const didLevelUp = xpAfterGain >= xpPerLevel(startLevel + 1)

  const endLevel = didLevelUp ? startLevel + 1 : startLevel
  const xpForNextLevelAfterUp = xpPerLevel(endLevel + 1)

  const finalCurrentXp = didLevelUp ? xpAfterGain - xpPerLevel(startLevel + 1) : xpAfterGain
  const finalProgressPercent = (finalCurrentXp / xpForNextLevelAfterUp) * 100

  // --- State for Animation ---
  const [displayedLevel, setDisplayedLevel] = useState(startLevel)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  // Trigger animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedLevel(endLevel)
      setShouldAnimate(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [endLevel])

  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <div
        className={cn(
          'rounded-full ring-1 ring-inset transition-all',
          'flex h-20 w-20 items-center justify-center',
          'bg-primary/15 text-primary ring-primary/20',
        )}
      >
        <AnimatedCount value={displayedLevel} className="text-4xl font-bold" />
      </div>
      <h3 className="text-xl font-medium text-muted-foreground mt-4 mb-2">
        {didLevelUp ? 'You Leveled Up!' : 'Experience Gained!'}
      </h3>

      <UpcomingRewards />

      <div className="w-full max-w-sm">
        <div className="flex justify-between w-full text-sm text-muted-foreground mb-2">
          <span>
            {Math.round(finalCurrentXp)}/{xpForNextLevelAfterUp}
          </span>
          <span>Level {endLevel + 1}</span>
        </div>
        <AnimatedProgressBar
          startPercent={startProgressPercent}
          endPercent={finalProgressPercent}
          animate={shouldAnimate}
        />
      </div>
    </div>
  )
}