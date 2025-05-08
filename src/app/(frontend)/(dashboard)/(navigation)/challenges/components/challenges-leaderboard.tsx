'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Crown, Trophy, Medal, Loader2, ShieldAlert, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { getUserDivisionLeaderboard, RankedLeaderboardUser } from '@/core/gamification/divisions'
import { useSessionUser } from '@/core/user/hooks/use-user'

type LeaderboardUser = {
  userId: string
  name: string
  avatar?: string
  initials?: string
  weeklyExperience: number
  rank: number
}

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />
  return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
}

const UserRow = ({
  user,
  index,
  isCurrentUser,
}: {
  user: LeaderboardUser
  index: number
  isCurrentUser: boolean
}) => (
  <motion.div
    key={user.userId}
    className={`flex items-center gap-4 p-2 rounded-md ${isCurrentUser ? 'bg-primary/5 border border-primary/20' : ''}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="flex items-center justify-center w-8">
      <RankIcon rank={user.rank} />
    </div>
    <Avatar className="h-10 w-10">
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
        {user.name}
        {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
      </p>
      <p className="text-sm text-muted-foreground">
        {new Intl.NumberFormat('fr-FR').format(user.weeklyExperience)} XP
      </p>
    </div>
  </motion.div>
)

export const DivisionLeaderboardCard = () => {
  const { user: sessionUser, isLoading: isUserLoading, isError: isUserError } = useSessionUser()
  const currentUserId = sessionUser?.id

  const [users, setUsers] = useState<RankedLeaderboardUser[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isUserLoading && currentUserId) {
      const fetchLeaderboard = async () => {
        setLoading(true)
        setError(null)
        setUsers(null)
        try {
          const leaderboardData = await getUserDivisionLeaderboard(currentUserId)
          setUsers(leaderboardData)
        } catch (err) {
          console.error('Error fetching division leaderboard:', err)
          setError('Failed to load division leaderboard data')
          setUsers(null)
        } finally {
          setLoading(false)
        }
      }
      fetchLeaderboard()
    } else if (!isUserLoading && !currentUserId) {
      setLoading(false)
      setError('User not authenticated.')
      setUsers(null)
    } else if (isUserLoading) {
      setLoading(true)
      setError(null)
      setUsers(null)
    }
  }, [isUserLoading, currentUserId])

  if (isUserLoading || loading) {
    return (
      <Card className="w-full py-0">
        <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
          <CardTitle className="text-lg font-semibold">Weekly Division Ranking</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0"></CardFooter>
      </Card>
    )
  }

  if (isUserError || error) {
    return (
      <Card className="w-full py-0">
        <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
          <CardTitle className="text-lg font-semibold">Weekly Division Ranking</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="text-center py-8 text-destructive">
            <ShieldAlert className="mx-auto h-8 w-8 mb-2" />
            {error || 'Failed to load user data.'}
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentUserIndex = users ? users.findIndex((user) => user.userId === currentUserId) : -1
  let displayUsers: RankedLeaderboardUser[] = []

  if (users) {
    displayUsers = users.slice(0, 3)

    if (currentUserIndex !== -1 && !displayUsers.some((u) => u.userId === currentUserId)) {
      const start = Math.max(0, currentUserIndex - 1)
      const end = Math.min(users.length, currentUserIndex + 2)
      const neighbors = users.slice(start, end)

      if (start > 3) {
        // console.log("Add separator here");
      }
      const usersToAdd = neighbors.filter((u) => !displayUsers.some((du) => du.userId === u.userId))
      displayUsers.push(...usersToAdd)
    }
  }

  return (
    <Dialog>
      <Card className="w-full py-0">
        <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
          <CardTitle className="text-lg font-semibold">Weekly Division Ranking</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          {users === null || users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No division leaderboard data found for the current week.
            </div>
          ) : (
            <div className="space-y-2">
              {displayUsers.map((user, index) => (
                <UserRow
                  key={user.userId}
                  user={user}
                  index={index}
                  isCurrentUser={user.userId === currentUserId}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 px-6 pb-6 pt-0">
          {users && users.length > 0 && (
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                See More
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogTrigger>
          )}
          {users && users.length > displayUsers.length && (
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                View Full Ranking
              </Button>
            </DialogTrigger>
          )}
        </CardFooter>
      </Card>

      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Complete Division Ranking</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto pr-4 space-y-2 max-h-[60vh]">
          {users?.map((user, index) => (
            <UserRow
              key={user.userId}
              user={user}
              index={index}
              isCurrentUser={user.userId === currentUserId}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
