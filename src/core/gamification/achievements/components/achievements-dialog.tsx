'use client'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { getAchievements } from '@/core/gamification/achievements'
import { getAllUserAchievementProgress } from '@/core/gamification/achievements/user-progress'
import { cn } from '@/lib/utils'
import { Achievement as PayloadAchievement, UserAchievementProgress } from '@/payload-types'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, BookOpen, Code, Coins, Flame, Star, Sword, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface AchievementsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

// Simplified map for icons only
const typeIconMap: Record<Exclude<PayloadAchievement['type'], undefined>, React.ElementType> = {
  experience_gained: Star,
  challenges_completed: Code,
  streak: Flame,
  tutorials_completed: BookOpen,
  quests_completed: Target,
  items_used: Sword,
  coins_earned: Coins,
  // Add other types if needed
}

// Combined type for easier handling in the component
interface DisplayAchievement extends PayloadAchievement {
  userProgress?: UserAchievementProgress
  displayLevel: number
  maxLevel: number
  progressTowardsNext: number
  nextTierThresholdDisplay: number
  nextTierDescription: string
  iconComponent: React.ElementType
  // Removed color property as we use a unified scheme now
  isCompleted: boolean
}

// Skeleton component for loading state
const AchievementSkeleton = () => (
  <div className="relative flex flex-col rounded-md border border-slate-700/60 bg-slate-800/60 p-4 shadow-xs outline-none h-full">
    <div className="flex items-center gap-3 mb-2">
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
    <Skeleton className="h-5 w-1/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-5/6 mb-3" />
    <div className="flex flex-col gap-1 mt-auto">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-1.5 w-full" />
    </div>
  </div>
)

export function AchievementsDialog({ open, onOpenChange, userId }: AchievementsDialogProps) {
  const [achievements, setAchievements] = useState<DisplayAchievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !userId) {
      // Don't fetch if dialog is closed or userId is missing
      setAchievements([])
      setIsLoading(false)
      setError(null)
      return
    }

    const fetchAchievements = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch all active achievements and user progress concurrently
        const [allAchievementsData, userProgressData] = await Promise.all([
          getAchievements(),
          getAllUserAchievementProgress(userId, false), // No need for depth here
        ])

        // Create a map for quick lookup of user progress
        const progressMap = new Map<string | number, UserAchievementProgress>()
        userProgressData.forEach((p) => {
          if (p.achievement && typeof p.achievement === 'object' && p.achievement.id) {
            progressMap.set(p.achievement.id, p)
          } else if (typeof p.achievement === 'number' || typeof p.achievement === 'string') {
            progressMap.set(p.achievement, p)
          }
        })

        // Process and combine data
        const processedAchievementsData = allAchievementsData
          .map((ach): DisplayAchievement | null => {
            if (!ach.tiers || ach.tiers.length === 0) return null // Skip achievements without tiers

            const userProgress = progressMap.get(ach.id)
            const currentTierIndex = userProgress?.currentTierIndex ?? -1
            const currentProgressValue = userProgress?.currentProgress ?? 0
            const maxLevel = ach.tiers.length
            const displayLevel = currentTierIndex + 1
            const isCompleted = displayLevel >= maxLevel

            const nextTierIndex = currentTierIndex + 1
            const nextTier = !isCompleted ? ach.tiers[nextTierIndex] : null

            const currentTierThreshold =
              currentTierIndex >= 0 ? (ach.tiers[currentTierIndex]?.threshold ?? 0) : 0
            const nextTierThreshold = nextTier?.threshold ?? ach.tiers[maxLevel - 1]?.threshold ?? 0
            const progressTowardsNext = Math.max(0, currentProgressValue - currentTierThreshold)
            const nextTierThresholdDisplay = Math.max(1, nextTierThreshold - currentTierThreshold)

            const nextTierDescription = isCompleted
              ? 'Maximum level reached!'
              : (nextTier?.description ?? 'Complete the next step!')

            const iconComponent = typeIconMap[ach.type] || Award // Fallback icon

            // Return explicitly typed object
            return {
              ...ach,
              userProgress,
              displayLevel,
              maxLevel,
              progressTowardsNext: isCompleted ? nextTierThresholdDisplay : progressTowardsNext,
              nextTierThresholdDisplay,
              nextTierDescription,
              iconComponent,
              isCompleted,
            }
          })
          // Keep the type predicate, it's now valid
          .filter((a): a is DisplayAchievement => a !== null)

        // Sort the correctly typed array
        const sortedAchievements = processedAchievementsData.sort((a, b) => {
          // Sort: In Progress first, then Completed. Within each group, sort by title.
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1 // Not completed first
          }
          return a.title.localeCompare(b.title)
        })

        setAchievements(sortedAchievements)
      } catch (err) {
        console.error('Failed to load achievements:', err)
        setError('Could not load achievements. Please try again later.')
        setAchievements([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAchievements()
  }, [open, userId])

  // Simplified styling functions
  const getIconClasses = (isCompleted: boolean) => {
    return isCompleted
      ? 'bg-emerald-700/30 text-emerald-400 ring-emerald-600/50'
      : 'bg-slate-700/30 text-primary ring-slate-600/50' // Use primary color for in-progress
  }

  const getBadgeClasses = (isCompleted: boolean) => {
    return isCompleted
      ? 'bg-emerald-700/50 text-emerald-300 border-emerald-600/50'
      : 'bg-slate-700/50 text-slate-300 border-slate-600/50' // Neutral badge for level
  }

  const getProgressBarColor = (isCompleted: boolean) => {
    return isCompleted ? 'bg-emerald-600/70' : 'bg-primary' // Use primary color for progress bar
  }

  // Animation variants
  const achievementVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl md:max-w-5xl max-h-[80vh] overflow-y-auto">
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
          {isLoading ? (
            [...Array(6)].map((_, index) => <AchievementSkeleton key={index} />)
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-10">{error}</div>
          ) : achievements.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No achievements available yet.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial="hidden"
                  animate="visible"
                  variants={achievementVariants}
                  layout
                  className={cn(
                    'relative flex flex-col rounded-md border p-4 shadow-xs outline-none h-full',
                    achievement.isCompleted ? 'border-emerald-800/40' : 'border-slate-700/60',
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        'rounded-full p-2 shrink-0 ring-1 ring-inset',
                        getIconClasses(achievement.isCompleted),
                      )}
                    >
                      <achievement.iconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-medium truncate flex-1">{achievement.title}</h3>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-sm text-xs font-medium self-start mb-2',
                      getBadgeClasses(achievement.isCompleted),
                    )}
                  >
                    {achievement.isCompleted
                      ? 'Completed'
                      : `Level ${achievement.displayLevel}/${achievement.maxLevel}`}
                  </Badge>

                  <p className="text-muted-foreground text-sm mb-3">
                    {achievement.tiers?.[achievement.displayLevel - 1]?.description ??
                      'No description available'}
                  </p>

                  <div className="flex flex-col gap-1 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex-1 pr-2">
                        {achievement.nextTierDescription}
                      </span>
                      {!achievement.isCompleted && (
                        <span className="text-xs font-medium whitespace-nowrap">
                          {achievement.progressTowardsNext}/{achievement.nextTierThresholdDisplay}
                        </span>
                      )}
                    </div>
                    {/* Only show progress bar if not completed */}
                    {!achievement.isCompleted && (
                      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            getProgressBarColor(achievement.isCompleted),
                          )}
                          style={{
                            width: `${(achievement.progressTowardsNext / achievement.nextTierThresholdDisplay) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
