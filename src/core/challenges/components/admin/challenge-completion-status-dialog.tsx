'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSessionUser } from '@/core/user/hooks/use-user'
import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { Challenge } from '@/payload-types'
import { CompletionStatus } from '@/core/challenges/user-progression/types'

interface ChallengeCompletionStatusDialogProps {
  challenge: Challenge
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChallengeCompletionStatusDialog({
  challenge,
  open,
  onOpenChange,
}: ChallengeCompletionStatusDialogProps) {
  const { user } = useSessionUser()
  const userId = user?.id

  const {
    status: currentStatus,
    isLoading: isStatusLoading,
    updateStatus,
  } = useChallengeUserStatus(challenge.id)

  const [selectedStatus, setSelectedStatus] = useState<CompletionStatus>(
    currentStatus || 'not_started',
  )

  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus || 'not_started')
    }
  }, [open, currentStatus])

  const handleSave = async () => {
    if (!userId) {
      console.error('User not authenticated to change challenge status.')
      return
    }
    await updateStatus(selectedStatus)
    onOpenChange(false)
  }

  const completionStatusOptions: CompletionStatus[] = ['not_started', 'in_progress', 'completed']

  const isLoading = isStatusLoading // We're using the hook's isLoading state

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Challenge Completion Status</DialogTitle>
          <DialogDescription>
            Select the current completion status for this challenge for the logged-in user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="completion-status-select">Completion Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: CompletionStatus) => setSelectedStatus(value)}
              disabled={isLoading || !userId}
            >
              <SelectTrigger id="completion-status-select" className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {completionStatusOptions.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoading && (
            <p className="text-sm text-center text-muted-foreground">Loading status...</p>
          )}
          {!userId && !isLoading && (
            <p className="text-sm text-center text-destructive">User not authenticated.</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isLoading || !userId}>
            Save changes
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
