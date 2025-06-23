'use client'

import { Challenge } from '@/payload-types'
import { forwardRef, useEffect, useRef, useState } from 'react' // Import useState
import { useRunCode } from '../hooks/use-run-code'
import { ChallengeEditor, ChallengeEditorContainer } from './editor'
import { TerminalContent, TerminalTabs } from './footer'
import {
  ChallengeIDEHeader,
  ChallengeIDEHeaderLeftPart,
  ChallengeIDEHeaderRightPart,
  LanguageSelector,
  RunButton,
} from './header'
import { useChallengeEditorStore } from './store'
import { SubmitButton } from './header/submit-button'
import { useChallengeTour } from '@/core/challenges/components/challenge-tour-context' // Correct import for useChallengeTour
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover' // Import Popover components
import { HeartIcon, DiamondIcon, SpadeIcon, ClubIcon, Beaker, Bot, LucideIcon, Play, CheckCircle } from 'lucide-react' // Import icons
import { cn } from '@/lib/utils' // Import cn for conditional class names

const ChallengeIDEContainer = forwardRef<HTMLDivElement, { children: React.ReactNode; htmlId?: string }>(
  ({ children, htmlId }, ref) => {
    return (
      <div id={htmlId} className="h-full flex flex-col border-t overflow-hidden" ref={ref}>
        {children}
      </div>
    )
  },
)
ChallengeIDEContainer.displayName = 'ChallengeIDEContainer' // Add display name for debugging

type CodeVersion = {
  language: string
  initialCode: string
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

type ChallengeIDEProps = {
  onRun?: () => void
  onSubmit?: () => void
  onChange?: (code: string) => void
  codeVersions?: CodeVersion[]
  challenge: Challenge
  userId: string
  htmlId?: string // Add htmlId to ChallengeIDEProps
}

// Map icon names to actual LucideIcon components
const IconMap: Record<string, LucideIcon> = {
  HeartIcon,
  DiamondIcon,
  SpadeIcon,
  ClubIcon,
  Beaker,
  Bot,
  Play,
  CheckCircle,
  // Add other icons as needed
}

export const ChallengeIDE = (props: ChallengeIDEProps) => {
  const {
    initialize,
    setActiveTerminalTab,
    isTerminalOpen,
    toggleTerminal,
    codeByLanguage,
    currentLanguage,
    // availableLanguages, // Removed as not used for popover logic
    setIsLoadingRun,
    setExecutionOutput,
  } = useChallengeEditorStore()

  const { currentStep, showTour, nextStep, tourSteps } = useChallengeTour() // Use useChallengeTour directly
  const ideRef = useRef<HTMLDivElement>(null)

  // Identify if this component is the current tour target
  const isCurrentTourTarget =
    showTour && tourSteps[currentStep]?.targetElementId === props.htmlId
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


  useEffect(() => {
    if (props.codeVersions) {
      initialize(props.codeVersions)
    }
  }, [props.codeVersions, initialize])


  const { isLoadingRun, executionOutput, runCode: runCodeHook } = useRunCode()

  const handleRun = async () => {
    // if (onRun) onRun()

    setActiveTerminalTab('output')
    if (!isTerminalOpen) {
      toggleTerminal()
    }

    const code = codeByLanguage[currentLanguage]
    setIsLoadingRun(true)
    await runCodeHook({ code, language: currentLanguage })
    setExecutionOutput(executionOutput)
    setIsLoadingRun(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <ChallengeIDEContainer htmlId={props.htmlId} ref={ideRef}>
          <ChallengeIDEHeader>
            <ChallengeIDEHeaderLeftPart>
              <LanguageSelector />
            </ChallengeIDEHeaderLeftPart>
            <ChallengeIDEHeaderRightPart>
              <RunButton onRun={handleRun} isRunningCode={isLoadingRun} /> {/* Changed to isRunningCode to match RunButton prop */}
              <SubmitButton challenge={props.challenge} userId={props.userId} />
            </ChallengeIDEHeaderRightPart>
          </ChallengeIDEHeader>

          <ChallengeEditorContainer>
            <ChallengeEditor onChange={props.onChange} />
          </ChallengeEditorContainer>

          <TerminalTabs />
          <TerminalContent />
        </ChallengeIDEContainer>
      </PopoverTrigger>
      {isCurrentTourTarget && (
        <PopoverContent
          className={cn('max-w-[280px] py-3 shadow-lg z-[101]', {
            left: currentStep % 2 === 0,
            right: currentStep % 2 !== 0,
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
  )
}