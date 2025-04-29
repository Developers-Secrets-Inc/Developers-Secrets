'use client'

import { useState, useTransition } from 'react'
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem, // Keep for potential future use
} from '@/components/ui/dropdown-menu'
import { Construction, ListPlus, Loader2 } from 'lucide-react' // Add icons
import { manuallyCreateWeeklyDivisionLeaderboards } from '@/core/dev/actions/gamification-actions' // Import the action
import { toast } from 'sonner' // Import toast

// No props needed for now
// interface DevSettingsDialogContentProps {}

export const DevSettingsDialogContent = () => {
  const [isPending, startTransition] = useTransition()

  const handleCreateLeaderboards = () => {
    startTransition(async () => {
      toast.loading('Creating weekly leaderboards...', { id: 'create-leaderboards' })
      const result = await manuallyCreateWeeklyDivisionLeaderboards()
      if (result.success) {
        toast.success(result.message, {
          id: 'create-leaderboards',
          duration: 5000,
        })
        // Optional: Log details to console
        console.log('Leaderboard Creation Details:', result.details)
      } else {
        toast.error(`Failed: ${result.message}`, {
          id: 'create-leaderboards',
          duration: 8000,
        })
        console.error('Leaderboard Creation Failed:', result.details)
      }
    })
  }

  return (
    <DropdownMenuContent align="end" sideOffset={10} className="w-56">
      <DropdownMenuLabel className="flex items-center gap-2">
        <Construction className="h-4 w-4" />
        <span>Developer Tools</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {/* Add menu items here later */}
      <DropdownMenuItem onClick={handleCreateLeaderboards} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ListPlus className="mr-2 h-4 w-4" />
        )}
        <span>Create Weekly Leaderboards</span>
      </DropdownMenuItem>
      {/* You can add more dev actions below */}
      {/* <DropdownMenuItem disabled>
        <span>(No actions yet)</span>
      </DropdownMenuItem> */}
    </DropdownMenuContent>
  )
}
