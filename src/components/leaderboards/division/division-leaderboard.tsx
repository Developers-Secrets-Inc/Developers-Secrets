'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { DivisionLeaderboardUser } from './division-leaderboard-user'
import { RankedLeaderboardUser } from '@/core/gamification/divisions'
import { ShieldAlert } from 'lucide-react'

const LeaderboardSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 rounded-md">
        <div className="flex items-center gap-3">
          <Skeleton className="size-6 w-6 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    ))}
  </div>
)

interface DivisionLeaderboardProps {
  initialLeaderboardData: RankedLeaderboardUser[] | null
  initialError: string | null
  currentUserId: string | null
}

export const DivisionLeaderboard = ({
  initialLeaderboardData,
  initialError,
  currentUserId,
}: DivisionLeaderboardProps) => {
  const isLoading = initialLeaderboardData === null && initialError === null
  const error = initialError
  const leaderboardData = initialLeaderboardData

  if (isLoading) {
    return <LeaderboardSkeleton />
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        <ShieldAlert className="mx-auto size-10 mb-2" />
        <p>{error}</p>
      </div>
    )
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        <p>No division leaderboard data found for the current week.</p>
        <p className="text-xs">Leaderboards are generated at the start of each week.</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {leaderboardData.map((user) => (
        <DivisionLeaderboardUser
          key={user.userId}
          user={user}
          isCurrentUser={user.userId === currentUserId}
        />
      ))}
    </div>
  )
}
