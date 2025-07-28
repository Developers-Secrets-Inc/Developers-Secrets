'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { useCoursePartUIStore } from '../stores/course-part-ui-store'
import { InlinePearlView } from '@/core/ai/components/views/inline-view'
import { SheetPearlView } from '@/core/ai/components/views/sheet-view'
import { CoursePartDescriptionView } from './course-part-description-view'

interface ChallengeViewManagerProps {
  children: React.ReactNode
}

export function CoursePartViewManager({ children }: ChallengeViewManagerProps) {
  const { isChatActive, viewMode, hideChat } = useCoursePartUIStore()

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
          <InlinePearlView onSetViewMode={() => {}} onClose={hideChat} metadata={{}} />
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
          onSetViewMode={() => {}}
          onClose={hideChat}
          metadata={{}}
        />
      )}
    </>
  )
}
