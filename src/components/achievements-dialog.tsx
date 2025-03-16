'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Award, Star, Zap, BookOpen, Sword, Target, Trophy, Users, Code, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface AchievementsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Achievement type definition
interface Achievement {
  id: string
  title: string
  description: string
  nextLevelDescription: string
  level: number
  maxLevel: number
  progress: number
  total: number
  icon: React.ElementType
  color: string
}

export function AchievementsDialog({ open, onOpenChange }: AchievementsDialogProps) {
  // Sample achievements data
  const achievements: Achievement[] = [
    {
      id: 'achievement-1',
      title: 'Code Apprentice',
      description: 'Complete introductory programming courses',
      nextLevelDescription: 'Complete 5 more courses to reach level 3',
      level: 2,
      maxLevel: 5,
      progress: 15,
      total: 20,
      icon: BookOpen,
      color: 'emerald',
    },
    {
      id: 'achievement-2',
      title: 'Bug Hunter',
      description: 'Find and fix bugs in your code',
      nextLevelDescription: 'Fix 20 more bugs to reach level 4',
      level: 3,
      maxLevel: 5,
      progress: 30,
      total: 50,
      icon: Code,
      color: 'blue',
    },
    {
      id: 'achievement-3',
      title: 'Challenge Seeker',
      description: 'Complete coding challenges',
      nextLevelDescription: 'Complete 3 more hard challenges to reach level 2',
      level: 1,
      maxLevel: 5,
      progress: 7,
      total: 10,
      icon: Target,
      color: 'amber',
    },
    {
      id: 'achievement-4',
      title: 'Team Player',
      description: 'Collaborate with other developers',
      nextLevelDescription: 'Join 2 more group projects to reach level 3',
      level: 2,
      maxLevel: 5,
      progress: 3,
      total: 5,
      icon: Users,
      color: 'purple',
    },
    {
      id: 'achievement-5',
      title: 'Algorithm Master',
      description: 'Solve complex algorithmic problems',
      nextLevelDescription: 'Solve 5 more advanced algorithms to reach level 4',
      level: 3,
      maxLevel: 5,
      progress: 15,
      total: 20,
      icon: Sword,
      color: 'red',
    },
    {
      id: 'achievement-6',
      title: 'Streak Keeper',
      description: 'Maintain a daily coding streak',
      nextLevelDescription: 'Keep your streak for 15 more days to reach level 5',
      level: 4,
      maxLevel: 5,
      progress: 35,
      total: 50,
      icon: Flame,
      color: 'orange',
    },
    {
      id: 'achievement-7',
      title: 'Competition Winner',
      description: 'Win coding competitions',
      nextLevelDescription: 'Win 1 more competition to reach level 3',
      level: 2,
      maxLevel: 5,
      progress: 2,
      total: 3,
      icon: Trophy,
      color: 'yellow',
    },
  ]

  // Function to get color classes based on achievement color
  const getColorClasses = (color: string) => {
    // Utiliser une palette de gris avec de légères teintes de couleur
    switch (color) {
      case 'emerald':
        return 'bg-slate-700/30 text-emerald-400 ring-slate-600/50'
      case 'blue':
        return 'bg-slate-700/30 text-blue-400 ring-slate-600/50'
      case 'amber':
        return 'bg-slate-700/30 text-amber-400 ring-slate-600/50'
      case 'purple':
        return 'bg-slate-700/30 text-purple-400 ring-slate-600/50'
      case 'red':
        return 'bg-slate-700/30 text-red-400 ring-slate-600/50'
      case 'orange':
        return 'bg-slate-700/30 text-orange-400 ring-slate-600/50'
      case 'yellow':
        return 'bg-slate-700/30 text-yellow-400 ring-slate-600/50'
      default:
        return 'bg-slate-700/30 text-slate-400 ring-slate-600/50'
    }
  }

  // Function to get background color classes based on achievement color
  const getBackgroundColorClasses = (color: string) => {
    // Utiliser une palette de gris uniforme
    return 'bg-slate-800/60 border-slate-700/60'
  }

  // Function to get badge color classes based on achievement color
  const getBadgeColorClasses = (color: string) => {
    // Utiliser une palette de gris avec de légères teintes de couleur
    switch (color) {
      case 'emerald':
        return 'bg-slate-700/50 text-emerald-400 border-slate-600/50'
      case 'blue':
        return 'bg-slate-700/50 text-blue-400 border-slate-600/50'
      case 'amber':
        return 'bg-slate-700/50 text-amber-400 border-slate-600/50'
      case 'purple':
        return 'bg-slate-700/50 text-purple-400 border-slate-600/50'
      case 'red':
        return 'bg-slate-700/50 text-red-400 border-slate-600/50'
      case 'orange':
        return 'bg-slate-700/50 text-orange-400 border-slate-600/50'
      case 'yellow':
        return 'bg-slate-700/50 text-yellow-400 border-slate-600/50'
      default:
        return 'bg-slate-700/50 text-slate-400 border-slate-600/50'
    }
  }

  // Function to get progress bar color based on achievement color
  const getProgressBarColor = (color: string) => {
    // Utiliser une palette de gris avec de légères teintes de couleur
    switch (color) {
      case 'emerald':
        return 'bg-emerald-600/70'
      case 'blue':
        return 'bg-blue-600/70'
      case 'amber':
        return 'bg-amber-600/70'
      case 'purple':
        return 'bg-purple-600/70'
      case 'red':
        return 'bg-red-600/70'
      case 'orange':
        return 'bg-orange-600/70'
      case 'yellow':
        return 'bg-yellow-600/70'
      default:
        return 'bg-slate-600/70'
    }
  }

  // Animation variants
  const achievementVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Star className="h-6 w-6 text-yellow-500" />
            Achievements
          </DialogTitle>
          <DialogDescription>
            Track your progress and earn rewards by completing achievements.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <AnimatePresence mode="popLayout">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial="hidden"
                animate="visible"
                variants={achievementVariants}
                layout
                className={cn(
                  'border-input relative flex flex-col rounded-md border p-4 shadow-xs outline-none h-full',
                  getBackgroundColorClasses(achievement.color),
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      'rounded-full p-2 shrink-0 ring-1 ring-inset',
                      getColorClasses(achievement.color),
                    )}
                  >
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium truncate">{achievement.title}</h3>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-sm text-xs font-medium self-start mb-2',
                    getBadgeColorClasses(achievement.color),
                  )}
                >
                  Level {achievement.level}/{achievement.maxLevel}
                </Badge>

                <p className="text-muted-foreground text-sm mb-3">{achievement.description}</p>

                <div className="flex flex-col gap-1 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex-1 pr-2">
                      {achievement.nextLevelDescription}
                    </span>
                    <span className="text-xs font-medium whitespace-nowrap">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        getProgressBarColor(achievement.color),
                      )}
                      style={{
                        width: `${(achievement.progress / achievement.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
