'use client'

import { forwardRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface CommentFormProps {
  onSubmit: (content: string, parentId?: string) => Promise<void>
  parentId?: string | null
  isSubmitting: boolean
  onCancel: () => void
}

export const CommentForm = forwardRef<HTMLTextAreaElement, CommentFormProps>(
  ({ onSubmit, parentId, isSubmitting, onCancel }, ref) => {
    const [content, setContent] = useState('')

    const handleSubmit = async () => {
      if (content.trim()) {
        await onSubmit(content, parentId || undefined)
        setContent('')
      }
    }

    return (
      <div className="border rounded-md shadow-sm overflow-hidden bg-card">
        <div className="flex flex-col">
          <Textarea
            ref={ref}
            placeholder={parentId ? 'Write a reply...' : 'Add a comment...'}
            className="resize-none border-0 focus-visible:ring-0 text-sm p-3 shadow-none min-h-[60px] rounded-none focus-visible:outline-none bg-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2 px-3 py-2">
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!content.trim() || isSubmitting}>
              {parentId ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      </div>
    )
  },
)
