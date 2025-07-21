'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AuthCodeErrorPage() {
  const router = useRouter()

  return (
    <div className="w-full max-w-sm mx-auto py-20 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-4">Invalid or expired link</h1>
      <p className="text-muted-foreground mb-8">
        The link you used is invalid, expired, or has already been used.<br />
        Please request a new password reset or confirmation email.
      </p>
      <Button onClick={() => router.push('/auth/login')} className="w-full max-w-xs">
        Back to login
      </Button>
    </div>
  )
} 