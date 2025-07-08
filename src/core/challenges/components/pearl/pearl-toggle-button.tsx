'use client'

import { Button } from '@/components/ui/button'
import { useChallengeUIStore } from '@/core/challenges/stores/challenge-ui-store'
import { Bot, MessageSquareText } from 'lucide-react'

export function PearlToggleButton() {
  const showChat = useChallengeUIStore((state) => state.showChat)

  return (
    <Button variant="outline" className="w-full flex items-center gap-2 h-10" onClick={showChat}>
      <Bot size={18} />
      <span>Ask Pearl for help</span>
      <MessageSquareText className="ml-auto" size={16} />
    </Button>
  )
}
