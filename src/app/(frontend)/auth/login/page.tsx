import { LoginCard } from '../components/LoginCard'
import { login } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    'use server'
    try {
      const result = await login(email, password, rememberMe)
      return result
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An error occurred during login.' }
    }
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
