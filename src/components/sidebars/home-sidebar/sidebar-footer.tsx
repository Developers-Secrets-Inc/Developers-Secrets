'use client'


import { ProCtaCard } from "@/components/cards/pro-cta-card"
import { FeedbackDialog } from "@/components/feedback-dialog"

import { useEffect, useState } from 'react'

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { getActiveEffects, getPassiveXPBoostMultiplier } from '@/core/gamification/effects'
import { getSessionUser } from '@/core/user'
import { ActiveEffect as ActiveEffectType } from '@/payload-types'
import { ActiveEffectDisplay } from '@/core/gamification/effects/components/active-effect-display'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { HelpCircle } from 'lucide-react'
import { PassiveBoostDisplay } from '@/core/gamification/effects/components/passive-boost-display'
import { SupportDialog } from "@/components/support-dialog"

const EffectSkeleton = () => (
  <SidebarMenuItem>
    <div className="flex h-8 items-center gap-2 rounded-md px-2">
      <Skeleton className="size-4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </SidebarMenuItem>
)



export const HomeSidebarFooter = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
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

  const [supportStatus, setSupportStatus] = useState<{
    status: 'online' | 'maintenance' | 'offline'
    message: string
  }>({
    status: 'online',
    message: '',
  })

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
            <button onClick={() => setFeedbackOpen(true)} className="flex justify-between w-full">
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
            <button onClick={() => setSupportOpen(true)} className="flex justify-between w-full">
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

      <ProCtaCard />
    </SidebarFooter>
  )
}
