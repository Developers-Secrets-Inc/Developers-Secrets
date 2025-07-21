'use client'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Code, MessageSquare, CircleCheckIcon, TestTube2 } from 'lucide-react'
import { PartCompletionSelect } from './part-completion-select'
import type { CompletionStatus } from '@/core/courses/hooks/use-course-part-completion-status'
// import { useToast } from '@/components/ui/use-toast' // Removed old hook
import { useCompletionToast } from '@/core/courses/components/completion-toast-context' // Added new hook

interface SettingsDialogContentProps {
  partId: number
  initialCompletionStatus: CompletionStatus
}

export const SettingsDialogContent = ({
  partId,
  initialCompletionStatus,
}: SettingsDialogContentProps) => {
  // const { toast } = useToast() // Removed old hook usage
  const { showToast } = useCompletionToast() // Use the new context hook

  const handleShowToastWithXp = () => {
    // Call the context function with props
    showToast({
      xpEarned: 150,
      solutionUnlocked: false,
    })
  }

  const handleShowToastWithoutXp = () => {
    // Call the context function with props
    showToast({
      xpEarned: 0, // XP is 0 because solution unlocked
      solutionUnlocked: true,
    })
  }

  return (
    <DropdownMenuContent align="end" sideOffset={10} className="w-56">
      <DropdownMenuLabel>Part Status</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <PartCompletionSelect partId={partId} initialStatus={initialCompletionStatus} />
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Test Completion Toast</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={handleShowToastWithXp}>
        <TestTube2 className="mr-2 h-4 w-4 text-green-500" />
        <span>Show Toast (With XP)</span>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={handleShowToastWithoutXp}>
        <TestTube2 className="mr-2 h-4 w-4 text-orange-500" />
        <span>Show Toast (No XP)</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
