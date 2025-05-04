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
import { cn } from '@/lib/utils'
import { Achievement as PayloadAchievement, UserAchievementProgress } from '@/payload-types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  Code,
  Coins,
  Flame,
  Star,
  Sword,
  Target,
  ShieldAlert,
  LucideProps,
} from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

// Re-introduce typeIconMap inside the Client Component
const typeIconMap: Record<
  Exclude<PayloadAchievement['type'], undefined | null>,
  React.ElementType
> = {
  experience_gained: Star,
  challenges_completed: Code,
  streak: Flame,
  tutorials_completed: BookOpen,
  quests_completed: Target,
  items_used: Sword,
  coins_earned: Coins,
  // Add other types if needed
}

// Define the new props structure (accepts data without iconComponent)
export interface DisplayAchievement extends Omit<PayloadAchievement, 'type'> {
  // Base type from payload
  type: Exclude<PayloadAchievement['type'], undefined | null> // Ensure type is a valid key for map
  userProgress?: UserAchievementProgress
  displayLevel: number
  maxLevel: number
  progressTowardsNext: number
  nextTierThresholdDisplay: number
  nextTierDescription: string
  // iconComponent is removed
  isCompleted: boolean
}

interface AchievementsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialAchievements: DisplayAchievement[] | null // Accepts data without iconComponent
  initialError: string | null
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

// Define the expected icon type
type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

// Updated component using pre-fetched data
export function AchievementsDialog({
  open,
  onOpenChange,
  initialAchievements,
  initialError,
}: AchievementsDialogProps) {
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

  const isLoading = initialAchievements === null && initialError === null
  const achievements = initialAchievements ?? []
  const error = initialError

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">Achievements</DialogTitle>
          <DialogDescription>
            Track your progress and earn rewards by completing achievements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {isLoading ? (
            [...Array(6)].map((_, index) => <AchievementSkeleton key={index} />)
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-10">
              <ShieldAlert className="mx-auto size-10 mb-2" />
              {error}
            </div>
          ) : achievements.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No achievements available yet.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {achievements.map((achievement) => {
                const achievementType = achievement.type
                // Explicitly type IconComponent
                let IconComponent: LucideIcon = Award // Default to Award icon (which matches LucideIcon type)

                if (achievementType && typeIconMap.hasOwnProperty(achievementType)) {
                  // Cast the result from the map to the expected type
                  IconComponent = typeIconMap[achievementType] as LucideIcon
                } else {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn(
                      `Invalid or missing achievement type: '${achievementType}' for achievement ID ${achievement.id}. Using fallback icon.`,
                    )
                  }
                  // IconComponent remains Award
                }

                return (
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
                        <IconComponent className="h-5 w-5" />
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
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
