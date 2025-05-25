'use client'

import { useState } from 'react'
import { BarChart, CheckCircle, Lock, Shield, Star } from 'lucide-react'
import Link from 'next/link'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { AchievementsDialog } from '@/core/gamification/achievements/components/achievements-dialog'
import { QuestsDialog } from '@/core/gamification/quests/components/quests-dialog' // Assuming path
import { DivisionLeaderboard } from '@/components/leaderboards/division/division-leaderboard'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { useSidebar } from '@/components/ui/sidebar'
// Import necessary types (adjust paths/definitions as needed)
import { DisplayAchievement } from '@/core/gamification/achievements/components/achievements-dialog' // Assuming type export
import { RankedLeaderboardUser } from '@/core/gamification/divisions' // Assuming type export
// Define or import Quest data type
// import { Quest } from '@/core/gamification/quests/types'

// Placeholder for Quest type if not readily available
type Quest = any

interface ProgressionGroupClientLayerProps {
  userId: string
  initialAchievements: DisplayAchievement[] | null
  initialAchievementsError: string | null
  initialLeaderboardData: RankedLeaderboardUser[] | null
  initialLeaderboardError: string | null
  currentUserLeaderboardId: string | null // From DivisionLeaderboard refactor plan
  initialQuestsData: Quest[] | null // Define Quest type properly
  initialQuestsError: string | null
}

export function ProgressionGroupClientLayer({
  userId,
  initialAchievements,
  initialAchievementsError,
  initialLeaderboardData,
  initialLeaderboardError,
  currentUserLeaderboardId,
  initialQuestsData,
  initialQuestsError,
}: ProgressionGroupClientLayerProps) {
  const [questsOpen, setQuestsOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [divisionLeaderboardOpen, setDivisionLeaderboardOpen] = useState(false)

  const { open } = useSidebar()

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Progression</SidebarGroupLabel>
        <SidebarMenu>
          {/* Quests Button */}
          <SidebarMenuItem key="quests">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setQuestsOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
                aria-label="Open Quests Dialog"
              >
                <CheckCircle className="size-4" />
                <span>Quests</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Achievements Button */}
          <SidebarMenuItem key="achievements">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setAchievementsOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
                aria-label="Open Achievements Dialog"
              >
                <Star className="size-4" />
                <span>Achievements</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Division Button */}
          <SidebarMenuItem key="division">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setDivisionLeaderboardOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
                aria-label="Open Division Leaderboard Dialog"
              >
                <Shield className="size-4" />
                <span>Division</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Leaderboard (Coming Soon) - No changes needed here */}
          <SidebarMenuItem key="leaderboard">
            <SidebarMenuButton asChild>
              <Link href="#" className="relative text-muted-foreground pr-8">
                <BarChart className="size-4" />
                <span>Leaderboard</span>
                  {open && (
                  <TooltipPrimitive.Root>
                    <TooltipPrimitive.Trigger asChild>
                      <Lock className="size-4 absolute right-2" />
                  </TooltipPrimitive.Trigger>
                  <TooltipContentCustom>Coming soon</TooltipContentCustom>
                </TooltipPrimitive.Root>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Render Dialogs/Sheets */}
      {/* Achievements Dialog */}
      <AchievementsDialog
        open={achievementsOpen}
        onOpenChange={setAchievementsOpen}
        initialAchievements={initialAchievements}
        initialError={initialAchievementsError}
        // No userId needed directly by the dialog anymore for fetching
      />

      {/* Quests Dialog */}
      {/* Ensure QuestsDialog is refactored similarly to AchievementsDialog */}
      <QuestsDialog
        // Assuming props like initialQuestsData, initialError after refactor
        isOpen={questsOpen}
        onOpenChange={setQuestsOpen}
        // initialQuests={initialQuestsData}
        // initialError={initialQuestsError}
        // Pass userId if needed for actions *within* the dialog
        // userId={userId}
      />

      {/* Division Leaderboard Dialog */}
      <Dialog open={divisionLeaderboardOpen} onOpenChange={setDivisionLeaderboardOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-6 w-6 text-primary" />
              Weekly Division Leaderboard
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Pass the correct props to the refactored DivisionLeaderboard */}
            <DivisionLeaderboard
              initialLeaderboardData={initialLeaderboardData}
              initialError={initialLeaderboardError}
              currentUserId={currentUserLeaderboardId}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
