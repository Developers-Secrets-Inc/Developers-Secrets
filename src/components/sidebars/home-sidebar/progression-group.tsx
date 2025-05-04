import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import {
  BarChart,
  CheckCircle,
  Lock,
  Shield,
  Star,
  Code,
  Flame,
  BookOpen,
  Target,
  Sword,
  Coins,
  Award,
} from 'lucide-react'

import { DivisionLeaderboard } from '@/components/leaderboards/division/division-leaderboard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { AchievementsDialog } from '@/core/gamification/achievements/components/achievements-dialog'
import Link from 'next/link'

import { QuestsDialog } from '@/core/gamification/quests/components/quests-dialog'

// Import server-side data fetching functions
import { getAchievements } from '@/core/gamification/achievements'
import { getAllUserAchievementProgress } from '@/core/gamification/achievements/user-progress'
import { getUserDivisionLeaderboard } from '@/core/gamification/divisions'
// Assuming a function to get quests data exists
// import { getUserQuests } from '@/core/gamification/quests/user-quests'

// Import the client layer component
import { ProgressionGroupClientLayer } from './progression-group-client-layer'

// Import necessary types (Payload types)
import { Achievement as PayloadAchievement, UserAchievementProgress } from '@/payload-types'
import { DisplayAchievement } from '@/core/gamification/achievements/components/achievements-dialog' // Assuming type export
import { RankedLeaderboardUser } from '@/core/gamification/divisions' // Assuming type export

// Placeholder for Quest type if not readily available
type Quest = any

// Helper function to process achievements data
function processAchievementsData(
  allAchievementsData: PayloadAchievement[],
  userProgressData: UserAchievementProgress[],
): Omit<DisplayAchievement, 'iconComponent'>[] {
  const progressMap = new Map<string | number, UserAchievementProgress>()
  userProgressData.forEach((p) => {
    if (p.achievement && typeof p.achievement === 'object' && p.achievement.id) {
      progressMap.set(p.achievement.id, p)
    } else if (typeof p.achievement === 'number' || typeof p.achievement === 'string') {
      progressMap.set(p.achievement, p)
    }
  })

  const processedAchievements = allAchievementsData
    .map((ach): Omit<DisplayAchievement, 'iconComponent'> | null => {
      if (!ach.tiers || ach.tiers.length === 0 || !ach.type) return null

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

      return {
        ...ach,
        userProgress,
        displayLevel,
        maxLevel,
        progressTowardsNext: isCompleted ? nextTierThresholdDisplay : progressTowardsNext,
        nextTierThresholdDisplay,
        nextTierDescription,
        isCompleted,
        type: ach.type,
      }
    })
    .filter((a): a is Omit<DisplayAchievement, 'iconComponent'> => a !== null)

  return processedAchievements.sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1
    }
    return a.title.localeCompare(b.title)
  })
}

// Refactored ProgressionGroup as an async Server Component
export const ProgressionGroup = async ({ userId }: { userId: string }) => {
  // Removed useState hooks

  // Fetch all necessary data in parallel
  const results = await Promise.allSettled([
    getAchievements(),
    getAllUserAchievementProgress(userId, false),
    getUserDivisionLeaderboard(userId),
    // getUserQuests(userId), // Uncomment when quest fetching is implemented
    Promise.resolve(null), // Placeholder for quests
  ])

  // Process results, handling potential errors for each fetch
  let initialAchievements: Omit<DisplayAchievement, 'iconComponent'>[] | null = null
  let initialAchievementsError: string | null = null
  if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
    try {
      initialAchievements = processAchievementsData(results[0].value, results[1].value)
    } catch (err) {
      console.error('Error processing achievements data:', err)
      initialAchievementsError = 'Failed to process achievement data.'
    }
  } else {
    initialAchievementsError = 'Failed to load achievements data.'
    if (results[0].status === 'rejected')
      console.error('getAchievements failed:', results[0].reason)
    if (results[1].status === 'rejected')
      console.error('getAllUserAchievementProgress failed:', results[1].reason)
  }

  const initialLeaderboardData = results[2].status === 'fulfilled' ? results[2].value : null
  const initialLeaderboardError =
    results[2].status === 'rejected' ? 'Failed to load division leaderboard data.' : null
  if (results[2].status === 'rejected') {
    console.error('getUserDivisionLeaderboard failed:', results[2].reason)
  }

  // TODO: Process quest results when implemented
  const initialQuestsData: Quest[] | null =
    results[3].status === 'fulfilled' ? results[3].value : null
  const initialQuestsError: string | null =
    results[3].status === 'rejected' ? 'Failed to load quests data.' : null
  if (results[3].status === 'rejected') {
    // Uncomment and potentially log the reason when quest fetching is implemented
    // console.error('getUserQuests failed:', results[3].reason)
  }

  // Pass fetched data (without iconComponent) to the client layer component
  return (
    <ProgressionGroupClientLayer
      userId={userId}
      initialAchievements={initialAchievements}
      initialAchievementsError={initialAchievementsError}
      initialLeaderboardData={initialLeaderboardData}
      initialLeaderboardError={initialLeaderboardError}
      currentUserLeaderboardId={userId}
      initialQuestsData={initialQuestsData}
      initialQuestsError={initialQuestsError}
    />
  )
}
