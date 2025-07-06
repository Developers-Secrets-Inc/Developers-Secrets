import React from 'react'
import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { Message } from 'ai'

interface PearlChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const PearlChatInterface = ({
  messages,
  input,
  handleInputChange,
  handleFormSubmit,
}: PearlChatInterfaceProps) => {
  return (
    <>
      <main className="flex-1 overflow-y-auto p-4">
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
                key={`${message.id}-${index}`}
                className={cn(
                  'rounded-2xl py-2 px-4 shadow-sm max-w-[85%]',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto rounded-br-sm'
                    : 'bg-muted mr-auto rounded-bl-sm border border-border/50',
                  index === 0 ? 'mt-0' : 'mt-1',
                )}
              >
                {message.parts?.map((part, i) => {
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
      </main>

      <footer className="p-4 border-t">
        <form onSubmit={handleFormSubmit} className="flex gap-2 w-full">
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
      </footer>
    </>
  )
}
