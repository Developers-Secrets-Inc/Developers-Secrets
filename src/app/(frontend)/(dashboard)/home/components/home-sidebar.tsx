'use client'

import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Book,
  CheckCircle,
  HelpCircle,
  Home,
  MessageSquare,
  Star,
  Trophy,
  User,
  Users
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

import { ProCtaCard } from '@/components/cards/pro-cta-card'
import { FeedbackDialog } from '@/components/feedback-dialog'
import { SupportDialog } from '@/components/support-dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { LearningPathSwitcher } from './learning-path-switcher'
import { SearchForm } from './search-form'

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

export function HomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportStatus, setSupportStatus] = useState<{
    status: 'online' | 'maintenance' | 'offline'
    message: string
  }>({
    status: 'online',
    message: '',
  })

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
                <Link href="/courses">
                  <Book className="size-4" />
                  <span>Courses</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="challenges">
              <SidebarMenuButton asChild>
                <Link href="#">
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
                <Link href="#">
                  <CheckCircle className="size-4" />
                  <span>Quests</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="achievements">
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Star className="size-4" />
                  <span>Achievements</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="leaderboard">
              <SidebarMenuButton asChild>
                <Link href="#">
                  <BarChart className="size-4" />
                  <span>Leaderboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* Section Social */}
        <SidebarGroup>
          <SidebarGroupLabel>Social</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem key="guild">
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Users className="size-4" />
                  <span>Guild</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="profile">
              <SidebarMenuButton asChild>
                <Link href="/profile/me">
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
    </Sidebar>
  )
}
