'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MessageSquareText, Bot, SendHorizontal } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface AIAssistantDialogProps {
  challengeSlug: string
}

export function AIAssistantDialog({ challengeSlug }: AIAssistantDialogProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsLoading(true)

    // Here you would typically call a server action or API to send the message
    // For now, let's just simulate a delay
    setTimeout(() => {
      setIsLoading(false)
      setMessage('')
      // In a real implementation, you would handle the response
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 h-10">
          <Bot size={18} />
          <span>Ask AI Assistant</span>
          <MessageSquareText className="ml-auto" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot size={18} /> AI Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 border rounded-md my-4 bg-muted/30">
          {/* Chat messages would be displayed here */}
          <div className="text-center text-muted-foreground pt-20">
            Ask the AI assistant for help with this challenge.
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="resize-none min-h-[60px]"
          />
          <Button type="submit" disabled={isLoading || !message.trim()} className="self-end">
            <SendHorizontal size={18} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
