'use client'

import React from 'react'
import { GoogleAuthButton } from './GoogleAuthButton'
import { GitHubAuthButton } from './GitHubAuthButton'
import { cn } from '@/lib/utils'

interface OAuth2ButtonsProps {
  className?: string
  variant?: 'default' | 'outline'
  isLoading?: boolean
  onGoogleClick?: () => void
  onGitHubClick?: () => void
}

export function OAuth2Buttons({
  className,
  variant = 'outline',
  isLoading = false,
  onGoogleClick,
  onGitHubClick,
}: OAuth2ButtonsProps) {
  return (
    <div className={cn('flex flex-col space-y-3', className)}>
      <GoogleAuthButton
        variant={variant}
        isLoading={isLoading}
        onClick={onGoogleClick}
        type="button"
      />
      <GitHubAuthButton
        variant={variant}
        isLoading={isLoading}
        onClick={onGitHubClick}
        type="button"
      />
    </div>
  )
}
