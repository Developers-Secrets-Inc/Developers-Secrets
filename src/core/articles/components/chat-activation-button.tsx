'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquareText } from 'lucide-react'
import { ChatDialog } from './chat-dialog'

// onClick prop is removed as the component will manage its own state
interface ChatActivationButtonProps {
  tutorialSlug: string
  articleSlug: string
  tutorialTitle: string
  articleTitle: string
  articleFullContent: string
}

export const ChatActivationButton = ({
  tutorialSlug,
  articleSlug,
  tutorialTitle,
  articleTitle,
  articleFullContent,
}: ChatActivationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false) // Add isOpen state

  const toggleChat = () => setIsOpen(!isOpen) // Function to toggle chat

  return (
    <>
      <Button
        variant="outline"
        onClick={toggleChat} // Use internal toggle function
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 shadow-lg"
      >
        <MessageSquareText size={18} />
        <span>Ask AI</span>
      </Button>
      {isOpen && (
        <ChatDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          tutorialSlug={tutorialSlug}
          articleSlug={articleSlug}
          tutorialTitle={tutorialTitle}
          articleTitle={articleTitle}
          articleFullContent={articleFullContent}
        />
      )}
    </>
  )
}
