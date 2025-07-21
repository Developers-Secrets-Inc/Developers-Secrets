import { SignUpCard } from '../components/SignUpCard'
import { signup } from '@/actions/auth'

export default function SignUpPage() {
  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    'use server'
    const result = await signup(username, email, password)
    if (result.success) return { success: true }
    return {
      success: false,
      error: typeof result.error === 'string' ? result.error : result.error.message,
    }
  }

  return <SignUpCard onSubmit={handleSignUp} />
}
