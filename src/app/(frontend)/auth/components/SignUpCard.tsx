'use client'

import { useId, useState, useEffect } from 'react'
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
import { useToast } from '@/components/ui/use-toast'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { CustomErrorToast } from './CustomErrorToast'
import { useQueryClient } from '@tanstack/react-query'
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
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [errorToastOpen, setErrorToastOpen] = useState(false)
  const [errorToastProps, setErrorToastProps] = useState({ title: '', description: '' })
  const queryClient = useQueryClient()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    if (Object.keys(errors).length > 0 && errors.password) {
      const { password: _p, ...rest } = errors // renamed to avoid conflict with outer scope password
      setErrors(rest)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    if (Object.keys(errors).length > 0 && errors.confirmPassword) {
      const { confirmPassword: _cp, ...rest } = errors // renamed to avoid conflict
      setErrors(rest)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must include at least one uppercase letter'
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must include at least one number'
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      newErrors.password = 'Password must include at least one special character'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const result = await onSubmit(username, email, password, rememberMe)
      if (!result.success) {
        setErrorToastProps({
          title: 'Sign Up Failed',
          description: result.error || 'An unexpected error occurred. Please try again.',
        })
        setErrorToastOpen(true)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['sessionUser'] })
        router.push('/auth/onboarding?step=1')
      }
    } catch (error: any) {
      if (!error.digest?.startsWith('NEXT_REDIRECT')) {
        console.error('Signup error:', error)
        setErrorToastProps({
          title: 'Sign Up Error',
          description: 'An unexpected error occurred. Please try again.',
        })
        setErrorToastOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await loginWithGoogle('/dashboard')
      if (result.success && result.url) {
        router.push(result.url)
      } else if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Google Login Failed',
          description: result.error || 'Could not sign in with Google. Please try again.',
        })
      }
    } catch (error: any) {
      if (!error.digest?.startsWith('NEXT_REDIRECT')) {
        console.error('Google login error:', error)
        toast({
          variant: 'destructive',
          title: 'Google Login Error',
          description: 'An unexpected error occurred. Please try again.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      const result = await loginWithGitHub('/dashboard')
      if (result.success && result.url) {
        router.push(result.url)
      } else if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'GitHub Login Failed',
          description: result.error || 'Could not sign in with GitHub. Please try again.',
        })
      }
    } catch (error: any) {
      if (!error.digest?.startsWith('NEXT_REDIRECT')) {
        console.error('GitHub login error:', error)
        toast({
          variant: 'destructive',
          title: 'GitHub Login Error',
          description: 'An unexpected error occurred. Please try again.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <CustomErrorToast
        open={errorToastOpen}
        onOpenChange={setErrorToastOpen}
        title={errorToastProps.title}
        description={errorToastProps.description}
      />
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Sign up to access all features</p>
      </div>
      <div>
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
            onChange={handlePasswordChange}
            error={errors.password}
            required
          />

          <div className="relative">
            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me-signup"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label
              htmlFor="remember-me-signup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign up'}
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
      </div>
      <div className="flex justify-center pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
