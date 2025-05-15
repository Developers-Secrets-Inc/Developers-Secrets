'use client'

import { useId, useState } from 'react'
// import { EmailInput } from '@/components/inputs/EmailInput' // Already commented out
import { PasswordInput } from '@/components/inputs/PasswordInput' // Re-enabled this import
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { OAuth2Buttons } from '@/components/buttons/OAuth2Buttons'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { loginWithGoogle, loginWithGitHub } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, AtSignIcon } from 'lucide-react' // Removed LockIcon as PasswordInput should handle it
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CustomToast } from './CustomErrorToast'

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
  const [isLoading, setIsLoading] = useState(false)
  const emailInputId = useId()
  // const passwordInputId = useId() // No longer needed here if PasswordInput handles its own ID/label
  const { toast } = useToast()

  const [toastOpen, setToastOpen] = useState(false)
  const [toastProps, setToastProps] = useState({
    type: 'error' as 'success' | 'error' | 'info',
    title: '',
    description: '',
  })

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
    setIsLoading(true)

    try {
      const result = await onSubmit(email, password, rememberMe)
      if (!result.success) {
        // Gestion des erreurs structurées
        if (result.error?.code === 'EMAIL_IN_USE' || result.error?.code === 'INVALID_CREDENTIALS') {
          setErrors({ email: result.error.message })
        } else if (result.error?.code === 'INVALID_PASSWORD') {
          setErrors({ password: result.error.message })
        } else {
          setToastProps({
            type: 'error',
            title: 'Erreur de connexion',
            description:
              result.error?.message || 'Une erreur inattendue est survenue. Veuillez réessayer.',
          })
          setToastOpen(true)
        }
      } else {
        // Toast de succès avant redirection
        const userName = email.split('@')[0]
        const toastData = {
          type: 'success' as const,
          title: 'Connexion réussie !',
          description: `Bienvenue, ${userName} !`,
        }
        setToastProps(toastData)
        setToastOpen(true)
        // Persister l'intention de toast pour la page d'arrivée
        sessionStorage.setItem('postLoginToast', JSON.stringify(toastData))
        // Redirection (sera gérée par onSubmit)
      }
    } catch (error: any) {
      if (!error.digest?.startsWith('NEXT_REDIRECT')) {
        console.error('Login error:', error)
        setToastProps({
          type: 'error',
          title: 'Login Error',
          description: 'An unexpected error occurred. Please try again.',
        })
        setToastOpen(true)
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
      // Ignore Next.js redirect "errors" as they are expected
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
      // Ignore Next.js redirect "errors" as they are expected
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
      <CustomToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        type={toastProps.type}
        title={toastProps.title}
        description={toastProps.description}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Sign in to your account to access your personal dashboard
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor={emailInputId}>Email</Label>
            <div className="relative">
              <Input
                id={emailInputId}
                className={`peer ps-9 w-full ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!errors.email}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <AtSignIcon size={16} aria-hidden="true" />
              </div>
            </div>
            {errors.email && <p className="text-xs text-destructive pt-1">{errors.email}</p>}
          </div>

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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
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
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
