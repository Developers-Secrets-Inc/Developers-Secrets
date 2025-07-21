import { Quest, UserQuest as PayloadUserQuest } from '@/payload-types'

import { getPayload, Where } from 'payload'
import config from '@payload-config'
/*  

Every user should have 4 quests per day. Two easy quests, one medium and one hard.
- On doit gérer la complétion d'une quête. Chaque quête doit avoir un status `isCompleted`.

*/

type UserQuest = PayloadUserQuest & {
  quest: Quest
}

// ========== User Quests Creation ==========

export const addUserQuest = async (userId: string, quest: Quest): Promise<UserQuest> => {
  const payload = await getPayload({ config })
  const userQuest = await payload.create({
    collection: 'user-quests',
    data: { userId, quest: quest.id, currentProgression: 0, isCompleted: false },
    depth: 1,
  })

  return userQuest as UserQuest
}

export const addMultipleUserQuests = async (userId: string, quests: Quest[]): Promise<void> => {
  for (const quest of quests) {
    await addUserQuest(userId, quest)
  }
}

// ========== User Quests Getters ==========

export const getUserQuests = async (userId: string, type?: Quest['type']): Promise<UserQuest[]> => {
  const payload = await getPayload({ config })

  const where: Where = {
    userId: { equals: userId },
  }

  if (type !== undefined) {
    where['quest.type'] = { equals: type }
  }

  const userQuests = await payload.find({
    collection: 'user-quests',
    where,
    depth: 1,
  })

  return userQuests.docs as UserQuest[]
}

export const getUserQuest = async (userId: string, questId: number): Promise<UserQuest | null> => {
  const payload = await getPayload({ config })

  const userQuestsResult = await payload.find({
    collection: 'user-quests',
    where: { userId: { equals: userId }, quest: { equals: questId } },
    depth: 1,
  })

  if (userQuestsResult.docs.length === 0) {
    return null
  }

  return userQuestsResult.docs[0] as UserQuest
}

// ========== User Quests Updates ==========

export const markQuestAsCompleted = async (userId: string, questId: number): Promise<void> => {
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'user-quests',
    where: {
      userId: { equals: userId },
      quest: { equals: questId },
    },
    data: {
      isCompleted: true,
    },
  })
}

export const updateUserQuestProgression = async (
  userId: string,
  questId: number,
  newProgression: number,
): Promise<void> => {
  const userQuest = await getUserQuest(userId, questId)

  if (!userQuest) {
    throw new Error('User quest not found')
  }

  const payload = await getPayload({ config })
  await payload.update({
    collection: 'user-quests',
    where: { userId: { equals: userId }, quest: { equals: questId } },
    data: { currentProgression: newProgression },
  })
}

// ========== User Quests Deletion ==========

export const deleteAllUserQuests = async (userId: string): Promise<void> => {
  const payload = await getPayload({ config })
  await payload.delete({
    collection: 'user-quests',
    where: {
      userId: { equals: userId },
    },
  })
}

export const deleteUserQuest = async (userId: string, questId: string): Promise<void> => {
  const payload = await getPayload({ config })
  await payload.delete({
    collection: 'user-quests',
    where: { userId: { equals: userId }, quest: { equals: questId } },
  })
}
