'use client'

import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Book,
  CheckCircle,
  HelpCircle,
  Home,
  Lock,
  MessageSquare,
  Package,
  Shield,
  Star,
  Store,
  Trophy,
  User,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { useState, useEffect } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { cn } from '@/lib/utils'

import { ProCtaCard } from '@/components/cards/pro-cta-card'
import { FeedbackDialog } from '@/components/feedback-dialog'
import { SupportDialog } from '@/components/support-dialog'
import { QuestsDialog } from '@/core/gamification/quests/components/quests-dialog'
import { AchievementsDialog } from '@/core/gamification/achievements/components/achievements-dialog'
import { MarketplaceDialog } from '@/core/gamification/marketplace/components/dialogs/marketplace-dialog'
import { InventorySheet } from '@/core/gamification/inventory/components/sheets/inventory-sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DivisionLeaderboard } from '@/components/leaderboards/division/division-leaderboard'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { LearningPathSwitcher } from './learning-path-switcher'
import { SearchForm } from './search-form'
import { ActiveEffectDisplay } from '@/core/gamification/effects/components/active-effect-display'
import { PassiveBoostDisplay } from '@/core/gamification/effects/components/passive-boost-display'
import { getActiveEffects, getPassiveXPBoostMultiplier } from '@/core/gamification/effects'
import { ActiveEffect as ActiveEffectType } from '@/payload-types'
import { Skeleton } from '@/components/ui/skeleton'
import { getSessionUser } from '@/core/user'

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Courses',
      url: '#',
      icon: Book,
    },
    {
      title: 'Challenges',
      url: '#',
      icon: Trophy,
    },
    {
      title: 'Guild',
      url: '#',
      icon: Users,
    },
    {
      title: 'Profile',
      url: '#',
      icon: User,
    },
    {
      title: 'Leaderboard',
      url: '#',
      icon: BarChart,
    },
    {
      title: 'Quests',
      url: '#',
      icon: CheckCircle,
    },
    {
      title: 'Achievements',
      url: '#',
      icon: Star,
    },
  ],
}

// Skeleton for loading state
const EffectSkeleton = () => (
  <SidebarMenuItem>
    <div className="flex h-8 items-center gap-2 rounded-md px-2">
      <Skeleton className="size-4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </SidebarMenuItem>
)

export function HomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [questsOpen, setQuestsOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [marketplaceOpen, setMarketplaceOpen] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [divisionLeaderboardOpen, setDivisionLeaderboardOpen] = useState(false)
  const [supportStatus, setSupportStatus] = useState<{
    status: 'online' | 'maintenance' | 'offline'
    message: string
  }>({
    status: 'online',
    message: '',
  })
  const [isLoadingEffects, setIsLoadingEffects] = useState(true)
  const [activeEffect, setActiveEffect] = useState<ActiveEffectType | null>(null)
  const [passiveXPMultiplier, setPassiveXPMultiplier] = useState<number>(1)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchInitialData() {
      setIsLoadingEffects(true)
      const userResult = await getSessionUser()
      if (!userResult.success || !isMounted) {
        setIsLoadingEffects(false)
        setUserId(null)
        return
      }
      const currentUserId = userResult.value.id
      setUserId(currentUserId)

      try {
        const [effects, passiveXP] = await Promise.all([
          getActiveEffects(currentUserId),
          getPassiveXPBoostMultiplier(currentUserId),
        ])

        if (!isMounted) return

        const currentActive = effects.find((e) => e.effectType === 'xpBoost') || effects[0] || null

        setActiveEffect(currentActive)
        setPassiveXPMultiplier(passiveXP)
      } catch (error) {
        console.error('Error fetching effects:', error)
        if (isMounted) {
          setActiveEffect(null)
          setPassiveXPMultiplier(1)
        }
      } finally {
        if (isMounted) {
          setIsLoadingEffects(false)
        }
      }
    }

    fetchInitialData()
    const interval = setInterval(fetchInitialData, 60000 * 2)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const shouldShowActive = activeEffect && activeEffect.effectType === 'xpBoost'
  const shouldShowPassive = passiveXPMultiplier > 1 && !shouldShowActive

  // Fonction pour déterminer la couleur de l'indicateur de statut
  const getStatusColor = () => {
    switch (supportStatus.status) {
      case 'online':
        return 'bg-emerald-500'
      case 'maintenance':
        return 'bg-amber-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-emerald-500'
    }
  }

  return (
    <TooltipPrimitive.Provider>
      <Sidebar style={{ '--sidebar-width': '270px' } as React.CSSProperties} className="z-50">
        <SidebarHeader>
          <LearningPathSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
          <SearchForm />
        </SidebarHeader>
        <SidebarContent className="gap-0">
          {/* Section Learning */}
          <SidebarGroup>
            <SidebarGroupLabel>Learning</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem key="home">
                <SidebarMenuButton asChild>
                  <Link href="/home">
                    <Home className="size-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="courses">
                <SidebarMenuButton asChild>
                  <Link href="/courses" className="relative text-muted-foreground pr-8">
                    <Book className="size-4" />
                    <span>Courses</span>
                    <TooltipPrimitive.Root>
                      <TooltipPrimitive.Trigger asChild>
                        <Lock className="size-4 absolute right-2" />
                      </TooltipPrimitive.Trigger>
                      <TooltipContentCustom>Coming soon</TooltipContentCustom>
                    </TooltipPrimitive.Root>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="challenges">
                <SidebarMenuButton asChild>
                  <Link href="/challenges">
                    <Trophy className="size-4" />
                    <span>Challenges</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Section Progression */}
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
          {/* Section Social */}
          <SidebarGroup>
            <SidebarGroupLabel>Social</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem key="marketplace">
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setMarketplaceOpen(true)}
                    className="flex w-full items-center gap-2 cursor-pointer"
                  >
                    <Store className="size-4" />
                    <span>Marketplace</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="inventory">
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setInventoryOpen(true)}
                    className="flex w-full items-center gap-2 cursor-pointer"
                  >
                    <Package className="size-4" />
                    <span>Inventory</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="guild">
                <SidebarMenuButton asChild>
                  <Link href="#" className="relative text-muted-foreground pr-8">
                    <Users className="size-4" />
                    <span>Guild</span>
                    <TooltipPrimitive.Root>
                      <TooltipPrimitive.Trigger asChild>
                        <Lock className="size-4 absolute right-2" />
                      </TooltipPrimitive.Trigger>
                      <TooltipContentCustom>Coming soon</TooltipContentCustom>
                    </TooltipPrimitive.Root>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="profile">
                <SidebarMenuButton asChild>
                  <Link
                    href="/profile/me"
                    className="flex w-full items-center gap-2 cursor-pointer"
                  >
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {isLoadingEffects ? (
              <EffectSkeleton />
            ) : shouldShowActive ? (
              <ActiveEffectDisplay
                activeEffect={activeEffect!}
                passiveMultiplier={passiveXPMultiplier}
              />
            ) : shouldShowPassive ? (
              <PassiveBoostDisplay multiplier={passiveXPMultiplier} />
            ) : null}
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="cursor-pointer">
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="flex justify-between w-full"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="size-4" />
                    Feedback
                  </span>
                  <svg
                    className="text-muted-foreground"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="cursor-pointer">
                <button
                  onClick={() => setSupportOpen(true)}
                  className="flex justify-between w-full"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="size-4" />
                    Support
                  </span>
                  <Badge variant="outline" className="gap-1.5 rounded-sm">
                    <span
                      className={`size-1.5 rounded-full ${getStatusColor()}`}
                      aria-hidden="true"
                    ></span>
                    {supportStatus.status === 'online'
                      ? 'Online'
                      : supportStatus.status === 'maintenance'
                        ? 'Maintenance'
                        : 'Offline'}
                  </Badge>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
          <SupportDialog
            open={supportOpen}
            onOpenChange={setSupportOpen}
            supportStatus={supportStatus}
          />
          <QuestsDialog isOpen={questsOpen} onOpenChange={setQuestsOpen} />
          {typeof userId === 'string' && (
            <AchievementsDialog
              open={achievementsOpen}
              onOpenChange={setAchievementsOpen}
              userId={userId}
            />
          )}
          <MarketplaceDialog open={marketplaceOpen} onOpenChange={setMarketplaceOpen} />
          <InventorySheet open={inventoryOpen} onOpenChange={setInventoryOpen} />
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
          <ProCtaCard />
        </SidebarFooter>
      </Sidebar>
    </TooltipPrimitive.Provider>
  )
}
