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
  const conceptOptions: Option[] = useMemo(() => {
    if (!pythonConcepts) return []
    return pythonConcepts.map((c) => ({ value: String(c.id), label: c.name }))
  }, [pythonConcepts])

  // Only show concepts if Python is selected
  const showConcepts = selectedTechnologies.some((lang) => lang.value === 'python')

  return (
    <Card className={cn('relative w-md')}>
      {/* X Icon and Tooltip positioned absolutely */}
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

      <CardHeader className="flex items-center gap-4">
        <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
          {/* You can use a Python icon here if you have one */}
          <span className="font-bold text-lg">Py</span>
        </div>
        <CardTitle>Current Experience</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="*:not-first:mt-2">
          <Label htmlFor={programmingLanguagesSelectId}>Programming Language</Label>
          <MultipleSelector
            commandProps={{ label: 'Select programming language' }}
            defaultOptions={programmingLanguageOptions}
            placeholder="Select programming language"
            hideClearAllButton
            value={selectedTechnologies}
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
            value={selectedConcepts}
            onChange={setConcepts}
            disabled={isLoadingConcepts || isUpdatingConcepts || !showConcepts}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {currentStep > 1 && (
          <LinkButton variant="outline" href={`/auth/onboarding?step=${currentStep - 1}`}>
            Previous Step
          </LinkButton>
        )}
        <LinkButton
          href={`/auth/onboarding?step=${currentStep + 1}`}
          className={cn(currentStep === 1 ? 'w-full' : 'flex-1')}
        >
          Next Step
        </LinkButton>
      </CardFooter>
    </Card>
  )
}
