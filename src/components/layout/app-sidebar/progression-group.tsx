import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { BarChart, Book, CheckCircle, GitMerge, Home, Shield, Star, Trophy } from 'lucide-react'

const progressionItems = [
  {
    title: 'Quests',
    icon: <CheckCircle className="size-4" />,
    href: '/home',
  },
  {
    title: 'Achievements',
    icon: <Star className="size-4" />,
    href: '/courses',
  },
  {
    title: 'Leagues',
    icon: <Shield className="size-4" />,
    href: '/challenges',
  },
  {
    title: 'Leaderboard',
    icon: <BarChart className="size-4" />,
    href: '/skills/python',
  },
]

export const ProgressionGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Progression</SidebarGroupLabel>
      <SidebarMenu>
        {progressionItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon}
              {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
