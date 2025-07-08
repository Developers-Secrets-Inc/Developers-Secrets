'use client'

import { useState } from 'react'


import { QuestCard } from '@/core/gamification/quests/components/quest-card'
import { UserQuest } from '@/payload-types'
import { Loader2 } from 'lucide-react'

import {
    motion
} from 'framer-motion'




export const QuestsProgressionPage = ({ quests }: { quests: UserQuest[] | undefined }) => {
    const [visibleQuestIndex, setVisibleQuestIndex] = useState(0)
  
    if (!quests) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      )
    }
  
    return (
      <div className="flex flex-col gap-2">
        {quests.map((quest: UserQuest, idx) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 30 }}
            animate={idx <= visibleQuestIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: 0 }}
            onAnimationComplete={() => {
              if (idx === visibleQuestIndex && visibleQuestIndex < quests.length - 1) {
                setTimeout(() => setVisibleQuestIndex(visibleQuestIndex + 1), 100)
              }
            }}
            style={{ pointerEvents: idx === visibleQuestIndex ? 'auto' : 'none' }}
          >
            <QuestCard.Root key={quest.id} userQuest={quest}>
              <QuestCard.Icon />
              <QuestCard.Container>
                <QuestCard.Header>
                  <div className="flex items-center gap-2">
                    <QuestCard.Title />
                  </div>
                  <QuestCard.Reward />
                </QuestCard.Header>
                <QuestCard.Progression />
              </QuestCard.Container>
            </QuestCard.Root>
          </motion.div>
        ))}
      </div>
    )
  }