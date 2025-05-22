'use client'

import { useId, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { LinkButton } from '@/components/common/link-button'
import { XIcon } from 'lucide-react'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import React from 'react'

interface GoalsAndTechnologiesCardProps {
  currentStep: number
}

const goalOptions: Option[] = [
  { value: 'get-job', label: 'Get a job' },
  { value: 'build-portfolio', label: 'Build a portfolio' },
  { value: 'learn-specific-tech', label: 'Learn a specific technology' },
  { value: 'improve-skills', label: 'Improve existing skills' },
  { value: 'contribute-oss', label: 'Contribute to open source' },
  { value: 'hobby', label: 'Just for fun/hobby' },
]

const technologyToLearnOptions: Option[] = [
  { value: 'python-advanced', label: 'Advanced Python Concepts' },
  { value: 'react-native', label: 'React Native' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'sql', label: 'SQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'google-cloud', label: 'Google Cloud' },
]

export const GoalsAndTechnologiesCard = ({ currentStep }: GoalsAndTechnologiesCardProps) => {
  const goalsSelectId = useId()
  const technologiesSelectId = useId()

  const [selectedGoals, setSelectedGoals] = useState<Option[]>([])
  const [selectedTechnologies, setSelectedTechnologies] = useState<Option[]>([])

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
            onChange={setSelectedGoals}
            value={selectedGoals}
          />
        </div>

        <div className="*:not-first:mt-2">
          <Label htmlFor={technologiesSelectId}>What technologies do you want to learn?</Label>
          <MultipleSelector
            commandProps={{
              label: 'Select technologies',
            }}
            defaultOptions={technologyToLearnOptions}
            placeholder="Select technologies you want to learn"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No results found</p>}
            value={selectedTechnologies}
            onChange={setSelectedTechnologies}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {currentStep > 1 && (
          <LinkButton variant="outline" href={`/auth/onboarding?step=${currentStep - 1}`}>
            Previous Step
          </LinkButton>
        )}
        <LinkButton href="/home" className="ml-auto">
          Finish
        </LinkButton>
      </CardFooter>
    </Card>
  )
}
