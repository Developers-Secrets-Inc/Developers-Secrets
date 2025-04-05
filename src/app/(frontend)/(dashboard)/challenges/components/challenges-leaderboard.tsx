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
import { useState } from 'react'

type UserInformation = {
  id: number
  userId: string
  name: string
  avatar: string
  initials: string
}

type LeaderboardUser = {
  informations: UserInformation
  totalExperience: number
  rank: number
}

type Period = 'day' | 'week' | 'month'

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
      <AvatarImage src="https://github.com/shadcn.png" alt={user.informations.name} />
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

  // Simuler l'utilisateur actuel (normalement viendrait d'un contexte d'authentification)
  const currentUserId = '8'

  // TODO: Fetch this data from the API based on selected period
  const users: LeaderboardUser[] = [
    {
      informations: {
        id: 1,
        userId: '1',
        name: 'Alice Johnson',
        avatar: '/avatars/user-01.png',
        initials: 'AJ',
      },
      totalExperience: 12500,
      rank: 1,
    },
    {
      informations: {
        id: 2,
        userId: '2',
        name: 'Bob Smith',
        avatar: '/avatars/user-02.png',
        initials: 'BS',
      },
      totalExperience: 10800,
      rank: 2,
    },
    {
      informations: {
        id: 3,
        userId: '3',
        name: 'Carol White',
        avatar: '/avatars/user-03.png',
        initials: 'CW',
      },
      totalExperience: 9500,
      rank: 3,
    },
    {
      informations: {
        id: 4,
        userId: '4',
        name: 'David Brown',
        avatar: '/avatars/user-04.png',
        initials: 'DB',
      },
      totalExperience: 8200,
      rank: 4,
    },
    {
      informations: {
        id: 5,
        userId: '5',
        name: 'Eva Green',
        avatar: '/avatars/user-05.png',
        initials: 'EG',
      },
      totalExperience: 7800,
      rank: 5,
    },
  ]

  // Extended list for the dialog
  const allUsers = [
    ...users,
    ...Array.from({ length: 15 }, (_, i) => ({
      informations: {
        id: i + 6,
        userId: `${i + 6}`,
        name: `User ${i + 6}`,
        avatar: `/avatars/user-${(i + 6).toString().padStart(2, '0')}.png`,
        initials: `U${i + 6}`,
      },
      totalExperience: 7500 - i * 200,
      rank: i + 6,
    })),
  ]

  // Trouver l'utilisateur actuel et ses voisins pour l'affichage principal
  const currentUserIndex = allUsers.findIndex((user) => user.informations.userId === currentUserId)
  const displayUsers = allUsers.slice(0, 3) // Top 3

  if (currentUserIndex >= 3) {
    // Si l'utilisateur n'est pas dans le top 3, on l'affiche avec ses voisins
    const start = Math.max(0, currentUserIndex - 1)
    const end = Math.min(allUsers.length, currentUserIndex + 2)
    displayUsers.push(...allUsers.slice(start, end))
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
              {allUsers.map((user, index) => (
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
