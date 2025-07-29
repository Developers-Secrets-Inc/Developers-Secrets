'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { QuotaBadge } from '@/core/ai/quotas/components/quota-badge'
import { usePearlViewStore } from '../../stores/pearl-view-store'
import { useUser } from '@/core/users/contexts/user-context'
import { usePearlChat } from '../../hooks/use-pearl-chat'
import { useAIQuota } from '../../quotas/hooks/use-ai-quota'
import { Message } from 'ai'
import { ChatParameters } from '../chat-parameters'
import { PearlChatInterface } from '../pearl-chat-interface'

type SheetPearlViewProps = {
    onClose: () => void 
    isOpen: boolean
    metadata: {
    chatId: number
    messages: Message[]
    quotas: number
    body: any
  }
}

export const SheetPearlView = ({onClose, isOpen, metadata}: SheetPearlViewProps) => {
    const { viewMode, setViewMode } = usePearlViewStore()
  const { user } = useUser()

  const {
    messages: clientMessages,
    input,
    handleInputChange,
    handleSubmit,
    reset,
  } = usePearlChat({
    chatId: metadata.chatId,
    initialMessages: metadata.messages,
    onReset: async ({ chatId }) => {
        
    },
    api: 'api/courses/chat'
  })

  const { canSend, isLoading: isQuotaLoading, increment } = useAIQuota(user.id, metadata.quotas)

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!canSend) {
      e.preventDefault()
      return
    }
    increment()
    handleSubmit(e, {
      body: metadata.body
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
            <QuotaBadge userId={user.id} quotas={metadata.quotas}/>
          </div>
        </SheetHeader>
        <PearlChatInterface
          messages={clientMessages}
          input={input}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          isDisabled={!canSend || isQuotaLoading}
        />
      </SheetContent>
    </Sheet>
    )
}