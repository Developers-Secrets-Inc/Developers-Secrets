import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { BarChart, Book, CheckCircle, GitMerge, Home, Package, Shield, Star, Store, Trophy, User, Users } from 'lucide-react'

const socialItems = [
  {
    title: 'Marketplace',
    icon: <Store className="size-4" />,
    href: '/home',
  },
  {
    title: 'Inventory',
    icon: <Package className="size-4" />,
    href: '/courses',
  },
  {
    title: 'Guilds',
    icon: <Users className="size-4" />,
    href: '/challenges',
  },
  {
    title: 'Profile',
    icon: <User className="size-4" />,
    href: '/skills/python',
  },
]

export const SocialGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Social</SidebarGroupLabel>
      <SidebarMenu>
        {socialItems.map((item) => (
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
