import { Eclipse } from 'lucide-react'
import { MainNavigationMenu } from '../articles/[tutorial_slug]/(article)/[article_slug]/components/main-navigation-menu'
import { AuthButtons } from '@/components/buttons/AuthButtons'

export const HomeHeader = async () => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <Eclipse />
        <MainNavigationMenu />
      </div>
      <AuthButtons />
    </header>
  )
}
