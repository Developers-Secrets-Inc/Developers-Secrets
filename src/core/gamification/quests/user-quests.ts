import { Quest, UserQuest as PayloadUserQuest } from '@/payload-types'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getQuestById } from '.'
/*  

Every user should have 4 quests per day. Two easy quests, one medium and one hard.
- On doit gérer la complétion d'une quête. Chaque quête doit avoir un status `isCompleted`.

*/

type UserQuest = PayloadUserQuest & {
  quest: Quest
}

// ========== User Quests Creation ==========

export const addUserQuest = async (userId: string, quest: Quest): Promise<void> => {
  const payload = await getPayload({ config })
  await payload.create({
    collection: 'user-quests',
    data: { userId, quest, currentProgression: 0, isCompleted: false },
  })
}

export const addMultipleUserQuests = async (userId: string, quests: Quest[]): Promise<void> => {
  for (const quest of quests) {
    await addUserQuest(userId, quest)
  }
}

// ========== User Quests Getters ==========

const convertUserQuest = async (userQuest: PayloadUserQuest): Promise<UserQuest> => {
  const quest =
    typeof userQuest.quest === 'number'
      ? await getQuestById(userQuest.quest)
      : (userQuest.quest as Quest)

  if (!quest) {
    throw new Error('Quest not found')
  }

  return {
    ...userQuest,
    quest,
  }
}

export const getUserQuests = async (userId: string): Promise<UserQuest[]> => {
  const payload = await getPayload({ config })

  const userQuests = await payload.find({
    collection: 'user-quests',
    where: {
      userId: { equals: userId },
    },
  })

  return Promise.all(userQuests.docs.map(convertUserQuest))
}

export const getUserQuest = async (userId: string, questId: string): Promise<UserQuest> => {
  const payload = await getPayload({ config })

  const userQuest = await payload.find({
    collection: 'user-quests',
    where: { userId: { equals: userId }, quest: { equals: questId } },
  })

  return convertUserQuest(userQuest.docs[0])
}

// ========== User Quests Updates ==========

export const markQuestAsCompleted = async (userId: string, questId: string): Promise<void> => {
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

export const increaseUserQuestProgression = async (
  userId: string,
  questId: string,
  quantity: number,
): Promise<void> => {
  const userQuest = await getUserQuest(userId, questId)

  if (!userQuest) {
    throw new Error('User quest not found')
  }

  const payload = await getPayload({ config })
  await payload.update({
    collection: 'user-quests',
    where: { userId: { equals: userId }, quest: { equals: questId } },
    data: { currentProgression: userQuest.currentProgression + quantity },
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
