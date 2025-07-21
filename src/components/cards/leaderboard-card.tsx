'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'

const leaderboardData = [
  { rank: 1, name: 'Marie L.', xp: 3120 },
  { rank: 2, name: 'Jean D.', xp: 2780 },
  { rank: 3, name: 'Pierre T.', xp: 2650 },
  { rank: 7, name: 'David V.', xp: 2450 },
]

const getMedalEmoji = (rank: number) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

export const LeaderboardCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md bg-background shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold text-foreground dark:text-white">
            Classement Division Gold
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul className="space-y-2">
            {leaderboardData.map((user, index) => (
              <motion.li
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 rounded-md
                  ${index < 3 ? 'bg-blue-100 dark:bg-zinc-900' : ''}
                  ${user.name === 'David V.' ? 'bg-gray-200 dark:bg-muted' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 text-center font-semibold ${index < 3 ? 'text-lg' : 'text-sm'} text-foreground dark:text-white`}
                  >
                    {getMedalEmoji(user.rank) || user.rank}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/avatars/user-0${user.rank}.png`} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`font-medium text-foreground dark:text-white text-sm`}>
                    {user.name}
                  </span>
                </div>
                <motion.span
                  className={`font-semibold text-xs ${user.xp > 0 ? 'text-green-500 dark:text-green-400' : 'text-muted-foreground dark:text-gray-400'}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                >
                  {user.xp} pts
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
