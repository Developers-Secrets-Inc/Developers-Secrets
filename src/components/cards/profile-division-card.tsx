'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Medal } from 'lucide-react'

export const ProfileDivisionCard = () => {
  const divisionData = {
    name: 'Gold Division',
    rank: 7,
    totalPlayers: 100,
    points: 2450,
    nextRank: {
      name: 'Platinum Division',
      pointsNeeded: 550,
    },
  }

  const rankPercentage = (divisionData.rank / divisionData.totalPlayers) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-xl bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {divisionData.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">Rank #{divisionData.rank}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Top {rankPercentage.toFixed(1)}% of {divisionData.totalPlayers} players
              </p>
            </div>
            <Badge variant="secondary" className="text-lg">
              {divisionData.points} pts
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Next Division</span>
              <span className="text-muted-foreground">
                {divisionData.nextRank.pointsNeeded} points needed
              </span>
            </div>
            <Progress
              value={
                (divisionData.points / (divisionData.points + divisionData.nextRank.pointsNeeded)) *
                100
              }
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
