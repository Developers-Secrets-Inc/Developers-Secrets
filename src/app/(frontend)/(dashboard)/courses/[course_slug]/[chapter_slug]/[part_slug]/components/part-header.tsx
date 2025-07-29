import { Badge } from '@/components/ui/badge'
import { FeedbackButton } from '@/core/courses/components/feedback-button'
import { PartSkillsTags, PartSkillsTagsSkeleton } from '@/core/courses/components/part-skills-tags'
import { PartStatus } from '@/core/courses/components/part-status'
import { cn } from '@/lib/utils'
import { CoursePart } from '@/payload-types'
import React, { Suspense } from 'react'

type Difficulty = 'easy' | 'medium' | 'hard' | 'horrible'

// Style mapping for difficulty badges
const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  horrible: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

// XP Multiplier mapping
const difficultyXpMultiplier: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  horrible: 4,
}

const calculateExperience = (difficulty: Difficulty): number => {
  return 50 * difficultyXpMultiplier[difficulty]
}

// Style for XP badge
const xpBadgeStyle = 'bg-teal-500/10 text-teal-400 border-teal-500/20'

// Ajout de la nouvelle structure de composants dans un objet Part
export const PartTitle = ({ title }: { title: string }) => (
  <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
)

export const PartDifficulty = ({ difficulty }: { difficulty: Difficulty }) => {
  const difficultyStyle = difficultyStyles[difficulty]
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  return (
    <Badge variant="outline" className={cn('capitalize', difficultyStyle)}>
      {difficultyLabel}
    </Badge>
  )
}

export const PartExperience = ({ difficulty }: { difficulty: Difficulty }) => {
  const xp = calculateExperience(difficulty)
  return (
    <Badge variant="outline" className={cn(xpBadgeStyle)}>
      {xp}XP
    </Badge>
  )
}

export const PartHero = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-start gap-2">{children}</div>
)

export const PartHeaderContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 border-b pb-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
      {children}
    </div>
  </div>
)

// Modification de PartHeader pour utiliser la nouvelle structure
export const PartHeader = ({ part }: { part: CoursePart }) => {
  return (
    <PartHeaderContainer>
      <PartHero>
        <PartTitle title={part.name} />
        <div className="flex items-center gap-2">
          <PartDifficulty difficulty={part.difficulty as Difficulty} />
          <PartExperience difficulty={part.difficulty as Difficulty} />
        </div>
      </PartHero>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <PartStatus partId={part.id} />

          <FeedbackButton partId={part.id} partName={part.name} />
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={<PartSkillsTagsSkeleton />}>
            <PartSkillsTags part={part} />
          </Suspense>
        </div>
      </div>
    </PartHeaderContainer>
  )
}
