'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Crown, Trophy, Medal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { getLeaderboard } from '@/core/gamification/level'

type Period = 'day' | 'week' | 'month'

type LeaderboardUser = {
  informations: {
    id: number
    userId: string
    name: string
    avatar: string
    initials: string
  }
  totalExperience: number
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
    key={user.informations.userId}
    className={`flex items-center gap-4 p-2 rounded-md ${isCurrentUser ? 'bg-primary/5 border border-primary/20' : ''}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="flex items-center justify-center w-8">
      <RankIcon rank={user.rank} />
    </div>
    <Avatar className="h-10 w-10">
      <AvatarImage src={user.informations.avatar} alt={user.informations.name} />
      <AvatarFallback>{user.informations.initials}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
        {user.informations.name}
        {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
      </p>
      <p className="text-sm text-muted-foreground">
        {new Intl.NumberFormat('fr-FR').format(user.totalExperience)} XP
      </p>
    </div>
  </motion.div>
)

export const ChallengesLeaderboard = () => {
  const [period, setPeriod] = useState<Period>('week')
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simuler l'utilisateur actuel (normalement viendrait d'un contexte d'authentification)
  const currentUserId = '8'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const leaderboardData = await getLeaderboard(period)
        setUsers(leaderboardData)
      } catch (err) {
        setError('Failed to load leaderboard data')
        console.error('Error fetching leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [period])

  // Trouver l'utilisateur actuel et ses voisins pour l'affichage principal
  const currentUserIndex = users.findIndex((user) => user.informations.userId === currentUserId)
  const displayUsers = users.slice(0, 3) // Top 3

  if (currentUserIndex >= 3) {
    // Si l'utilisateur n'est pas dans le top 3, on l'affiche avec ses voisins
    const start = Math.max(0, currentUserIndex - 1)
    const end = Math.min(users.length, currentUserIndex + 2)
    displayUsers.push(...users.slice(start, end))
  }

  return (
    <Card className="w-full py-0">
      <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
        <CardTitle className="text-lg font-semibold">Top Challengers</CardTitle>
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : (
          <div className="space-y-2">
            {displayUsers.map((user, index) => (
              <UserRow
                key={user.informations.userId}
                user={user}
                index={index}
                isCurrentUser={user.informations.userId === currentUserId}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              View All Rankings
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Complete Rankings</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto pr-4 space-y-2 max-h-[60vh]">
              {users.map((user, index) => (
                <UserRow
                  key={user.informations.userId}
                  user={user}
                  index={index}
                  isCurrentUser={user.informations.userId === currentUserId}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
