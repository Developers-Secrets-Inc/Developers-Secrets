import { MainNavigationMenu } from '@/components/navigation-menu/header-navigation-menu'
import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { getUser } from '@/core/user'
import { AuthButtonsClient } from '@/components/buttons/AuthButtons.client'

export const HomeHeader = async () => {
  const user = await getUser()

  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 pl-8">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Eclipse />
        </Link>
        <MainNavigationMenu />
      </div>
      <AuthButtonsClient user={user} />
    </header>
  )
}
