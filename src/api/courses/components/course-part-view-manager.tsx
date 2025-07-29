'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { useCoursePartUIStore } from '../stores/course-part-ui-store'
import { InlinePearlView } from '@/core/ai/components/views/inline-view'
import { SheetPearlView } from '@/core/ai/components/views/sheet-view'
import { CoursePartDescriptionView } from './course-part-description-view'
import { usePearlViewStore } from '@/core/ai/stores/pearl-view-store'
import { useCoursePart } from '../contexts/course-part-context'

interface ChallengeViewManagerProps {
  children: React.ReactNode
}

export function CoursePartViewManager({ children }: ChallengeViewManagerProps) {
  const { isChatActive, viewMode, hideChat } = usePearlViewStore()
  const { metadata } = useCoursePart()

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
            onClose={hideChat}
            metadata={{
              chatId: metadata.coursePartAIChat.id,
              messages: metadata.messages,
              quotas: metadata.quotas,
              body: {},
            }}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <>
      <CoursePartDescriptionView>{children}</CoursePartDescriptionView>

      {viewMode === 'sheet' && isChatActive && (
        <SheetPearlView
          isOpen={isChatActive}
          onClose={hideChat}
          metadata={{
            chatId: metadata.coursePartAIChat.id,
            messages: metadata.messages,
            quotas: metadata.quotas,
            body: {},
          }}
        />
      )}
    </>
  )
}
