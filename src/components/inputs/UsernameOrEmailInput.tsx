'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface UsernameOrEmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function UsernameOrEmailInput({
  className,
  label,
  error,
  ...props
}: UsernameOrEmailInputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Input
        type="text"
        className={cn(error && 'border-destructive focus-visible:ring-destructive/50', className)}
        autoComplete="username email"
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
