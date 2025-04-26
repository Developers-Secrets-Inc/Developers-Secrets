import { CoursePart } from '@/payload-types'
import { CoursePartStatus, PartStatusSkeleton } from '@/core/courses/components/part-status'
import React, { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Style mapping for difficulty badges
const difficultyStyles: Record<string, string> = {
  easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  horrible: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

// XP Multiplier mapping
const difficultyXpMultiplier: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  horrible: 4,
}

// Style for XP badge
const xpBadgeStyle = 'bg-teal-500/10 text-teal-400 border-teal-500/20'

const PartTitle = ({ title, difficulty }: { title: string; difficulty?: string | null }) => {
  const difficultyStyle = difficulty ? difficultyStyles[difficulty] : ''
  const difficultyLabel = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : ''
  const xp = difficulty ? 50 * (difficultyXpMultiplier[difficulty] || 1) : 0 // Calculate XP

  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {(difficulty || xp > 0) && ( // Show badges container if difficulty or XP exists
        <div className="flex items-center gap-2">
          {' '}
          {/* Container for badges */}
          {difficulty && difficultyLabel && (
            <Badge variant="outline" className={cn('capitalize', difficultyStyle)}>
              {difficultyLabel}
            </Badge>
          )}
          {xp > 0 && (
            <Badge variant="outline" className={cn(xpBadgeStyle)}>
              {' '}
              {/* XP Badge with new style and text */}
              {xp}XP
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

interface PartHeaderProps {
  part: CoursePart
}

export const PartHeader = ({ part }: PartHeaderProps) => {
  return (
    <div className="mb-6 border-b pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <PartTitle title={part.name} difficulty={part.difficulty} />
        <Suspense fallback={<PartStatusSkeleton />}>
          <CoursePartStatus partId={part.id} />
        </Suspense>
      </div>
    </div>
  )
}
