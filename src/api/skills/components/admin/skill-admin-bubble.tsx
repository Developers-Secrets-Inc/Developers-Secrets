'use client'

import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SkillAdminMenu } from './skill-admin-menu'

export default function SkillAdminBubble({
  skillSlug,
  userId,
}: {
  skillSlug: string
  userId: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          drag
          dragMomentum={false}
          whileTap={{ scale: 0.95, cursor: 'grabbing' }}
          className={cn(
            'fixed bottom-20 right-5 z-[100]',
            'flex h-10 w-10 cursor-grab items-center justify-center',
            'rounded-full bg-background border text-foreground shadow-lg',
            'hover:bg-muted transition-colors duration-200',
            'active:cursor-grabbing',
          )}
          aria-label="Skill admin"
          title="Skill admin"
        >
          <Settings className="h-5 w-5" />
        </motion.div>
      </DropdownMenuTrigger>
      <SkillAdminMenu skillSlug={skillSlug} userId={userId} />
    </DropdownMenu>
  )
}
