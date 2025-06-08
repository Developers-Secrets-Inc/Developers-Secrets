'use client'

import { ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DislikeButtonProps {
  disliked: boolean
  onClick: () => void
  disabled?: boolean
}

export function DislikeButton({ disliked, onClick, disabled }: DislikeButtonProps) {
  return (
    <Button
      variant={disliked ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 transition-colors duration-200',
        disliked
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
          : 'hover:border-red-500 hover:text-red-500',
      )}
    >
      <ThumbsDown className="h-4 w-4" />
      <span className="text-sm">Dislike</span>
    </Button>
  )
}
