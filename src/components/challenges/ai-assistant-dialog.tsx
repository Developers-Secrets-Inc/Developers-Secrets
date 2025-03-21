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
import { MessageSquareText, Bot, AlertCircle } from 'lucide-react'

interface AIAssistantDialogProps {
  challengeSlug: string
}

export function AIAssistantDialog({ challengeSlug }: AIAssistantDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 h-10">
          <Bot size={18} />
          <span>Ask AI Assistant</span>
          <MessageSquareText className="ml-auto" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot size={18} /> AI Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertCircle size={48} className="text-muted-foreground" />
          <h3 className="text-xl font-semibold">Coming Soon</h3>
          <p className="text-muted-foreground max-w-[80%]">
            The AI Assistant feature is not available yet. We&apos;re working hard to bring you
            intelligent coding assistance in the near future!
          </p>
          <div className="text-sm text-muted-foreground mt-4">
            Check back later for updates on this feature.
          </div>
        </div>
        <div className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
