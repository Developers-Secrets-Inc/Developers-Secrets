import { MainNavigationMenu } from '@/components/navigation-menu/header-navigation-menu'
import { AuthButtons } from '@/components/buttons/AuthButtons'
import { SidebarTrigger } from '@/components/ui/sidebar'

export const DashboardHeader = async () => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 pl-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="size-5 text-muted-foreground" />
        <MainNavigationMenu />
      </div>
      <AuthButtons />
    </header>
  )
}
