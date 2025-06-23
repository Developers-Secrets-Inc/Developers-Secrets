'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useChallengeTour } from '@/core/challenges/components/challenge-tour-context'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HeartIcon, DiamondIcon, SpadeIcon, ClubIcon, Beaker, Bot, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Map icon names to actual LucideIcon components
const IconMap: Record<string, LucideIcon> = {
  HeartIcon,
  DiamondIcon,
  SpadeIcon,
  ClubIcon,
  Beaker,
  Bot,
  // Add other icons as needed
}

interface ChallengeDescriptionTourAnchorProps {
  children: React.ReactNode
}

export function ChallengeDescriptionTourAnchor({ children }: ChallengeDescriptionTourAnchorProps) {
  const { currentStep, showTour, nextStep, tourSteps } = useChallengeTour()
  const descriptionRef = useRef<HTMLDivElement>(null)

  // Identify if this component is the current tour target
  const isCurrentTourTarget =
    showTour && tourSteps[currentStep]?.targetElementId === 'challenge-description-area'
  const currentTourStepContent = tourSteps[currentStep]
  const IconComponent = currentTourStepContent?.iconName
    ? IconMap[currentTourStepContent.iconName]
    : undefined

  // State to control this component's popover
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Open this component's popover if it's the current tour target
  useEffect(() => {
    setIsPopoverOpen(isCurrentTourTarget)
  }, [isCurrentTourTarget])

  return (
    <div
      className="relative flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0"
      id="challenge-description-area"
      ref={descriptionRef}
    >
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div>{children}</div>
        </PopoverTrigger>
        {isCurrentTourTarget && (
          <PopoverContent
            className={cn('absolute top-4 z-[101] max-w-[280px] shadow-lg py-3 px-4')}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                {IconComponent && <IconComponent className="size-5 text-primary mb-2" />}
                <p className="text-[13px] font-medium">{currentTourStepContent?.title}</p>
                <p className="text-muted-foreground text-xs">
                  {currentTourStepContent?.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-xs">
                  {currentStep + 1}/{tourSteps.length}
                </span>
                <button className="text-xs font-medium hover:underline" onClick={nextStep}>
                  {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
                </button>
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
