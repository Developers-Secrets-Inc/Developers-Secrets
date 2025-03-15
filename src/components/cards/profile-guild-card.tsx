'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Users, Trophy, Star } from 'lucide-react'

export const ProfileGuildCard = () => {
  const guildData = {
    name: 'Code Warriors',
    level: 15,
    members: 24,
    maxMembers: 30,
    experience: 7500,
    maxExperience: 10000,
    rank: 3,
    achievements: 8,
  }

  const xpPercentage = (guildData.experience / guildData.maxExperience) * 100
  const membersPercentage = (guildData.members / guildData.maxMembers) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-xl bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Guild
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{guildData.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">Level {guildData.level}</Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-500/20 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                >
                  Rank #{guildData.rank}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{guildData.achievements}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Members</span>
                </div>
                <span className="text-muted-foreground">
                  {guildData.members}/{guildData.maxMembers}
                </span>
              </div>
              <Progress value={membersPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span>Experience</span>
                </div>
                <span className="text-muted-foreground">
                  {guildData.experience}/{guildData.maxExperience} XP
                </span>
              </div>
              <Progress value={xpPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
