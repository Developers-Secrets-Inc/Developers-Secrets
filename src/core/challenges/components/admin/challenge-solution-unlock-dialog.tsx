'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useSessionUser } from '@/core/user/hooks/use-user'
import {
  useSolutionUnlockStatus,
  useUnlockSolution,
} from '@/core/challenges/hooks/use-solution-queries'
import { Challenge } from '@/payload-types' // Assuming Challenge type is available here

interface ChallengeSolutionUnlockDialogProps {
  challenge: Challenge // Pass the entire challenge object
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChallengeSolutionUnlockDialog({
  challenge,
  open,
  onOpenChange,
}: ChallengeSolutionUnlockDialogProps) {
  const { user } = useSessionUser()
  const userId = user?.id

  // Use the existing query to get the current unlock status
  const { data: isSolutionUnlocked, isLoading: isStatusLoading } = useSolutionUnlockStatus(
    userId || '', // Provide a default empty string if userId is null, useQuery will be disabled
    challenge.id,
  )

  // Use the existing mutation to set the unlock status
  const { mutate: setSolutionUnlock, isPending: isUpdating } = useUnlockSolution()

  const handleToggleUnlock = () => {
    if (!userId) {
      // Handle case where user is not logged in or userId is not available
      console.error('User not authenticated to change solution unlock status.')
      return
    }
    // Toggle the current state
    setSolutionUnlock({ userId, challengeId: challenge.id, unlocked: !isSolutionUnlocked })
  }

  const isLoading = isStatusLoading || isUpdating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Toggle Solution Unlock Status</DialogTitle>
          <DialogDescription>
            Control whether the official solution for this challenge is accessible to users.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="solution-unlock-switch" className="text-right">
              Solution Unlocked
            </Label>
            <Switch
              id="solution-unlock-switch"
              checked={isSolutionUnlocked}
              onCheckedChange={handleToggleUnlock}
              disabled={isLoading || !userId} // Disable if loading or no user
              aria-label="Toggle solution unlock status"
            />
          </div>
          {isLoading && (
            <p className="text-sm text-center text-muted-foreground">Loading status...</p>
          )}
          {!userId && !isLoading && (
            <p className="text-sm text-center text-destructive">User not authenticated.</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
