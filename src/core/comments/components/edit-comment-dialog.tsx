'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface EditCommentDialogProps {
  commentId: number
  initialContent: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (commentId: number, content: string) => Promise<void>
}

export function EditCommentDialog({
  commentId,
  initialContent,
  open,
  onOpenChange,
  onEdit,
}: EditCommentDialogProps) {
  const [content, setContent] = useState(initialContent)

  const handleSubmit = async () => {
    if (content.trim()) {
      // Fermer le dialogue immédiatement
      onOpenChange(false)
      // Effectuer la modification en arrière-plan
      await onEdit(commentId, content.trim())
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit comment</DialogTitle>
          <DialogDescription>Make changes to your comment below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Textarea
            placeholder="Edit your comment..."
            className="min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
