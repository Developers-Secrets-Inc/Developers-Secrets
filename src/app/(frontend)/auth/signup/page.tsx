import { SignUpCard } from '../components/SignUpCard'
import { signup } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'


export default function SignUpPage() {
  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    'use server'
    try {
      const result = await signup(username, email, password)
      return result
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'An error occurred during registration.' }
    }
  }

  return (
    <div>
      <HomeHeader />
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <SignUpCard onSubmit={handleSignUp} />
        </div>
      </div>
    </div>
  )
}
