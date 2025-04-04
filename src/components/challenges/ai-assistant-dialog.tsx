'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquareText, Bot, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface AIAssistantDialogProps {
  challengeSlug: string
}

export function AIAssistantDialog({ challengeSlug }: AIAssistantDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full flex items-center gap-2 h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot size={18} />
        <span>Ask Pearl for help</span>
        <MessageSquareText className="ml-auto" size={16} />
      </Button>

      <div
        className={cn(
          'absolute bottom-full left-0 right-0 transition-all duration-300 ease-in-out mb-2',
          isOpen ? 'h-[500px] opacity-100' : 'h-0 opacity-0 pointer-events-none',
        )}
      >
        <Card className="h-full">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <h3 className="font-semibold">Pearl</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center text-muted-foreground">
              <Bot size={48} />
              <p>Start a conversation with Pearl</p>
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t">
            <div className="flex gap-2 w-full">
              <Input type="text" placeholder="Type your message..." className="flex-1" disabled />
              <Button variant="default" disabled>
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
