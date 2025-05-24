'use client'

import { useId } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Brush } from 'lucide-react'
import { TimeCoding } from '@/core/onboarding/types'
import { useTimeCoding } from '../hooks/use-time-coding'
import { TextShimmer } from '@/components/text-shimmer'

const availableTimeCoding: TimeCoding[] = [
  'less-than-6-months',
  'less-than-1-year',
  '1-2-years',
  '3-5-years',
  '5-plus-years',
]

type TimeCodingSelectProps = {
  userId: string
}

export const TimeCodingSelect = ({ userId }: TimeCodingSelectProps) => {
  const timeCodingSelectId = useId()
  const { timeCoding, setTimeCoding, isLoading } = useTimeCoding(userId)

  // Find the label for the selected timeCoding
  const selectedTimeCodingLabel =
    availableTimeCoding
      .find((t) => t === timeCoding)
      ?.replace(/-/g, ' ')
      .replace(/^./, (c) => c.toUpperCase()) || 'Select time since coding'

  return (
    <Select
      onValueChange={(value) => {
        setTimeCoding(value as TimeCoding)
      }}
      value={timeCoding}
      disabled={isLoading}
    >
      <SelectTrigger
        id={timeCodingSelectId}
        className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
      >
        {isLoading ? (
          <TextShimmer>{selectedTimeCodingLabel}</TextShimmer>
        ) : (
          <SelectValue placeholder="Select time since coding">
            {selectedTimeCodingLabel}
          </SelectValue>
        )}
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
        {availableTimeCoding.map((time) => (
          <SelectItem key={time} value={time}>
            <span className="truncate">
              {time.replace(/-/g, ' ').charAt(0).toUpperCase() + time.replace(/-/g, ' ').slice(1)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
