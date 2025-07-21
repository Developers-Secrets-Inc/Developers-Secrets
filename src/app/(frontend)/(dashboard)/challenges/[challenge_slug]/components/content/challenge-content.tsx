'use client'

import { AIAssistantDialog } from '@/components/challenges/ai-assistant-dialog'
import { Suspense, useState } from 'react'

function LoadingPlaceholder() {
  return <div className="animate-pulse p-6 bg-background/50 rounded-md h-[200px]"></div>
}

export const ChallengeContent = ({
  challengeSlug,
  navigation,
  layoutChildren,
  footer,
}: {
  challengeSlug: string
  navigation: React.ReactNode
  layoutChildren: React.ReactNode
  footer: React.ReactNode
}) => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {navigation}
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">
        <Suspense fallback={<LoadingPlaceholder />}>{layoutChildren}</Suspense>
      </div>
      <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50">
        <div className="flex items-center gap-3 mb-3">{footer}</div>
        <AIAssistantDialog challengeSlug={challengeSlug} />
      </div>
    </div>
  )
}
