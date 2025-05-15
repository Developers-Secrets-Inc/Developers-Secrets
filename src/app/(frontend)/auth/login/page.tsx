import { login } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { LoginPageClient } from '../components/LoginPageClient'

export default function LoginPage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  // Récupérer le paramètre redirect de la query string
  const redirectTo =
    searchParams?.redirect && searchParams.redirect.startsWith('/')
      ? searchParams.redirect
      : undefined

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <LoginPageClient loginAction={login} redirectTo={redirectTo} />
    </div>
  )
}
