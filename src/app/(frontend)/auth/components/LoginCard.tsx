'use client'

import { useState } from 'react'
import { EmailInput } from '@/components/inputs/EmailInput'
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

interface LoginCardProps {
  onSubmit: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<{
    success: boolean
    error?: string
    url?: string
  }>
}

export function LoginCard({ onSubmit }: LoginCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})

    try {
      await onSubmit(email, password, rememberMe)
    } catch (error: any) {
      // Si c'est une redirection Next.js, ne pas traiter comme une erreur
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        return
      }
      console.error('Login error:', error)
      toast.error('An error occurred during login.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle()

      if (result && result.success && result.url) {
        router.push(result.url)
      } else if (!result?.success) {
        toast.error(result?.error || 'An error occurred during Google login.')
      }
    } catch (error: any) {
      // Si c'est une redirection Next.js, ne pas traiter comme une erreur
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        return
      }
      console.error('Google login error:', error)
      toast.error('An error occurred during Google login.')
    }
  }

  const handleGitHubLogin = async () => {
    try {
      const result = await loginWithGitHub()

      if (result && result.success && result.url) {
        router.push(result.url)
      } else if (!result?.success) {
        toast.error(result?.error || 'An error occurred during GitHub login.')
      }
    } catch (error: any) {
      // Si c'est une redirection Next.js, ne pas traiter comme une erreur
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        return
      }
      console.error('GitHub login error:', error)
      toast.error('An error occurred during GitHub login.')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Sign in to your account to access your personal dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between">
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

            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full">
            Sign in
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
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
