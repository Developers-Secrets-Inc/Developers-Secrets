'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SettingsDialogContent } from './settings-dialog-content'
import type { CompletionStatus } from '@/core/courses/hooks/use-course-part-completion-status'

// S'assurer que les props sont bien définies
interface SettingsBubbleProps {
  partId: number
  initialCompletionStatus: CompletionStatus
}

/**
 * Un bouton rond et déplaçable (drag and drop) affichant une icône de paramètres
 * et ouvrant un menu déroulant au clic.
 */
export const SettingsBubble = ({ partId, initialCompletionStatus }: SettingsBubbleProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isDraggingRef = useRef(false)

  // Fonction personnalisée pour contrôler l'ouverture/fermeture
  const handleOpenChange = (open: boolean) => {
    // N'autoriser l'OUVERTURE que si on n'est PAS en train de finir un drag
    if (open && isDraggingRef.current) {
      // Si on essaie d'ouvrir mais que le flag de drag est toujours actif (ou vient de l'être),
      // on ignore la demande d'ouverture. Le flag sera remis à false par onDragEnd.
      return
    }
    // Autoriser l'ouverture si pas de drag, ou autoriser la fermeture dans tous les cas.
    setIsMenuOpen(open)
  }

  return (
    // Utiliser onOpenChange pour intercepter la tentative d'ouverture
    <DropdownMenu open={isMenuOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <motion.div
          drag
          dragMomentum={false}
          onDragStart={() => {
            isDraggingRef.current = true
            // Fermer le menu immédiatement si on commence à drag
            // Cela appellera onOpenChange(false), qui sera autorisé
            setIsMenuOpen(false)
          }}
          onDragEnd={() => {
            // Remettre le flag à false après un délai minuscule,
            // suffisant pour que handleOpenChange puisse le lire s'il est appelé par pointerup
            setTimeout(() => {
              isDraggingRef.current = false
            }, 0)
          }}
          // onPointerUp n'est plus nécessaire, on gère dans onOpenChange
          whileTap={{ scale: 0.95, cursor: 'grabbing' }}
          className={cn(
            'fixed bottom-20 right-5 z-[100]',
            'flex h-10 w-10 cursor-grab items-center justify-center',
            'rounded-full bg-background border text-foreground shadow-lg',
            'hover:bg-muted transition-colors duration-200',
            'active:cursor-grabbing',
          )}
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </motion.div>
      </DropdownMenuTrigger>

      {/* Passer les props à SettingsDialogContent */}
      <SettingsDialogContent partId={partId} initialCompletionStatus={initialCompletionStatus} />
    </DropdownMenu>
  )
}
