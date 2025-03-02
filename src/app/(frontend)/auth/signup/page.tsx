'use client'

import { useState } from 'react'
import { SignUpCard } from '../components/SignUpCard'
import { signup, loginWithGoogle, loginWithGitHub } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    setIsLoading(true)
    try {
      const result = await signup(username, email, password)

      if (result && !result.success) {
        toast.error(result.error || 'An error occurred during registration.')
      }
      // If successful, the user will be redirected to the home page by the server action
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An error occurred during registration.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await loginWithGoogle()

      if (result && result.success && result.url) {
        router.push(result.url)
      } else {
        toast.error(result?.error || 'An error occurred during Google login.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('An error occurred during Google login.')
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      const result = await loginWithGitHub()

      if (result && result.success && result.url) {
        router.push(result.url)
      } else {
        toast.error(result?.error || 'An error occurred during GitHub login.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('GitHub login error:', error)
      toast.error('An error occurred during GitHub login.')
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <SignUpCard
          onSubmit={handleSignUp}
          isLoading={isLoading}
          onGoogleClick={handleGoogleLogin}
          onGitHubClick={handleGitHubLogin}
        />
      </div>
    </div>
  )
}
