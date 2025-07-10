'use client'

import { Button } from '@/components/ui/button'
import type { Challenge } from '@/payload-types'
import type { ChallengeAiChat } from '@/payload-types'
import { Bot, X } from 'lucide-react'
import { PearlChatInterface } from './pearl-chat-interface'
import { useChallengeUIStore } from '@/core/challenges/stores/challenge-ui-store'
import { ChatParameters } from './pearl-chat-parameters'
import { usePearlChat } from '../../hooks/use-pearl-chat'
import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'
import { useSolutionUnlockStatus } from '@/core/challenges/hooks/use-solution-queries'
import React from 'react'
import { QuotaBadge } from '@/core/ai/quotas/components/quota-badge'
import { useAIQuota } from '@/core/ai/quotas/hooks/use-ai-quota'
import { Message } from 'ai'

interface InlinePearlViewProps {
  challenge: Challenge
  challengeAIChat: ChallengeAiChat
  onClose?: () => void
  messages: Message[]
  initialQuota: {
    remaining: number
    canSend: boolean
  }
}

export function InlinePearlView({
  challenge,
  challengeAIChat,
  onClose,
  messages,
  initialQuota,
}: InlinePearlViewProps) {
  const { viewMode, setViewMode } = useChallengeUIStore()

  const { currentLanguage, codeByLanguage } = useChallengeEditorStore()
  const currentCode = codeByLanguage[currentLanguage] || ''
  const { data: isSolutionUnlocked = false } = useSolutionUnlockStatus(
    challengeAIChat.userId,
    challenge.id,
  )

  const {
    messages: clientMessages,
    input,
    handleInputChange,
    handleSubmit,
    reset,
  } = usePearlChat({
    challengeAIChat,
    initialMessages: messages,
  })

  const {
    canSend,
    isLoading: isQuotaLoading,
    increment,
  } = useAIQuota({
    initialData: initialQuota,
  })

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
          currentCode,
          currentLanguage,
          isSolutionUnlocked,
        },
      },
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b flex items-center justify-between">
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
