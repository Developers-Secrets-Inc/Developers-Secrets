import { AuthButtons } from '@/components/buttons/AuthButtons'
import { MainNavigationMenu } from '@/components/navigation-menu/header-navigation-menu'
import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { NotificationButton } from './notification-button'

export const HomeHeader = () => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 pl-8">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Eclipse />
        </Link>
        <MainNavigationMenu />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <NotificationButton />
        <AuthButtons />
      </div>
    </header>
  )
}
