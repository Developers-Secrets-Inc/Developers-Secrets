'use client'

import { useChallenge } from '@/api/challenges/contexts/challenge-context'
import { Button } from '@/components/ui/button'
import { QuotaBadge } from '@/core/ai/quotas/components/quota-badge'
import { useAIQuota } from '@/core/ai/quotas/hooks/use-ai-quota'
import { useChallengeUIStore } from '@/core/challenges/stores/challenge-ui-store'
import type { ChallengeAiChat } from '@/payload-types'
import { Message } from 'ai'
import { Bot, X } from 'lucide-react'
import React from 'react'
import { usePearlChat } from '../../hooks/use-pearl-chat'
import { PearlChatInterface } from './pearl-chat-interface'
import { ChatParameters } from './pearl-chat-parameters'

interface InlinePearlViewProps {
  challengeAIChat: ChallengeAiChat
  onClose?: () => void
  messages: Message[]
}

export function InlinePearlView({ challengeAIChat, onClose, messages }: InlinePearlViewProps) {
  const { viewMode, setViewMode } = useChallengeUIStore()
  const { challenge } = useChallenge()

  // const { currentLanguage, codeByLanguage } = useChallengeEditorStore()
  // const currentCode = codeByLanguage[currentLanguage] || ''
  // const { data: isSolutionUnlocked = false } = useSolutionUnlockStatus(
  //   challengeAIChat.userId,
  //   challenge.id,
  // )

  const { messages: clientMessages, input, handleInputChange, handleSubmit, reset } = usePearlChat({
    challengeAIChat,
    initialMessages: messages,
  })

  const { canSend, isLoading: isQuotaLoading, increment } = useAIQuota()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!canSend) {
      e.preventDefault()
      return
    }
    increment()
    handleSubmit(e, {
      body: {
        challengeContext: {
          title: challenge.title,
          difficulty: challenge.difficulty,
          description: challenge.description,
          hints: challenge.description?.hints,
          officialSolution: challenge.officialSolution,
        },
        userContext: {
          currentCode: 'currentCode',
          currentLanguage: 'currentLanguage',
          isSolutionUnlocked: 'isSolutionUnlocked',
        },
      },
    })
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-md">
      <header className="px-2 h-12 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <h3 className="font-semibold">Pearl</h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <QuotaBadge />
          <ChatParameters viewMode={viewMode} onViewModeChange={setViewMode} onResetChat={reset} />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </header>
      <PearlChatInterface
        messages={clientMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        isDisabled={!canSend || isQuotaLoading}
      />
    </div>
  )
}
