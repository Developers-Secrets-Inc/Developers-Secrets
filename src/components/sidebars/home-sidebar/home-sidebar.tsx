import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Book, GitMerge, Home, Lock, Trophy } from 'lucide-react'
import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getSessionUser } from '@/core/user'
import { isError } from '@/core/user/result'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LearningPathSwitcher } from './learning-path-switcher'
import { ProgressionGroup } from './progression-group'
import { SearchForm } from './search-form'
import { HomeSidebarFooter } from './sidebar-footer'
import { SocialGroup } from './social-group'
import { getActiveEffects, getPassiveXPBoostMultiplier } from '@/core/gamification/effects'
import { ActiveEffect } from '@/payload-types'

const ComingSoonTooltip = () => {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <Lock className="size-4 absolute right-2" />
      </TooltipPrimitive.Trigger>
    </TooltipPrimitive.Root>
  )
}

const SidebarLink = ({
  href,
  text,
  icon,
  isComingSoon,
}: {
  href: string
  text: string
  icon: React.ReactNode
  isComingSoon?: boolean
}) => {
  return (
    <SidebarMenuItem key={text.toLowerCase().replace(' ', '-')}>
      <SidebarMenuButton asChild>
        <Link href={href} className={cn('relative pr-8', isComingSoon && 'text-muted-foreground')}>
          {icon}
          <span>{text}</span>
          {isComingSoon && <ComingSoonTooltip />}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const LearningGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Learning</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarLink href="/home" text="Home" icon={<Home className="size-4" />} />
        <SidebarLink href="/courses" text="Courses" icon={<Book className="size-4" />} />
        <SidebarLink href="/challenges" text="Challenges" icon={<Trophy className="size-4" />} />
        <SidebarLink href="/skills" text="Skills" icon={<GitMerge className="size-4" />} />
      </SidebarMenu>
    </SidebarGroup>
  )
}

// Skeleton for loading state


export const HomeSidebar = async () => {
  const user = await getSessionUser()

  if (isError(user)) {
    return null
  }

  const userId = user.value.id

  // Fetch effects data
  const [effects, passiveXP] = await Promise.all([
    getActiveEffects(userId),
    getPassiveXPBoostMultiplier(userId),
  ])
  const activeEffect = effects.find((e) => e.effectType === 'xpBoost') || effects[0] || null

  // Fonction pour déterminer la couleur de l'indicateur de statut

  return (
    <TooltipPrimitive.Provider>
      <Sidebar style={{ '--sidebar-width': '270px' } as React.CSSProperties} className="z-50">
        <SidebarHeader>
          <LearningPathSwitcher />
          <SearchForm />
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <LearningGroup />
          <ProgressionGroup userId={userId} />
          <SocialGroup />
        </SidebarContent>
        <HomeSidebarFooter activeEffect={activeEffect} passiveXPMultiplier={passiveXP} />
      </Sidebar>
    </TooltipPrimitive.Provider>
  )
}
