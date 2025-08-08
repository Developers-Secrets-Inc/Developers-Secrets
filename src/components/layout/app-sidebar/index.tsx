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
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Book, Eclipse } from 'lucide-react'
import Link from 'next/link'
import { LearningGroup } from './learning-group'
import { ProgressionGroup } from './progression-group'
import { SocialGroup } from './social-group'
import { FeedbackButton } from './feedback-button'
import { SupportButton } from './support-button'
import { ProCtaCard } from '@/components/cards/pro-cta-card'
import {
  AchievementsDialog,
  FeedbackDialog,
  InventoryDialog,
  LeaderboardDialog,
  LeaguesLeaderboard,
  MarketplaceInventory,
  QuestsDialog,
  SupportDialog,
} from './dialogs'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result'
import { redirect } from 'next/navigation'
import { MainSidebarNews } from '@/components/sidebar/main-sidebar-news'

export const HomeButton = () => {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer"
      asChild
    >
      <Link href="/">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Eclipse className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold">Developers Secrets</span>
        </div>
      </Link>
    </SidebarMenuButton>
  )
}

export const AppSidebar = async () => {
  const user = await getUser()

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  return (
    <Sidebar
      collapsible="icon"
      // style={{ '--sidebar-width': '270px' } as React.CSSProperties}
      className="z-50"
    >
      <SidebarHeader className="flex items-center justify-center h-14">
        <SidebarMenu>
          <SidebarMenuItem>
            <HomeButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <LearningGroup />
        <ProgressionGroup />
        <SocialGroup />
      </SidebarContent>

      {/* Dialog Components */}
      <AchievementsDialog />
      <FeedbackDialog />
      <InventoryDialog />
      <LeaderboardDialog />
      <LeaguesLeaderboard />
      <MarketplaceInventory />
      <QuestsDialog />
      <SupportDialog />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <FeedbackButton />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SupportButton status="online" />
          </SidebarMenuItem>
          <SidebarMenuItem>
            {user.value.informations.role === 'basic' ? <ProCtaCard /> : <MainSidebarNews />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
