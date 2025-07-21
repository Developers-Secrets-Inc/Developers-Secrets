'use client'

import { useId } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { cn } from '@/lib/utils'
import { LinkButton } from '@/components/common/link-button'
import { useGoals } from '../hooks/use-goals'
import { useTechnologyToLearn } from '../hooks/use-technology-to-learn'
import OnboardingCardHeader from './onboarding-card-header'
import { Target, XIcon } from 'lucide-react'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FirstChallengeDialog } from './first-challenge-dialog'
import { useState } from 'react'

interface GoalsAndTechnologiesCardProps {
  currentStep: number
  userId: string
}

const goalOptions: Option[] = [
  { value: 'get-job', label: 'Get a job' },
  { value: 'build-portfolio', label: 'Build a portfolio' },
  { value: 'learn-specific-tech', label: 'Learn a specific technology' },
  { value: 'improve-skills', label: 'Improve existing skills' },
  { value: 'contribute-oss', label: 'Contribute to open source' },
  { value: 'hobby', label: 'Just for fun/hobby' },
]

const pythonTechnology: Option = { value: 'python', label: 'Python' }
const technologyOptions: Option[] = [pythonTechnology]

export const GoalsAndTechnologiesCard = ({
  currentStep,
  userId,
}: GoalsAndTechnologiesCardProps) => {
  const goalsSelectId = useId()
  const technologySelectId = useId()
  const [isChallengeDialogOpened, setIsChallengeDialogOpened] = useState(false)

  // Synchronise les goals avec le backend
  const {
    selectedGoals,
    setGoals,
    isLoading: isLoadingGoals,
    isUpdating: isUpdatingGoals,
    isError: isErrorGoals,
    error: errorGoals,
  } = useGoals(userId)

  // Synchronise la technologie à apprendre avec le backend
  const {
    selectedTechnology,
    setTechnology,
    isLoading: isLoadingTech,
    isUpdating: isUpdatingTech,
    isError: isErrorTech,
    error: errorTech,
  } = useTechnologyToLearn(userId)

  // Handler pour la sélection de la technologie (Python)
  const handleTechnologyChange = (techs: Option[]) => {
    // On ne permet qu'une seule sélection (Python ou rien)
    if (techs.length > 0 && techs[0].value === 'python') {
      setTechnology()
    } // sinon, on ne fait rien
  }

  const isLoading = isLoadingGoals || isLoadingTech
  const isUpdating = isUpdatingGoals || isUpdatingTech
  const isError = isErrorGoals || isErrorTech
  const error = errorGoals || errorTech

  // Correction du typage pour Option[]
  const safeSelectedGoals = (selectedGoals ?? []).filter(
    (g): g is Option => !!g && typeof g.value === 'string' && typeof g.label === 'string',
  )
  const safeSelectedTechnology = (selectedTechnology ?? []).filter(
    (t): t is Option => !!t && typeof t.value === 'string' && typeof t.label === 'string',
  )

  return (
    <Card className={cn('relative w-md pt-0 overflow-hidden')}>
      <OnboardingCardHeader
        icon={<Target className="size-5 text-primary" />}
        title="Your Goals and Interests"
        description="Select your learning goals and the technologies you want to learn."
      />
      <CardContent className="flex flex-col gap-4 pt-2 pb-0">
        <div className="*:not-first:mt-2">
          <Label htmlFor={goalsSelectId}>What are your learning goals?</Label>
          <MultipleSelector
            commandProps={{
              label: 'Select your goals',
            }}
            defaultOptions={goalOptions}
            placeholder="Select your goals"
            hideClearAllButton
            emptyIndicator={<p className="text-center text-sm">No results found</p>}
            onChange={setGoals}
            value={safeSelectedGoals}
            disabled={isLoadingGoals || isUpdatingGoals}
          />
          {isErrorGoals && (
            <div className="text-destructive text-xs mt-1">{String(errorGoals)}</div>
          )}
        </div>
        <div className="*:not-first:mt-2">
          <Label htmlFor={technologySelectId}>Technology you want to learn</Label>
          <MultipleSelector
            commandProps={{ label: 'Select technology' }}
            defaultOptions={technologyOptions}
            placeholder="Select technology"
            hideClearAllButton
            emptyIndicator={<p className="text-center text-sm">No results found</p>}
            onChange={handleTechnologyChange}
            value={safeSelectedTechnology}
            disabled={isLoadingTech || isUpdatingTech}
            maxSelected={1}
          />
          {isErrorTech && <div className="text-destructive text-xs mt-1">{String(errorTech)}</div>}
        </div>
        {isLoading && <div className="text-xs text-muted-foreground">Loading...</div>}
      </CardContent>
      <CardFooter className="flex w-full gap-2 border-t pt-4 px-4">
        {currentStep > 1 && (
          <LinkButton
            variant="outline"
            href={`/auth/onboarding?step=${currentStep - 1}`}
            className="flex-1"
          >
            Previous Step
          </LinkButton>
        )}
        <Button
          onClick={() => setIsChallengeDialogOpened(true)}
          className="flex-1 cursor-pointer"
          disabled={
            isLoading ||
            isUpdating ||
            safeSelectedGoals.length === 0 ||
            safeSelectedTechnology.length === 0
          }
        >
          Finish
        </Button>
      </CardFooter>
      <FirstChallengeDialog
        isOpen={isChallengeDialogOpened}
        onClose={() => setIsChallengeDialogOpened(false)}
        userId={userId}
      />
    </Card>
  )
}
