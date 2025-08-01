'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Book, GitMerge, Home, Trophy } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const learningItems = [
  {
    title: 'Home',
    icon: <Home className="size-4" />,
    href: '/home',
  },
  {
    title: 'Courses',
    icon: <Book className="size-4" />,
    href: '/courses',
  },
  {
    title: 'Challenges',
    icon: <Trophy className="size-4" />,
    href: '/challenges',
  },
  {
    title: 'Skills',
    icon: <GitMerge className="size-4" />,
    href: '/skills/python',
  },
]

export const LearningGroup = () => {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Learning</SidebarGroupLabel>
      <SidebarMenu>
        {learningItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              asChild
              isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
