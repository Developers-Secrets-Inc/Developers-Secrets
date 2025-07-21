'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export const NewCommentForm = ({ onSubmit }: { onSubmit: (content: string) => void }) => {
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      onSubmit(content)
      setContent('')
    }
  }

  return (
    <div className="border rounded-md shadow-sm overflow-hidden bg-card">
      <div className="flex flex-col">
        <Textarea
          placeholder="Add a comment..."
          className="resize-none border-0 focus-visible:ring-0 text-sm p-3 shadow-none min-h-[60px] rounded-none focus-visible:outline-none bg-transparent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end px-3 py-2">
          <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}
