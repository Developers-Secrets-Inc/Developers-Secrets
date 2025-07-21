import { Button } from "@/components/ui/button"
import { Eclipse } from "lucide-react"
import { HeaderNavigationMenu } from "./navigation-menu/header-navigation-menu"



export const Header = () => {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Eclipse className="h-6 w-6" />
        <HeaderNavigationMenu />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
        <Button size="sm">Sign Up</Button>
      </div>
    </header>
  )
}
