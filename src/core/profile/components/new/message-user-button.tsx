'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

interface MessageUserButtonProps {
  userSlug?: string // Will be used later for navigation/action
}

export const MessageUserButton = ({ userSlug }: MessageUserButtonProps) => {
  const handleClick = () => {
    // TODO: Implement messaging logic (e.g., redirect to /messages/[userSlug] or open modal)
    console.log('Message button clicked for user:', userSlug)
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      <span>Message User</span>
    </Button>
  )
}
