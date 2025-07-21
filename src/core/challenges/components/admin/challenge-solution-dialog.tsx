'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useUpdateSolutionAdmin } from '@/core/challenges/hooks/use-update-solution-admin'

interface ChallengeSolutionDialogProps {
  slug: string
  initialSolution: string

  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChallengeSolutionDialog({ slug, initialSolution, open, onOpenChange }: ChallengeSolutionDialogProps) {
  const { solution: currentHookSolution, updateSolution, isUpdating } = useUpdateSolutionAdmin({ slug, initialSolution })
  const [currentLocalSolution, setCurrentLocalSolution] = useState(initialSolution)

  useEffect(() => {
    if (open) {
      setCurrentLocalSolution(currentHookSolution)
    }
  }, [open, currentHookSolution])

  const handleSave = async () => {
    await updateSolution(currentLocalSolution)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Official Solution</DialogTitle>
          <DialogDescription>
            Make changes to the official solution here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="solution"
            value={currentLocalSolution}
            onChange={(e) => setCurrentLocalSolution(e.target.value)}
            className="col-span-4 font-mono"
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