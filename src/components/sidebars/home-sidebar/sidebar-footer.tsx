'use client'

import { ProCtaCard } from '@/components/cards/pro-cta-card'
import { FeedbackDialog } from '@/components/feedback-dialog'

import { useState } from 'react'

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ActiveEffect as ActiveEffectType } from '@/payload-types'
import { ActiveEffectDisplay } from '@/core/gamification/effects/components/active-effect-display'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { HelpCircle } from 'lucide-react'
import { PassiveBoostDisplay } from '@/core/gamification/effects/components/passive-boost-display'
import { SupportDialog } from '@/components/support-dialog'
import { HiddenOnIconSidebar } from '@/components/common/hidden-on-icon-sidebar'

interface HomeSidebarFooterProps {
  activeEffect: ActiveEffectType | null
  passiveXPMultiplier: number
}

export const HomeSidebarFooter = ({
  activeEffect,
  passiveXPMultiplier,
}: HomeSidebarFooterProps) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

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
        <HiddenOnIconSidebar>
          {shouldShowActive ? (
            <ActiveEffectDisplay
              activeEffect={activeEffect!}
              passiveMultiplier={passiveXPMultiplier}
            />
          ) : shouldShowPassive ? (
            <PassiveBoostDisplay multiplier={passiveXPMultiplier} />
          ) : null}
        </HiddenOnIconSidebar>
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
      <HiddenOnIconSidebar>
        <ProCtaCard />
      </HiddenOnIconSidebar>
    </SidebarFooter>
  )
}
