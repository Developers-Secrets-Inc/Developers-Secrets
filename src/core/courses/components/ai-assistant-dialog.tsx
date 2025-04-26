'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { MessageSquareText, Bot, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Markdown } from '@/components/markdown'
import { motion, AnimatePresence } from 'framer-motion'



export function AIAssistantDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit } = useChat()

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="absolute bottom-full left-0 right-0 mb-2"
          >
            <Card className="h-[600px] py-0">
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
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center text-muted-foreground">
                    <Bot size={48} />
                    <p>Start a conversation with Pearl</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {messages.map((message, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                        key={message.id}
                        className={cn(
                          'rounded-2xl py-2 px-4 shadow-sm max-w-[85%]',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto rounded-br-sm'
                            : 'bg-muted mr-auto rounded-bl-sm border border-border/50',
                          index === 0 ? 'mt-0' : 'mt-1',
                        )}
                      >
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case 'text':
                              return message.role === 'user' ? (
                                <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                                  {part.text}
                                </div>
                              ) : (
                                <Markdown
                                  key={`${message.id}-${i}`}
                                  className={cn(
                                    'prose prose-sm dark:prose-invert max-w-none',
                                    'prose-p:leading-relaxed prose-pre:p-0',
                                    '[&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
                                    'prose-code:bg-muted-foreground/20 prose-code:rounded prose-code:px-1 prose-code:py-0.5',
                                    'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
                                  )}
                                >
                                  {part.text}
                                </Markdown>
                              )
                          }
                        })}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <Button type="submit" variant="default" size="sm">
                    Send
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
