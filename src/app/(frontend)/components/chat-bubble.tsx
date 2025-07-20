'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/markdown'
import { UserIcon } from 'lucide-react'

interface ChatBubbleProps {
  variant?: 'sent' | 'received'
  layout?: 'default' | 'ai'
  className?: string
  children: React.ReactNode
}

export function ChatBubble({
  variant = 'received',
  layout = 'default',
  className,
  children,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 mb-4',
        variant === 'sent' && 'flex-row-reverse',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface ChatBubbleMessageProps {
  variant?: 'sent' | 'received'
  isLoading?: boolean
  className?: string
  content?: string
}

export function ChatBubbleMessage({
  variant = 'received',
  isLoading,
  className,
  content,
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-3',
        variant === 'sent' ? 'bg-primary/10 border border-primary/20 text-primary-foreground' : 'bg-background border border-border w-full max-w-md',
        className,
      )}
    >
      {/* Affichage markdown */}
      {content && <Markdown className="prose prose-sm max-w-none">{content}</Markdown>}
    </div>
  )
}

interface ChatBubbleAvatarProps {
  src?: string
  fallback?: string
  className?: string
}

export function ChatBubbleAvatar({ src, fallback = 'AI', className }: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {src && <AvatarImage src={src} />}
      {fallback === 'US' ? (
        <UserIcon className="h-5 w-5 text-muted-foreground" />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </Avatar>
  )
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ChatBubbleAction({ icon, onClick, className }: ChatBubbleActionProps) {
  return (
    <Button variant="ghost" size="icon" className={cn('h-6 w-6', className)} onClick={onClick}>
      {icon}
    </Button>
  )
}

export function ChatBubbleActionWrapper({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('flex items-center gap-1 mt-2', className)}>{children}</div>
}
