'use server'

import 'server-only'

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Quest } from '@/payload-types'

const ONE_HOUR = 3600

export const getQuests = unstable_cache(
  async (): Promise<Quest[]> => {
    const payload = await getPayload({ config })

    const quests = await payload.find({
      collection: 'quests',
    })

    return quests.docs
  },
  ['quests'],
  {
    revalidate: ONE_HOUR,
    tags: ['quests'],
  },
)

export const getQuestById = async (questId: number): Promise<Quest | undefined> => {
  const quests = await getQuests()
  return quests.find((quest) => quest.id === questId)
}

export const getQuestByType = async (questType: Quest['type']): Promise<Quest | undefined> => {
  const quests = await getQuests()

  return quests.find((quest) => quest.type === questType)
}

export const getRandomQuest = async <T extends number>(
  quantity: T,
  difficulty: Quest['difficulty'],
): Promise<T extends 1 ? Quest : Quest[]> => {
  const quests = await getQuests()
  const filteredQuests = quests.filter((quest) => quest.difficulty === difficulty)

  const randomQuests = filteredQuests.sort(() => Math.random() - 0.5).slice(0, quantity)
  return (quantity === 1 ? randomQuests[0] : randomQuests) as T extends 1 ? Quest : Quest[]
}
