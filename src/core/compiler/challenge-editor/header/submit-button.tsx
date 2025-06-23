'use client'

import { Button } from '@/components/ui/button'
import {
  getCompletionStatus,
  isSolutionUnlocked,
} from '@/core/challenges/user-progression/completion-status'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { addExperience } from '@/core/gamification/level'
import { handleChallengeCompletionForQuests } from '@/core/gamification/quests/actions'
import {
  Loader2,
  Send,
  HeartIcon,
  DiamondIcon,
  SpadeIcon,
  ClubIcon,
  Beaker,
  Bot,
  LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { useChallengeSubmissions } from '@/core/challenges/submissions/hooks/use-challenge-submissions'
import { useChallengeEditorStore } from '../store'
import { useSubmitCode } from '../../hooks/use-submit-code'
import { useQueryClient } from '@tanstack/react-query'
import { solutionQueryKeys } from '@/core/challenges/hooks/use-solution-queries'
import { useChallengeTour } from '@/core/challenges/components/challenge-tour-context'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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

const LoadingIcon = ({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: React.ReactNode
}) => {
  return isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : children
}

const PureSubmitButton = ({
  onSubmit,
  isSubmitting,
  isDisabled,
  buttonRef,
  isCurrentTourTarget,
  currentTourStepContent,
  IconComponent,
  nextStep,
  tourStepsLength,
}: {
  onSubmit: () => void
  isSubmitting: boolean
  isDisabled: boolean
  buttonRef: React.RefObject<HTMLButtonElement>
  isCurrentTourTarget: boolean
  currentTourStepContent: any
  IconComponent: LucideIcon | undefined
  nextStep: () => void
  tourStepsLength: number
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  useEffect(() => {
    setIsPopoverOpen(isCurrentTourTarget)
  }, [isCurrentTourTarget])

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="h-8"
          onClick={onSubmit}
          disabled={isSubmitting || isDisabled}
          ref={buttonRef}
          id="challenge-submit-button"
        >
          <LoadingIcon isLoading={isSubmitting}>
            <Send size={14} className="mr-1" />
          </LoadingIcon>
          Submit
        </Button>
      </PopoverTrigger>
      {isCurrentTourTarget && (
        <PopoverContent
          className={cn('max-w-[280px] py-3 shadow-lg z-[101]', {
            left: tourStepsLength % 2 === 0,
            right: tourStepsLength % 2 !== 0,
          })}
          align="center"
        >
          <div className="space-y-3">
            <div className="space-y-1">
              {IconComponent && <IconComponent className="size-5 text-primary mb-2" />}
              <p className="text-[13px] font-medium">{currentTourStepContent?.title}</p>
              <p className="text-muted-foreground text-xs">{currentTourStepContent?.description}</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs">
                {currentTourStepContent.currentStep + 1}/{tourStepsLength}
              </span>
              <button className="text-xs font-medium hover:underline" onClick={nextStep}>
                {currentTourStepContent.currentStep === tourStepsLength - 1
                  ? 'Finish Tour'
                  : 'Next'}
              </button>
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

export const SubmitButton = ({
  challenge,
  userId,
}: {
  challenge: {
    id: number
    baseExperience?: number | null
  }
  userId: string
}) => {
  const {
    setActiveTerminalTab,
    isTerminalOpen,
    toggleTerminal,
    codeByLanguage,
    currentLanguage,
    availableLanguages,
    setTestResults,
    openCompletionDialog,
    setIsLoadingSubmit,
  } = useChallengeEditorStore()
  const { submitCode: submitCodeHook, isLoadingSubmit } = useSubmitCode()
  const { setInProgress, setCompleted, status } = useChallengeUserStatus(challenge.id)
  const { createSubmission } = useChallengeSubmissions(challenge.id)
  const queryClient = useQueryClient()

  const { currentStep, showTour, nextStep, tourSteps } = useChallengeTour()
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const isCurrentTourTarget =
    showTour && tourSteps[currentStep]?.targetElementId === 'challenge-submit-button'
  const currentTourStepContent = tourSteps[currentStep]
  const IconComponent = currentTourStepContent?.iconName
    ? IconMap[currentTourStepContent.iconName]
    : undefined

  const handleSubmit = async () => {
    setIsLoadingSubmit(true)
    setActiveTerminalTab('tests')
    if (!isTerminalOpen) {
      toggleTerminal()
    }

    const code = codeByLanguage[currentLanguage]
    const languageConfig = availableLanguages.find((lang) => lang.value === currentLanguage)

    if (!languageConfig) {
      setTestResults([
        {
          success: false,
          input: '',
          expectedOutput: '',
          actualOutput: 'Error: No test cases found for this language',
        },
      ])
      return
    }

    const testCases = languageConfig.testCases.map((tc) => ({
      input: { content: tc.input, language: currentLanguage },
      expectedOutput: { content: tc.expectedOutput, language: currentLanguage },
    }))

    const { submission, testResults } = await submitCodeHook({
      code: { content: code, language: currentLanguage },
      testCases,
    })
    setIsLoadingSubmit(false)
    setTestResults(testResults)
    createSubmission(submission)

    if (submission.testsPassed === testCases.length) {
      if (!((await getCompletionStatus(userId, challenge.id)) === 'completed')) {
        openCompletionDialog()

        if (!(await isSolutionUnlocked(userId, challenge.id))) {
          await addExperience(userId, challenge.baseExperience ?? 50)
        }

        await handleChallengeCompletionForQuests(userId)

        await trackAchievementProgress(userId, 'challenges_completed', 1)
      }

      await setCompleted()
      queryClient.invalidateQueries({
        queryKey: solutionQueryKeys.solutionUnlock(userId, challenge.id),
      })
    } else if (status === 'not_started' && submission.testsPassed < testCases.length) {
      setInProgress()
    }
  }

  return (
    <PureSubmitButton
      onSubmit={handleSubmit}
      isSubmitting={isLoadingSubmit}
      isDisabled={false}
      buttonRef={submitButtonRef}
      isCurrentTourTarget={isCurrentTourTarget}
      currentTourStepContent={{ ...currentTourStepContent, currentStep }}
      IconComponent={IconComponent}
      nextStep={nextStep}
      tourStepsLength={tourSteps.length}
    />
  )
}
