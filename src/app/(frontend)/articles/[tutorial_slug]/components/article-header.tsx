import { Eclipse } from "lucide-react"
import { NavigationMenuDemo } from "../[article_slug]/components/navigation-menu-demo"
import { AuthButtons } from "../[article_slug]/components/auth-buttons"



export const ArticleHeader = () => {
    return (
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 pl-8">
          <div className="flex items-center gap-2">
            <Eclipse />
            <NavigationMenuDemo />
          </div>
          <AuthButtons />
        </header>   
    )
}
