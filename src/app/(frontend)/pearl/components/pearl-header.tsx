import { MainNavigationMenu } from '@/components/navigation-menu/header-navigation-menu'
import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { AuthButtons } from '@/components/buttons/AuthButtons'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export const PearlHeader = () => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 size-5 cursor-pointer" />
        <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        <Link href="/">
          <Eclipse />
        </Link>
        <MainNavigationMenu />
      </div>
      <AuthButtons />
    </header>
  )
}
