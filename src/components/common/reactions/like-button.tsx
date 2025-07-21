'use client'

import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GenericLikeButtonProps {
  isActive: boolean // Indique si le bouton doit apparaître comme "aimé"
  onClick: () => void // Fonction à appeler lors du clic
  isLoading?: boolean // Keep prop but don't use for style/disabled
}

export function GenericLikeButton({ isActive, onClick, isLoading }: GenericLikeButtonProps) {
  return (
    <Button
      variant={isActive ? 'default' : 'ghost'} // Style différent si actif
      size="sm"
      onClick={onClick}
      // disabled={isLoading} // REMOVED
      className={cn(
        'flex items-center gap-2 transition-colors duration-200',
        isActive
          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' // Style actif
          : 'hover:border-green-500 hover:text-green-500', // Style inactif
        // isLoading && 'opacity-50 cursor-not-allowed', // REMOVED
      )}
      aria-pressed={isActive} // Pour l'accessibilité
      aria-label={isActive ? 'Unlike' : 'Like'}
    >
      <ThumbsUp className="h-4 w-4" />
      <span className="text-sm">Like</span>
    </Button>
  )
}
