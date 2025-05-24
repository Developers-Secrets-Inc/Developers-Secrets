'use client'

import { LinkButton } from '@/components/common/link-button'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { XIcon } from 'lucide-react'
import { useId, useMemo } from 'react'
import { usePythonConcepts } from '../hooks/use-python-concepts'
import { useTechnology } from '../hooks/use-technology'
import { useTechnologyConcept } from '../hooks/use-technology-concept'
import OnboardingCardHeader from './onboarding-card-header'
import { Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CurrentExperienceCardProps {
  currentStep: number
  userId: string
}

const programmingLanguageOptions: Option[] = [{ value: 'python', label: 'Python' }]

export const CurrentExperienceCard = ({ currentStep, userId }: CurrentExperienceCardProps) => {
  const programmingLanguagesSelectId = useId()
  const conceptsSelectId = useId()

  // Use hooks for data and mutations
  const {
    selectedTechnologies,
    isLoading: isLoadingTechnologies,
    setTechnologies,
    isUpdating: isUpdatingTechnologies,
  } = useTechnology(userId)
  const {
    selectedConcepts,
    isLoading: isLoadingConcepts,
    setConcepts,
    isUpdating: isUpdatingConcepts,
  } = useTechnologyConcept(userId)

  // Fetch Python concepts
  const { data: pythonConcepts, isLoading: isLoadingPythonConcepts } = usePythonConcepts()

  // Format concepts for the selector
  const conceptOptions: Option[] = pythonConcepts
    ? pythonConcepts.map((c) => ({ value: String(c.id), label: c.name }))
    : []

  // Only show concepts if Python is selected
  const showConcepts = selectedTechnologies.some((lang) => lang.value === 'python')

  const isLoading = isLoadingTechnologies || isLoadingConcepts || isLoadingPythonConcepts
  const isUpdating = isUpdatingTechnologies || isUpdatingConcepts

  // Correction du typage pour Option[]
  const safeSelectedTechnologies = (selectedTechnologies ?? []).filter(
    (t): t is Option => !!t && typeof t.value === 'string' && typeof t.label === 'string',
  )
  const safeSelectedConcepts = (selectedConcepts ?? []).filter(
    (c): c is Option => !!c && typeof c.value === 'string' && typeof c.label === 'string',
  )

  return (
    <Card className={cn('relative w-md pt-0 overflow-hidden')}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/home" passHref>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 size-6 text-muted-foreground"
              >
                <XIcon className="size-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContentCustom sideOffset={5}>Skip Onboarding</TooltipContentCustom>
        </Tooltip>
      </TooltipProvider>

      <OnboardingCardHeader
        icon={<Code className="size-5 text-primary" />}
        title="Your Current Experience"
        description="Tell us about your programming experience and concepts you know."
      />
      <CardContent className="flex flex-col gap-4 pt-2 pb-0">
        <div className="*:not-first:mt-2">
          <Label htmlFor={programmingLanguagesSelectId}>Programming Language</Label>
          <MultipleSelector
            commandProps={{ label: 'Select programming language' }}
            defaultOptions={programmingLanguageOptions}
            placeholder="Select programming language"
            hideClearAllButton
            value={safeSelectedTechnologies}
            onChange={setTechnologies}
            disabled={isLoadingTechnologies || isUpdatingTechnologies}
          />
        </div>
        <div className="*:not-first:mt-2">
          <Label htmlFor={conceptsSelectId}>Concepts</Label>
          <MultipleSelector
            commandProps={{ label: 'Select concepts' }}
            options={showConcepts ? conceptOptions : []}
            placeholder={
              isLoadingConcepts || isLoadingPythonConcepts
                ? 'Loading concepts...'
                : 'Select concepts you are familiar with'
            }
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No results found</p>}
            value={safeSelectedConcepts}
            onChange={setConcepts}
            disabled={isLoadingConcepts || isUpdatingConcepts || !showConcepts}
          />
        </div>
        {isLoading && <div className="text-xs text-muted-foreground">Loading...</div>}
      </CardContent>

      <OnboardingCard.Footer>
        <ConditionalRender condition={currentStep > 1}>
          <OnboardingCard.PreviousPartButton currentStep={currentStep} />
        </ConditionalRender>
        <OnboardingCard.NextPartButton currentStep={currentStep} />
      </OnboardingCard.Footer>
    </Card>
  )
}



const ConditionalRender = ({
  condition,
  children,
}: {
  condition: boolean
  children: React.ReactNode
}) => {
  return condition ? children : null
}

const OnboardingCardFooter = ({ children }: { children: React.ReactNode }) => {
  return <CardFooter className="flex w-full gap-2 border-t pt-4 px-4">{children}</CardFooter>
}

export const NextPartButton = ({ currentStep }: { currentStep: number }) => {
  return (
    <LinkButton href={`/auth/onboarding?step=${currentStep + 1}`} className="flex-1">
      Next Step
    </LinkButton>
  )
}

export const PreviousPartButton = ({ currentStep }: { currentStep: number }) => {
  return (
    <LinkButton href={`/auth/onboarding?step=${currentStep - 1}`} className="flex-1" variant="outline">
      Previous Step
    </LinkButton>
  )
}

const OnboardingCard = {
  Footer: OnboardingCardFooter,
  PreviousPartButton: PreviousPartButton,
  NextPartButton: NextPartButton,
}
