import { Bot, X } from 'lucide-react'
import { PearlChatInterface } from '../pearl-chat-interface'
import { QuotaBadge } from '../../quotas/components/quota-badge'
import { ChatParameters } from '../chat-parameters'
import { Button } from '@/components/ui/button'
import { usePearlViewStore } from '../../stores/pearl-view-store'
import { useUser } from '@/core/users/contexts/user-context'
import { Message } from 'ai'
import { useAIQuota } from '../../quotas/hooks/use-ai-quota'
import { usePearlChat } from '../../hooks/use-pearl-chat'

type InlinePearlViewProps = {
  onClose?: () => void
  metadata: {
    chatId: number
    messages: Message[]
    quotas: number
    body: any
  }
}

export const InlinePearlView = ({ onClose, metadata }: InlinePearlViewProps) => {
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
    <div className="flex flex-col h-full bg-background rounded-md">
      <header className="px-2 h-12 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <h3 className="font-semibold">Pearl</h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <QuotaBadge userId={user.id} quotas={metadata.quotas} />
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
