'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback,
} from 'react'
import { useSearchParams } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { LucideIcon, HeartIcon, DiamondIcon, SpadeIcon, ClubIcon, Beaker, Bot } from 'lucide-react'
import { cn } from '@/lib/utils' // Assuming you have a cn utility

// Define the TourStep interface (updated to match layout.tsx)
interface TourStep {
  iconName: string // Now expecting a string name
  title: string
  description: string
  targetElementId?: string
}

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

// Define the context value type
interface ChallengeTourContextType {
  currentStep: number
  showTour: boolean
  nextStep: () => void
  registerRef: (id: string, ref: MutableRefObject<HTMLElement | null>) => void
  getRef: (id: string) => MutableRefObject<HTMLElement | null> | undefined
  triggerTour: () => void // New function to manually trigger the tour
}

// Create the context
const ChallengeTourContext = createContext<ChallengeTourContextType | undefined>(undefined)

interface ChallengeTourProviderProps {
  children: React.ReactNode
  tourSteps: TourStep[]
}

export function ChallengeTourProvider({ children, tourSteps }: ChallengeTourProviderProps) {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [showTour, setShowTour] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false) // Internal state for popover visibility

  // A map to store refs to target elements by their ID
  const registeredRefs = useRef<Map<string, MutableRefObject<HTMLElement | null>>>(new Map())

  const registerRef = useCallback((id: string, ref: MutableRefObject<HTMLElement | null>) => {
    if (!registeredRefs.current.has(id)) {
      registeredRefs.current.set(id, ref)
      console.log(`Registered ref for ID: ${id}`)
    }
  }, [])

  const getRef = useCallback((id: string) => {
    return registeredRefs.current.get(id)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setShowTour(false) // End tour
      setIsPopoverOpen(false) // Close popover
      setCurrentStep(0) // Reset for next time
    }
  }, [currentStep, tourSteps.length])

  const triggerTour = useCallback(() => {
    if (tourSteps.length > 0) {
      setCurrentStep(0)
      setShowTour(true)
      setIsPopoverOpen(true)
    }
  }, [tourSteps.length])

  // Effect to initiate tour based on URL param on mount
  useEffect(() => {
    const onboardingParam = searchParams.get('onboarding')
    if (onboardingParam === 'true' && tourSteps.length > 0) {
      triggerTour()
      // You might want to remove the search param after showing the tour
      // For now, we keep it for debugging, but in production, you'd use router.replace
      // const newUrl = new URL(window.location.href);
      // newUrl.searchParams.delete('onboarding');
      // window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, tourSteps.length, triggerTour]) // Dependencies

  // Effect to manage popover visibility when currentStep or showTour changes
  useEffect(() => {
    if (showTour) {
      setIsPopoverOpen(true)
    } else {
      setIsPopoverOpen(false)
    }
  }, [showTour])

  // Determine the target ref and content for the current popover
  const currentTourStep = tourSteps[currentStep]
  const targetRef = currentTourStep?.targetElementId
    ? getRef(currentTourStep.targetElementId)
    : undefined

  // Get the actual Icon Component from the map
  const IconComponent = currentTourStep?.iconName ? IconMap[currentTourStep.iconName] : undefined

  return (
    <ChallengeTourContext.Provider
      value={{ currentStep, showTour, nextStep, registerRef, getRef, triggerTour }}
    >
      {children}

      {showTour && targetRef?.current && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          {/* PopoverAnchor must wrap the actual target element */}
          <PopoverAnchor asChild>
            {/* The actual target element is wrapped by PopoverAnchor, which will be the ref itself */}
            {React.cloneElement(targetRef.current, { ref: targetRef })}{' '}
            {/* Ensure ref is passed for re-cloning */}
          </PopoverAnchor>
          <PopoverContent
            className={cn('max-w-[280px] py-3 shadow-lg z-[101]', {
              left: currentStep % 2 === 0,
              right: currentStep % 2 !== 0,
            })}
            align="center"
            showArrow={true}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                {IconComponent && <IconComponent className="size-5 text-primary mb-2" />}
                <p className="text-[13px] font-medium">{currentTourStep?.title}</p>
                <p className="text-muted-foreground text-xs">{currentTourStep?.description}</p>
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
        </Popover>
      )}
    </ChallengeTourContext.Provider>
  )
}

// Custom hook to use the tour context
export function useChallengeTour() {
  const context = useContext(ChallengeTourContext)
  if (context === undefined) {
    throw new Error('useChallengeTour must be used within a ChallengeTourProvider')
  }
  return context
}
