import { Eclipse } from 'lucide-react'
import { MainNavigationMenu } from './main-navigation-menu'
import { AuthButtons } from './auth-buttons'

export const ExampleHeader = () => {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 pl-8">
      <div className="flex items-center gap-2">
        <Eclipse />
        <MainNavigationMenu />
      </div>
      <AuthButtons />
    </header>
  )
}
