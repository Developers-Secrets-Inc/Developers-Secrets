'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomErrorToast } from '../components/CustomErrorToast'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError('Unexpected error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto py-20 flex flex-col items-center justify-center text-center">
      <CustomErrorToast
        open={!!error || success}
        onOpenChange={() => setError(null)}
        type={success ? 'success' : 'error'}
        title={success ? 'Email sent!' : 'Error'}
        description={
          success
            ? 'If an account exists for this email, a password reset link has been sent.'
            : error || ''
        }
      />
      <h1 className="text-2xl font-bold mb-6">Forgot your password?</h1>
      <p className="text-muted-foreground mb-8">
        Enter your email address and we will send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-left">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading || success}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || success}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <Button
        variant="ghost"
        className="mt-6 text-sm text-muted-foreground"
        onClick={() => router.push('/auth/login')}
      >
        Back to login
      </Button>
    </div>
  )
}
