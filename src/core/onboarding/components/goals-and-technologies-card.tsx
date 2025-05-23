'use client'

import { useId, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { LinkButton } from '@/components/common/link-button'
import { XIcon } from 'lucide-react'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import React from 'react'
import { useGoals } from '../hooks/use-goals'
import { useTechnologyToLearn } from '../hooks/use-technology-to-learn'

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
    } else {
      // Si désélectionné, on envoie un tableau vide côté backend
      setTechnology([])
    }
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
    <Card className={cn('relative w-md', 'relative')}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <LinkButton
              href="/home"
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 size-6 text-muted-foreground"
            >
              <XIcon className="size-4" />
            </LinkButton>
          </TooltipTrigger>
          <TooltipContentCustom sideOffset={5}>Skip Onboarding</TooltipContentCustom>
        </Tooltip>
      </TooltipProvider>

      <CardHeader className="flex justify-between items-center">
        <CardTitle>Your Goals and Interests</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
      <CardFooter className="flex gap-2">
        {currentStep > 1 && (
          <LinkButton variant="outline" href={`/auth/onboarding?step=${currentStep - 1}`}>
            Previous Step
          </LinkButton>
        )}
        <LinkButton
          href="/home"
          className="ml-auto"
          disabled={
            isLoading ||
            isUpdating ||
            safeSelectedGoals.length === 0 ||
            safeSelectedTechnology.length === 0
          }
        >
          Finish
        </LinkButton>
      </CardFooter>
    </Card>
  )
}
