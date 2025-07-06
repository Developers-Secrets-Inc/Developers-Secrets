'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FlameIcon } from 'lucide-react'
import { useChallengeStreak } from '../hooks/use-challenge-streak'

const PureChallengeStreakBadge = ({ streakLength }: { streakLength: number }) => {
  // TODO: Change color based on challengesToday
  const textColor = 'text-orange-500'
  const bgColor = 'bg-orange-500/10'

  return (
    <Badge variant="outline" className={`gap-1 ${bgColor} ${textColor}`}>
      <FlameIcon size={12} aria-hidden="true" />
      <span>
        {streakLength} Day{streakLength !== 1 ? 's' : ''} Streak
      </span>
    </Badge>
  )
}

export const ChallengeStreakBadge = ({ userId }: { userId: string }) => {
  const { streakLength, isLoading, isError } = useChallengeStreak(userId)

  if (isLoading) {
    return <Skeleton className="w-24 h-6" />
  }

  if (isError || streakLength === 0) {
    return null
  }

  return <PureChallengeStreakBadge streakLength={streakLength} />
}
