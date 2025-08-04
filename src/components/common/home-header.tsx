import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { MainNavigationMenu } from '../navigation-menu/header-navigation-menu'
import { AuthButtons } from '../buttons/AuthButtons'

export const HomeHeader = () => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-14 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Eclipse />
        </Link>
        <MainNavigationMenu />
      </div>
      <AuthButtons />
    </header>
  )
}
