// Exemple : src/components/common/reactions/dislike-button.tsx
'use client'

import { ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GenericDislikeButtonProps {
  isActive: boolean // Indique si le bouton doit apparaître comme "pas aimé"
  onClick: () => void // Fonction à appeler lors du clic
  isLoading?: boolean // Keep prop but don't use for style/disabled
}

export function GenericDislikeButton({ isActive, onClick, isLoading }: GenericDislikeButtonProps) {
  return (
    <Button
      variant={isActive ? 'default' : 'ghost'} // Style différent si actif
      size="sm"
      onClick={onClick}
      // disabled={isLoading} // Ensure this is removed/commented out
      className={cn(
        'flex items-center gap-2 transition-colors duration-200',
        isActive
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' // Style actif
          : 'hover:border-red-500 hover:text-red-500', // Style inactif
        // Ensure isLoading style is removed/commented out
        // isLoading && 'opacity-50 cursor-not-allowed',
      )}
      aria-pressed={isActive} // Pour l'accessibilité
      aria-label={isActive ? 'Remove dislike' : 'Dislike'}
    >
      <ThumbsDown className="h-4 w-4" />
      <span className="text-sm">Dislike</span>
    </Button>
  )
}
