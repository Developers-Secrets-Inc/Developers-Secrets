'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

// Define the TourStep interface (should match what's in layout.tsx)
interface TourStep {
  iconName: string // Now expecting a string name
  title: string
  description: string
  targetElementId?: string // ID of the HTML element to attach the popover to
}

// Define the context value type
interface ChallengeTourContextType {
  currentStep: number
  showTour: boolean
  nextStep: () => void
  triggerTour: () => void
  tourSteps: TourStep[] // Provide the tour steps via context
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
  const [showTour, setShowTour] = useState(false) // Whether the tour is generally active

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setShowTour(false) // End tour
      setCurrentStep(0) // Reset for next time
      // TODO: Potentially update user's profile to mark tour as completed
    }
  }, [currentStep, tourSteps.length])

  const triggerTour = useCallback(() => {
    if (tourSteps.length > 0) {
      setCurrentStep(0)
      setShowTour(true)
    }
  }, [tourSteps.length])

  // Effect to initiate tour based on URL param on mount
  useEffect(() => {
    const onboardingParam = searchParams.get('onboarding')
    if (onboardingParam === 'true' && tourSteps.length > 0) {
      triggerTour()
      // You might want to remove the search param after showing the tour
      // const newUrl = new URL(window.location.href);
      // newUrl.searchParams.delete('onboarding');
      // window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, tourSteps.length, triggerTour])

  return (
    <ChallengeTourContext.Provider
      value={{ currentStep, showTour, nextStep, triggerTour, tourSteps }}
    >
      {children}
      {/* The Popover itself will now be rendered by individual target components */}
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
