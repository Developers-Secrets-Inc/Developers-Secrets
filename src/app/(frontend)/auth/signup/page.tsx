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
    return await signup(username, email, password)
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
