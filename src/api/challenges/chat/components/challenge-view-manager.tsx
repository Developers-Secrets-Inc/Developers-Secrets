'use client'

import type { ChallengeAiChat } from '@/payload-types'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { useChallengeUIStore } from '@/api/challenges/stores/challenge-ui-store'
import { Message } from 'ai'
import { ChallengeDescriptionView } from './challenge-description-view'
import { Pearl } from './pearl'


interface ChallengeViewManagerProps {
  children: React.ReactNode
  challengeAIChat: ChallengeAiChat
  messages: Message[]
}

export function ChallengeViewManager({
  children,
  challengeAIChat,
  messages,
}: ChallengeViewManagerProps) {
  const { isChatActive, viewMode, hideChat } = useChallengeUIStore()

  if (viewMode === 'inline' && isChatActive) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="pearl-view-inline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Pearl.InlineView
            challengeAIChat={challengeAIChat}
            onClose={hideChat}
            messages={messages}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <>
      <ChallengeDescriptionView>{children}</ChallengeDescriptionView>
      {viewMode === 'sheet' && isChatActive && (
        <Pearl.SheetView
          isOpen={isChatActive}
          onClose={hideChat}
          challengeAIChat={challengeAIChat}
          messages={messages}
        />
      )}
    </>
  )
}
