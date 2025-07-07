'use client'

import type { Challenge, ChallengeAiChat } from '@/payload-types'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { useChallengeUIStore } from '@/core/challenges/stores/challenge-ui-store'
import { User } from '@/types/user'
import { ChallengeDescriptionView } from './challenge-description-view'
import { InlinePearlView } from './pearl/inline-pearl-view'
import { SheetPearlView } from './pearl/sheet-pearl-view'
import { Message } from 'ai'


interface ChallengeViewManagerProps {
  challenge: Challenge
  user: User
  children: React.ReactNode
  challengeAIChat: ChallengeAiChat
  messages: Message[]
}

export function ChallengeViewManager({
  challenge,
  user,
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
          <InlinePearlView
            challenge={challenge}
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
        <SheetPearlView
          isOpen={isChatActive}
          onClose={hideChat}
          challenge={challenge}
          challengeAIChat={challengeAIChat}
          messages={messages}
        />
      )}
    </>
  )
}
