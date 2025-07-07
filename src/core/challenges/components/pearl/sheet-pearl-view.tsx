'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Challenge } from '@/payload-types'
import type { ChallengeAiChat } from '@/payload-types'
import { PearlChatInterface } from './pearl-chat-interface'
import { useChallengeUIStore } from '@/core/challenges/stores/challenge-ui-store'
import { ChatParameters } from './pearl-chat-parameters'
import { usePearlChat } from '../../hooks/use-pearl-chat'
import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'
import { useSolutionUnlockStatus } from '@/core/challenges/hooks/use-solution-queries'
import React from 'react'
import { QuotaBadge } from '@/core/ai/quotas/components/quota-badge'
import { useAIQuota } from '@/core/ai/quotas/hooks/use-ai-quota'

interface SheetPearlViewProps {
  challenge: Challenge
  challengeAIChat: ChallengeAiChat
  isOpen: boolean
  onClose: () => void
}

export function SheetPearlView({
  challenge,
  challengeAIChat,
  isOpen,
  onClose,
}: SheetPearlViewProps) {
  const { viewMode, setViewMode } = useChallengeUIStore()

  const { currentLanguage, codeByLanguage } = useChallengeEditorStore()
  const currentCode = codeByLanguage[currentLanguage] || ''
  const { data: isSolutionUnlocked = false } = useSolutionUnlockStatus(
    challengeAIChat.userId,
    challenge.id,
  )

  const { messages, input, handleInputChange, handleSubmit, reset } = usePearlChat({
    challengeAIChat,
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
          currentCode,
          currentLanguage,
          isSolutionUnlocked,
        },
      },
    })
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent side="right" className="p-0 flex flex-col h-full max-w-lg w-full min-w-lg">
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ChatParameters
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onResetChat={reset}
            />
            <SheetTitle>Pearl</SheetTitle>
          </div>
          <div className="flex items-center gap-2">
            <QuotaBadge />
          </div>
        </SheetHeader>
        <PearlChatInterface
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          isDisabled={!canSend || isQuotaLoading}
        />
      </SheetContent>
    </Sheet>
  )
}
