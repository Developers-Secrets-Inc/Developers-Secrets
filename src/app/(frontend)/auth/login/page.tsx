'use client'

import { useState } from 'react'
import { LoginCard } from '../components/LoginCard'
import { login, loginWithGoogle, loginWithGitHub } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true)
    try {
      const result = await login(email, password, rememberMe)

      if (result && !result.success) {
        toast.error(result.error || 'An error occurred during login.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login.')
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
        <LoginCard
          onSubmit={handleLogin}
          isLoading={isLoading}
          onGoogleClick={handleGoogleLogin}
          onGitHubClick={handleGitHubLogin}
        />
      </div>
    </div>
  )
}
