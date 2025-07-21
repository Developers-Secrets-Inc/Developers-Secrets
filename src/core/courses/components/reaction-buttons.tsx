import { ThumbsDown } from 'lucide-react'
import { ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'


export function LikeButton() {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'flex items-center gap-2 transition-colors duration-200',
          'hover:border-green-500 hover:text-green-500',
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="text-sm">Like</span>
      </Button>
    )
  }

export function DislikeButton() {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'flex items-center gap-2 transition-colors duration-200',
          'hover:border-red-500 hover:text-red-500',
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="text-sm">Dislike</span>
      </Button>
    )
  }


export const ReactionButtons = () => {

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <LikeButton />
        <DislikeButton />
      </div>
    </div>
  )
}
