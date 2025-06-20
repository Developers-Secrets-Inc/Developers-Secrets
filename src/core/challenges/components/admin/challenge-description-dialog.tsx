'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useUpdateDescriptionAdmin } from '@/core/challenges/hooks/use-update-description-admin'

interface ChallengeDescriptionDialogProps {
  slug: string
  initialDescription: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChallengeDescriptionDialog({ slug, initialDescription, open, onOpenChange }: ChallengeDescriptionDialogProps) {
  const { description: currentHookDescription, updateDescription, isUpdating } = useUpdateDescriptionAdmin({ slug, initialDescription })
  const [currentLocalDescription, setCurrentLocalDescription] = useState(initialDescription)

  useEffect(() => {
    if (open) {
      // Use the description from the hook, which is synchronized with React Query cache
      setCurrentLocalDescription(currentHookDescription)
    }
  }, [open, currentHookDescription])

  const handleSave = async () => {
    await updateDescription(currentLocalDescription)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Challenge Description</DialogTitle>
          <DialogDescription>
            Make changes to the challenge description here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="description"
            value={currentLocalDescription}
            onChange={(e) => setCurrentLocalDescription(e.target.value)}
            className="col-span-4 min-h-[200px]"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}