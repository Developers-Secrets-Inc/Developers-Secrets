'use client'

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { BarChart, CheckCircle, Lock, Shield, Star } from 'lucide-react'
import { useState } from 'react'

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

export const ProgressionGroup = ({ userId }: { userId: string }) => {
  const [questsOpen, setQuestsOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [divisionLeaderboardOpen, setDivisionLeaderboardOpen] = useState(false)

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Progression</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem key="quests">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setQuestsOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="size-4" />
                <span>Quests</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem key="achievements">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setAchievementsOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
              >
                <Star className="size-4" />
                <span>Achievements</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem key="division">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setDivisionLeaderboardOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
              >
                <Shield className="size-4" />
                <span>Division</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem key="leaderboard">
            <SidebarMenuButton asChild>
              <Link href="#" className="relative text-muted-foreground pr-8">
                <BarChart className="size-4" />
                <span>Leaderboard</span>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <Lock className="size-4 absolute right-2" />
                  </TooltipPrimitive.Trigger>
                  <TooltipContentCustom>Coming soon</TooltipContentCustom>
                </TooltipPrimitive.Root>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {typeof userId === 'string' && (
        <AchievementsDialog
          open={achievementsOpen}
          onOpenChange={setAchievementsOpen}
          userId={userId}
        />
      )}
      <QuestsDialog open={questsOpen} onOpenChange={setQuestsOpen} />

      <Dialog open={divisionLeaderboardOpen} onOpenChange={setDivisionLeaderboardOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-6 w-6 text-primary" />
              Weekly Division Leaderboard
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            <DivisionLeaderboard />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
