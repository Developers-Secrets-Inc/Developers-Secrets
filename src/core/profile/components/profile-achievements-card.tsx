'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Lock } from 'lucide-react'

export const ProfileAchievementsCard = () => {
  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first course',
      icon: '🎯',
      xp: 100,
      isUnlocked: true,
      date: '2024-02-15',
    },
    {
      id: 2,
      title: 'Social Butterfly',
      description: 'Connect with 5 other developers',
      icon: '🦋',
      xp: 200,
      isUnlocked: true,
      date: '2024-02-20',
    },
    {
      id: 3,
      title: 'Code Master',
      description: 'Complete 10 coding challenges',
      icon: '💻',
      xp: 500,
      isUnlocked: false,
    },
    {
      id: 4,
      title: 'Team Player',
      description: 'Join a guild and participate in events',
      icon: '👥',
      xp: 300,
      isUnlocked: false,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-xl bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border ${
                  achievement.isUnlocked
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-muted/50 border-muted'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      {achievement.isUnlocked ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-500/20 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          {achievement.xp} XP
                        </Badge>
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.isUnlocked && (
                      <p className="text-xs text-muted-foreground">
                        Unlocked on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
