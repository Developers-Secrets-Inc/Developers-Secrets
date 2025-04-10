'use client'

import {
  BarChart,
  Book,
  CheckCircle,
  Command,
  HelpCircle,
  Home,
  MessageSquare,
  Search,
  Star,
  Trophy,
  User,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FeedbackDialog } from '@/components/feedback-dialog'
import { SupportDialog } from '@/components/support-dialog'
import { LearningPathSwitcher } from '@/app/(frontend)/(dashboard)/home/components/learning-path-switcher'

const navItems = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
    group: 'learning',
  },
  {
    title: 'Courses',
    url: '/courses',
    icon: Book,
    group: 'learning',
  },
  {
    title: 'Challenges',
    url: '#',
    icon: Trophy,
    group: 'learning',
  },
  {
    title: 'Guild',
    url: '#',
    icon: Users,
    group: 'social',
  },
  {
    title: 'Profile',
    url: '/profile/me',
    icon: User,
    group: 'social',
  },
  {
    title: 'Leaderboard',
    url: '#',
    icon: BarChart,
    group: 'progression',
  },
  {
    title: 'Quests',
    url: '#',
    icon: CheckCircle,
    group: 'progression',
  },
  {
    title: 'Achievements',
    url: '#',
    icon: Star,
    group: 'progression',
  },
]

const versions = ['1.0.1', '1.1.0-alpha', '2.0.0-beta1']

export function IconSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportStatus] = useState<{
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

  const groupedNavItems = navItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = []
      }
      acc[item.group].push(item)
      return acc
    },
    {} as Record<string, typeof navItems>,
  )

  return (
    <Sidebar
      collapsible="none"
      className="w-14 border-r bg-sidebar flex-shrink-0 flex flex-col"
      {...props}
    >
      <SidebarHeader className="h-12 flex items-center justify-center border-b border-sidebar-border">
        <SidebarMenuButton
          tooltip={{
            children: 'Switch Learning Path',
            hidden: false,
          }}
          asChild
          className="w-8 h-8 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <button onClick={() => console.log('Open learning path switcher')}>
            <Command className="size-4" />
          </button>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="flex-1 flex flex-col">
        <SidebarMenuButton
          tooltip={{
            children: 'Search',
            hidden: false,
          }}
          asChild
          className="w-full h-12 flex justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-b border-sidebar-border"
        >
          <button onClick={() => console.log('Open search')}>
            <Search className="size-4" />
          </button>
        </SidebarMenuButton>

        <div className="flex-1">
          {Object.entries(groupedNavItems).map(([group, items], groupIndex) => (
            <div key={group} className="flex flex-col">
              <SidebarGroup>
                <SidebarGroupLabel className="sr-only">{group}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="flex flex-col gap-0">
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title} className="flex-shrink-0">
                        <SidebarMenuButton
                          tooltip={{
                            children: item.title,
                            hidden: false,
                          }}
                          asChild
                          className="w-full h-12 flex justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <Link href={item.url}>
                            <item.icon className="size-4" />
                            <span className="sr-only">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {groupIndex < Object.entries(groupedNavItems).length - 1 && (
                <div className="h-px bg-sidebar-border" />
              )}
            </div>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border mt-auto">
        <SidebarMenu className="flex flex-col">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{
                children: 'Feedback',
                hidden: false,
              }}
              asChild
              className="w-full h-12 flex justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <button onClick={() => setFeedbackOpen(true)}>
                <MessageSquare className="size-4" />
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{
                children: 'Support',
                hidden: false,
              }}
              asChild
              className="w-full h-12 flex justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <button onClick={() => setSupportOpen(true)}>
                <div className="relative">
                  <HelpCircle className="size-4" />
                  <span
                    className={`absolute -top-1 -right-1 size-2 rounded-full ${getStatusColor()}`}
                    aria-hidden="true"
                  />
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      <SupportDialog
        open={supportOpen}
        onOpenChange={setSupportOpen}
        supportStatus={supportStatus}
      />
    </Sidebar>
  )
}
