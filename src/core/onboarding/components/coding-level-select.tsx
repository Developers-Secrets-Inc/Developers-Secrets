'use client'

import { useId } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Code } from 'lucide-react'
import { CodingLevel } from '../types'
import { useCodingLevel } from '../hooks/use-coding-level'
import { TextShimmer } from '@/components/text-shimmer'

const availableCodingLevels: CodingLevel[] = ['beginner', 'intermediate', 'advanced']

type CodingLevelSelectProps = {
  userId: string
}

export const CodingLevelSelect = ({ userId }: CodingLevelSelectProps) => {
  const codingSelectId = useId()
  const { codingLevel, setCodingLevel, isLoading } = useCodingLevel(userId)

  return (
    <Select
      onValueChange={(value) => {
        setCodingLevel(value as CodingLevel)
      }}
      value={codingLevel}
      disabled={isLoading}
    >
      <OnboardingSelectTrigger id={codingSelectId}>
        {isLoading ? (
          <TextShimmer>Searching for your coding level...</TextShimmer>
        ) : (
          <SelectValue placeholder="Select your coding level">
            {codingLevel ? codingLevel.charAt(0).toUpperCase() + codingLevel.slice(1) : null}
          </SelectValue>
        )}
      </OnboardingSelectTrigger>

      <OnboardingSelectContent>
        <OnboardingSelectItems availableCodingLevels={availableCodingLevels} />
      </OnboardingSelectContent>
    </Select>
  )
}

const OnboardingSelectTrigger = ({ children, id }: { children: React.ReactNode; id: string }) => {
  return (
    <SelectTrigger
      id={id}
      className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
    >
      {children}
    </SelectTrigger>
  )
}

const OnboardingSelectContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
      {children}
    </SelectContent>
  )
}

const OnboardingSelectItems = ({
  availableCodingLevels,
}: {
  availableCodingLevels: CodingLevel[]
}) => {
  return (
    <>
      {availableCodingLevels.map((level) => (
        <SelectItem key={level} value={level}>
          <Code size={16} aria-hidden="true" />
          <span className="truncate">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
        </SelectItem>
      ))}
    </>
  )
}
