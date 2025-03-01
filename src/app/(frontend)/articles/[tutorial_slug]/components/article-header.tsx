import { Eclipse } from 'lucide-react'
import { MainNavigationMenu } from '../[article_slug]/components/main-navigation-menu'
import { AuthButtons } from '../[article_slug]/components/auth-buttons'

export const ArticleHeader = () => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 pl-8">
      <div className="flex items-center gap-2">
        <Eclipse />
        <MainNavigationMenu />
      </div>
      <AuthButtons />
    </header>
  )
}
