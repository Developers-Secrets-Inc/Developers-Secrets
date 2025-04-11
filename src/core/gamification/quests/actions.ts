'use server'

import { Quest } from '@/payload-types'
import { getRandomQuest } from '.'
import {
  addMultipleUserQuests,
  addUserQuest,
  deleteAllUserQuests,
  deleteUserQuest,
  getUserQuest,
  getUserQuests,
  markQuestAsCompleted,
  increaseUserQuestProgression,
} from './user-quests'
import { getSessionUser } from '@/core/user'
import { addExperience } from '../level'
import { createNotification } from '@/core/notifications'

/*   

- On doit avoir une action qui permet d'ajouter les quêtes quotidiennes à un utilisateur.
    - Chaque jour, on doit supprimer les quêtes de l'utilisateur et en ajouter de nouvelles. On doit faire attention à de potentiels conflits. On doit faire un `deleteAllUserQuests` et un `addUserQuests`
- On doit avoir une action qui permet de modifier une quête spécifique d'un utilisateur.

*/

export const fetchUserQuests = async () => {
  const userResult = await getSessionUser()
  if (!userResult.success) {
    throw new Error('User not authenticated')
  }

  const payloadQuests = await getUserQuests(userResult.value.id)
  const convertedQuests = await Promise.all(
    payloadQuests.map(async (pq) => {
      const fullQuest =
        typeof pq.quest === 'number'
          ? await getRandomQuest(1, 'easy') // Temporary fix, should use getQuestById
          : pq.quest

      return {
        ...pq,
        quest: fullQuest,
        currentProgression: pq.currentProgression || 0,
        isCompleted: pq.isCompleted || false,
      }
    }),
  )

  return convertedQuests
}

/**
 * Vérifie si une quête doit être complétée en fonction de sa progression
 * et la complète si nécessaire
 */
const checkAndCompleteQuest = async (userId: string, questId: string) => {
  const quest = await getUserQuest(userId, questId)
  if (!quest || quest.isCompleted) return

  const questValue =
    typeof quest.quest === 'number'
      ? (await getRandomQuest(1, 'easy')).value // Temporary fix, should use getQuestById
      : quest.quest.value

  if (quest.currentProgression >= questValue) {
    // Pass skipExperienceReward=true when called from handleExperienceGainForQuests
    await completeUserQuest(questId, true)
  }
}

export const handleExperienceGainForQuests = async (userId: string, experienceAmount: number) => {
  const userQuests = await getUserQuests(userId)

  // Filter quests that are related to experience gain and not completed yet
  const experienceQuests = userQuests.filter(
    (quest) =>
      !quest.isCompleted &&
      typeof quest.quest !== 'number' &&
      quest.quest.type === 'experienceGained',
  )

  // Increase progression for each relevant quest
  for (const quest of experienceQuests) {
    const questId = typeof quest.quest === 'number' ? quest.quest : quest.quest.id
    await increaseUserQuestProgression(userId, questId.toString(), experienceAmount)
    await checkAndCompleteQuest(userId, questId.toString())
  }
}

export const handleChallengeCompletionForQuests = async (userId: string) => {
  const userQuests = await getUserQuests(userId)

  // Filter quests that are related to challenge completion and not completed yet
  const challengeQuests = userQuests.filter(
    (quest) =>
      !quest.isCompleted &&
      typeof quest.quest !== 'number' &&
      quest.quest.type === 'challengesCompleted',
  )

  // Increase progression for each relevant quest
  for (const quest of challengeQuests) {
    const questId = typeof quest.quest === 'number' ? quest.quest : quest.quest.id
    await increaseUserQuestProgression(userId, questId.toString(), 1)
    await checkAndCompleteQuest(userId, questId.toString())
  }
}

export const completeUserQuest = async (questId: string, skipExperienceReward: boolean = false) => {
  const userResult = await getSessionUser()
  if (!userResult.success) {
    throw new Error('User not authenticated')
  }

  const userQuest = await getUserQuest(userResult.value.id, questId)
  if (!userQuest) {
    throw new Error('Quest not found')
  }

  const quest =
    typeof userQuest.quest === 'number'
      ? await getRandomQuest(1, 'easy') // Temporary fix, should use getQuestById
      : userQuest.quest

  // Mark quest as completed in the database first
  await markQuestAsCompleted(userResult.value.id, questId)

  // Add experience to the user only if not skipped (to avoid infinite loop)
  if (!skipExperienceReward) {
    await addExperience(userResult.value.id, quest.experience)
  }

  // Send a notification
  await createNotification({
    userId: userResult.value.id,
    content: `Quest completed: ${quest.title} (+${quest.experience} XP)`,
    importance: 'medium',
    type: 'achievement',
  })

  return true
}

const generateUserDailyQuests = async (): Promise<Quest[]> => {
  const easyQuests = await getRandomQuest(2, 'easy')
  const mediumQuest = await getRandomQuest(1, 'medium')
  const hardQuest = await getRandomQuest(1, 'hard')

  const quests = [...easyQuests, mediumQuest, hardQuest]

  return quests
}

export const setUserDailyQuests = async (userId: string): Promise<void> => {
  const quests = await generateUserDailyQuests()
  await deleteAllUserQuests(userId)
  await addMultipleUserQuests(userId, quests)
}

export const areUserDailyQuestsExpired = async (userId: string): Promise<boolean> => {
  const userQuests = await getUserQuests(userId)

  if (userQuests.length === 0) {
    return true
  }

  const lastQuest = userQuests[userQuests.length - 1]
  const lastQuestDate = new Date(lastQuest.createdAt)
  const today = new Date()
  const oneDayInMillis = 24 * 60 * 60 * 1000
  return today.getTime() - lastQuestDate.getTime() >= oneDayInMillis
}

export const replaceUserQuest = async (userId: string, questId: string): Promise<void> => {
  const userQuest = await getUserQuest(userId, questId)
  const newQuest = await getRandomQuest(1, userQuest.quest.difficulty)

  await deleteUserQuest(userId, questId)
  await addUserQuest(userId, newQuest)
}
