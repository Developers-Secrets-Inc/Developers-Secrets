'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react' // Use a different icon
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DevSettingsDialogContent } from './dev-settings-dialog-content' // Import the new content component

// No specific props needed for this bubble
// interface DevSettingsBubbleProps {}

/**
 * A draggable bubble button displaying a wrench icon,
 * opening a developer-specific dropdown menu on click.
 * Only renders in development environment.
 */
const DevSettingsBubbleComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isDraggingRef = useRef(false)

  const handleOpenChange = (open: boolean) => {
    if (open && isDraggingRef.current) {
      return
    }
    setIsMenuOpen(open)
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <motion.div
          drag
          dragMomentum={false}
          onDragStart={() => {
            isDraggingRef.current = true
            setIsMenuOpen(false)
          }}
          onDragEnd={() => {
            setTimeout(() => {
              isDraggingRef.current = false
            }, 0)
          }}
          whileTap={{ scale: 0.95, cursor: 'grabbing' }}
          className={cn(
            'fixed bottom-5 right-5 z-[100]', // Adjusted position slightly
            'flex h-10 w-10 cursor-grab items-center justify-center',
            'rounded-full bg-background border border-border text-foreground shadow-lg',
            'hover:bg-muted transition-colors duration-200',
            'active:cursor-grabbing',
          )}
          aria-label="Developer Settings"
          title="Developer Settings"
        >
          <Wrench className="h-5 w-5" />
        </motion.div>
      </DropdownMenuTrigger>

      {/* Use the new content component */}
      <DevSettingsDialogContent />
    </DropdownMenu>
  )
}

// Export the component only in development, otherwise export null
export const DevSettingsBubble =
  process.env.NODE_ENV === 'development' ? DevSettingsBubbleComponent : () => null
