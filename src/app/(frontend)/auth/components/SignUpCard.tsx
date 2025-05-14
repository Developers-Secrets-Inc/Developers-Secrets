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

// Helper function to calculate password strength and criteria
const analyzePassword = (password: string) => {
  let strength = 0
  const hasLength = password.length >= 8
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password)

  if (hasLength) strength++
  if (hasLowercase) strength++
  if (hasUppercase) strength++
  if (hasNumber) strength++
  if (hasSpecialChar) strength++

  return {
    strength, // Max strength is 5
    hasLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
  }
}

// Generates a concise message about missing password criteria
const getPasswordCriteriaMessage = (
  analysis: ReturnType<typeof analyzePassword>,
  passwordEntered: boolean,
): string => {
  if (!passwordEntered) return 'Use 8+ chars, uppercase, number, special.' // Initial guidance
  if (analysis.strength >= 5) return '' // All criteria met, strong enough

  const missing = []
  if (!analysis.hasLength) missing.push('8+ chars')
  if (!analysis.hasUppercase) missing.push('uppercase')
  if (!analysis.hasNumber) missing.push('number')
  if (!analysis.hasSpecialChar) missing.push('special char')

  if (missing.length === 0) return ''
  if (missing.length > 2) return `Needs ${missing.slice(0, 2).join(', ')}, and more.`
  return `Needs ${missing.join(' & ')}.`
}

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

  const [passwordAnalysis, setPasswordAnalysis] = useState(analyzePassword(''))
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)
  const [passwordCriteriaMessage, setPasswordCriteriaMessage] = useState(
    getPasswordCriteriaMessage(analyzePassword(''), false),
  )


  useEffect(() => {
    const analysis = analyzePassword(password)
    setPasswordAnalysis(analysis)
    setPasswordCriteriaMessage(getPasswordCriteriaMessage(analysis, password.length > 0))

    if (confirmPassword || password) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(null)
    }
  }, [password, confirmPassword])

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

    const currentPasswordAnalysis = analyzePassword(password)
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
    } else if (!currentPasswordAnalysis.hasLength) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (
      !currentPasswordAnalysis.hasUppercase ||
      !currentPasswordAnalysis.hasNumber ||
      !currentPasswordAnalysis.hasSpecialChar
    ) {
      newErrors.password = 'Password must include uppercase, number, and special character.'
    } else if (currentPasswordAnalysis.strength < 4) {
      newErrors.password = 'Password is too weak. Aim for a stronger combination.'
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
      const result = await loginWithGoogle()
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
      const result = await loginWithGitHub()
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

  const strengthBarColors = [
    'text-muted-foreground', // Strength 0 - Should not appear if password entered
    'text-red-500', // Strength 1 (Weak)
    'text-orange-500', // Strength 2 (Fair)
    'text-amber-500', // Strength 3 (Medium)
    'text-sky-500', // Strength 4 (Strong)
    'text-emerald-500', // Strength 5 (Very Strong)
  ]

  const strengthTextColors = [
    'text-muted-foreground', // Strength 0 - Should not appear if password entered
    'text-red-500', // Strength 1 (Weak)
    'text-orange-500', // Strength 2 (Fair)
    'text-amber-500', // Strength 3 (Medium)
    'text-sky-500', // Strength 4 (Strong)
    'text-emerald-500', // Strength 5 (Very Strong)
  ]

  const strengthLabels = ['', 'Weak', 'Fair', 'Medium', 'Strong', 'Very Strong']

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
          <div className="mt-1 space-y-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full transition-colors duration-300 ease-in-out w-1/5 ${
                    password.length === 0
                      ? 'bg-slate-100'
                      : passwordAnalysis.strength > i
                        ? strengthBarColors[passwordAnalysis.strength]
                        : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between min-w-0 pt-0.5">
              {password.length > 0 && strengthLabels[passwordAnalysis.strength] ? (
                <p
                  className={`text-xs font-medium shrink-0 ${strengthTextColors[passwordAnalysis.strength]}`}
                >
                  {strengthLabels[passwordAnalysis.strength]}
                </p>
              ) : (
                <div />
              )}
              {passwordCriteriaMessage && (
                <p className="text-xs text-muted-foreground truncate text-right">
                  {passwordCriteriaMessage}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              required
            />
            {(confirmPassword.length > 0 ||
              (password.length > 0 && confirmPassword.length === 0 && errors.confirmPassword)) &&
              passwordsMatch !== null && (
                <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none top-1/2 -translate-y-1/2 h-full">
                  {passwordsMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
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
