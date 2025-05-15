import { login } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { LoginPageClient } from '../components/LoginPageClient'

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <LoginPageClient loginAction={login} />
    </div>
  )
}
