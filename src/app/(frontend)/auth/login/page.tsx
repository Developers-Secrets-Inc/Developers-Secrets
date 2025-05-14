import { LoginCard } from '../components/LoginCard'
import { login } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'

export default function LoginPage() {
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    'use server'
    return await login(email, password, rememberMe)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <div className="flex flex-grow justify-center">
        <div className="flex w-full">
          <div className="w-1/2 pr-8 border-r border-border py-12 flex flex-col items-center justify-center">
            <LoginCard onSubmit={handleLogin} />
          </div>
          <div className="w-1/2 pl-8">
            {/* Content for the right column can be added here later */}
          </div>
        </div>
      </div>
    </div>
  )
}
