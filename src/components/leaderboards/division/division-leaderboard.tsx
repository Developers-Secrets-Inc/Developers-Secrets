'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { DivisionLeaderboardUser } from './division-leaderboard-user'
import { RankedLeaderboardUser, getUserDivisionLeaderboard } from '@/core/gamification/divisions'
import { getSessionUser } from '@/core/user'
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

export const DivisionLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<RankedLeaderboardUser[] | null>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      setError(null)
      setLeaderboardData(null)
      setCurrentUserId(null)

      try {
        const userResult = await getSessionUser()
        if (!userResult.success || !userResult.value?.id) {
          setError('User not authenticated or session expired.')
          setIsLoading(false)
          return
        }
        const userId = userResult.value.id
        setCurrentUserId(userId)

        const data = await getUserDivisionLeaderboard(userId)
        setLeaderboardData(data)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard data.')
        setLeaderboardData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
    // Optional: Add polling interval
    // const interval = setInterval(fetchLeaderboard, 60000); // Refresh every minute
    // return () => clearInterval(interval);
  }, [])

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
