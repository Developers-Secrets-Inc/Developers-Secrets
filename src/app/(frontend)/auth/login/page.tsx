import { LoginCard } from '../components/LoginCard'
import { login } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'

export default function LoginPage() {
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    'use server'
    return await login(email, password, rememberMe)
  }

  return (
    <div>
      <HomeHeader />
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <LoginCard onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  )
}
