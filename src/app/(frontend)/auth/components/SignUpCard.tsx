'use client'

import { useState } from 'react'
import { EmailInput } from '@/components/inputs/EmailInput'
import { UsernameInput } from '@/components/inputs/UsernameInput'
import { PasswordInput } from '@/components/inputs/PasswordInput'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { OAuth2Buttons } from '@/components/buttons/OAuth2Buttons'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { loginWithGoogle, loginWithGitHub } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface SignUpCardProps {
  onSubmit: (
    username: string,
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<{
    success: boolean
    error?: string
    url?: string
  }>
}

export function SignUpCard({ onSubmit }: SignUpCardProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: {
      username?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!username) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})

    try {
      const result = await onSubmit(username, email, password, rememberMe)

      if (!result.success) {
        toast.error(result.error || 'An error occurred during registration.')
      } else if (result.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An error occurred during registration.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle()

      if (result && result.success && result.url) {
        router.push(result.url)
      } else {
        toast.error(result?.error || 'An error occurred during Google login.')
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('An error occurred during Google login.')
    }
  }

  const handleGitHubLogin = async () => {
    try {
      const result = await loginWithGitHub()

      if (result && result.success && result.url) {
        router.push(result.url)
      } else {
        toast.error(result?.error || 'An error occurred during GitHub login.')
      }
    } catch (error) {
      console.error('GitHub login error:', error)
      toast.error('An error occurred during GitHub login.')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Sign up to access all features</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UsernameInput
            label="Username"
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            required
          />

          <EmailInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <Button type="submit" className="w-full">
            Sign up
          </Button>

          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-muted-foreground text-sm">
                Or continue with
              </span>
            </div>
          </div>

          <OAuth2Buttons onGoogleClick={handleGoogleLogin} onGitHubClick={handleGitHubLogin} />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
