'use client'

import { LinkButton } from '@/components/common/link-button'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { XIcon } from 'lucide-react'
import { useId, useMemo, useState } from 'react'

interface CurrentExperienceCardProps {
  currentStep: number
}

const programmingLanguageOptions: Option[] = [
  { value: 'python', label: 'Python' },
  { value: 'react', label: 'React' },
]

const allConcepts: Record<string, Option[]> = {
  python: [
    { value: 'oop', label: 'Object-Oriented Programming' },
    { value: 'functional', label: 'Functional Programming' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'web-development', label: 'Web Development (Django, Flask)' },
    { value: 'data-science', label: 'Data Science (Pandas, NumPy)' },
    { value: 'machine-learning', label: 'Machine Learning (Scikit-learn, TensorFlow)' },
    { value: 'networking', label: 'Networking' },
    { value: 'databases', label: 'Databases' },
    { value: 'testing', label: 'Testing (pytest, unittest)' },
  ],
  react: [
    { value: 'jsx', label: 'JSX' },
    { value: 'components', label: 'Components (Functional & Class)' },
    { value: 'hooks', label: 'Hooks' },
    {
      value: 'state-management',
      label: 'State Management (useState, useReducer, Context API, Redux, Zustand)',
    },
    { value: 'routing', label: 'Routing (React Router, Next.js App Router)' },
    { value: 'api-fetching', label: 'API Data Fetching' },
    { value: 'styling', label: 'Styling (CSS Modules, Styled Components, Tailwind CSS)' },
    { value: 'testing', label: 'Testing (Jest, React Testing Library)' },
    { value: 'typescript', label: 'TypeScript with React' },
  ],
}

export const CurrentExperienceCard = ({ currentStep }: CurrentExperienceCardProps) => {
  const programmingLanguagesSelectId = useId()
  const conceptsSelectId = useId()

  const [selectedLanguages, setSelectedLanguages] = useState<Option[]>([])
  const [selectedConcepts, setSelectedConcepts] = useState<Option[]>([])

  // Filter and combine concepts based on selected languages using useMemo
  const filteredConcepts = useMemo(() => {
    return selectedLanguages
      .flatMap((lang) => allConcepts[lang.value] || [])
      .reduce((acc, concept) => {
        if (!acc.find((c) => c.value === concept.value)) {
          acc.push(concept)
        }
        return acc
      }, [] as Option[])
  }, [selectedLanguages])

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

      <CardHeader className="flex justify-between items-center">
        <CardTitle>Current Experience</CardTitle>
        {/* Removed X icon from here */}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="*:not-first:mt-2">
          <Label htmlFor={programmingLanguagesSelectId}>Programming Languages</Label>
          <MultipleSelector
            commandProps={{
              label: 'Select programming languages',
            }}
            defaultOptions={programmingLanguageOptions}
            placeholder="Select programming languages you are familiar with"
            hideClearAllButton
            emptyIndicator={<p className="text-center text-sm">No results found</p>}
            onChange={setSelectedLanguages}
            value={selectedLanguages}
          />
        </div>

        <div className="*:not-first:mt-2">
          <Label htmlFor={conceptsSelectId}>Concepts</Label>
          <MultipleSelector
            commandProps={{
              label: 'Select concepts',
            }}
            options={filteredConcepts}
            placeholder="Select concepts you are familiar with"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No results found</p>}
            value={selectedConcepts}
            onChange={setSelectedConcepts}
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
