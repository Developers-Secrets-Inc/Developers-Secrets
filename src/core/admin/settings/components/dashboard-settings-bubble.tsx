'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SettingsBubbleMenu } from './settings-bubble-menu'

/**
 * Bulle de paramètres dashboard (déplaçable, menu au clic)
 */
export default function DashboardSettingsBubble() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isDraggingRef = useRef(false)

  // Empêche l'ouverture du menu si drag en cours
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
            'fixed bottom-20 right-5 z-[100]',
            'flex h-10 w-10 cursor-grab items-center justify-center',
            'rounded-full bg-background border text-foreground shadow-lg',
            'hover:bg-muted transition-colors duration-200',
            'active:cursor-grabbing',
          )}
          aria-label="Dashboard settings"
          title="Dashboard settings"
        >
          <Settings className="h-5 w-5" />
        </motion.div>
      </DropdownMenuTrigger>
      <SettingsBubbleMenu />
    </DropdownMenu>
  )
}
