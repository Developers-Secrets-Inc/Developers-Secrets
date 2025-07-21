'use client'

import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  liked: boolean
  onClick: () => void
  disabled?: boolean
}

export function LikeButton({ liked, onClick, disabled }: LikeButtonProps) {
  return (
    <Button
      variant={liked ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 transition-colors duration-200',
        liked
          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
          : 'hover:border-green-500 hover:text-green-500',
      )}
    >
      <ThumbsUp className="h-4 w-4" />
      <span className="text-sm">Like</span>
    </Button>
  )
}
