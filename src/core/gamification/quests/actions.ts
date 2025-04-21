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
import { addItemToInventory } from '../inventory'
import { Item } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

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
  const userId = userResult.value.id

  const userQuest = await getUserQuest(userId, questId)
  if (!userQuest) {
    throw new Error('Quest not found')
  }

  if (userQuest.isCompleted) {
    // Avoid re-completing and re-awarding
    console.warn(`Attempted to complete already completed quest: ${questId} for user ${userId}`)
    return false
  }

  const quest =
    typeof userQuest.quest === 'number'
      ? await getRandomQuest(1, 'easy') // Temporary fix, should use getQuestById
      : userQuest.quest

  // Ensure quest is fully loaded (especially difficulty)
  if (!quest || !quest.difficulty) {
    throw new Error(`Quest details or difficulty missing for quest ID: ${questId}`)
  }

  // Mark quest as completed in the database first
  await markQuestAsCompleted(userId, questId)

  // Add experience to the user only if not skipped (to avoid infinite loop)
  let xpGained = 0
  if (!skipExperienceReward) {
    await addExperience(userId, quest.experience)
    xpGained = quest.experience
  }

  // --- Add Chest Reward ---
  let chestRewardString = ''
  let awardedChest: Item | null = null
  const difficultyToRarityMap: Record<Quest['difficulty'], Item['rarity']> = {
    easy: 'common',
    medium: 'rare',
    hard: 'epic',
  }
  const requiredRarity = difficultyToRarityMap[quest.difficulty]

  if (requiredRarity) {
    try {
      const payload = await getPayload({ config })
      const chestItemResult = await payload.find({
        collection: 'items',
        where: {
          type: { equals: 'chest' },
          rarity: { equals: requiredRarity },
        },
        limit: 1,
        depth: 0, // No need for full item details here
      })

      if (chestItemResult.docs.length > 0) {
        awardedChest = chestItemResult.docs[0]
        await addItemToInventory(userId, awardedChest.id, 1)
        chestRewardString = ` & ${
          requiredRarity.charAt(0).toUpperCase() + requiredRarity.slice(1)
        } Chest`
      } else {
        console.error(
          `Error completing quest ${questId}: Chest item with rarity '${requiredRarity}' not found.`,
        )
      }
    } catch (error) {
      console.error(`Error awarding chest for quest ${questId}:`, error)
      // Proceed without chest if there's an error finding/adding it
    }
  }
  // --- End Chest Reward ---

  // Send a notification (adjusted content)
  await createNotification({
    userId: userId,
    content: `Quest completed: ${quest.title} (+${xpGained} XP${chestRewardString})`,
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

export const replaceUserQuest = async (questId: string): Promise<void> => {
  // Get current user
  const userResult = await getSessionUser()
  if (!userResult.success) {
    throw new Error('User not authenticated')
  }
  const userId = userResult.value.id

  // Get the quest to be replaced to find its difficulty
  const userQuest = await getUserQuest(userId, questId)
  if (!userQuest) {
    throw new Error('Quest to replace not found')
  }

  // Ensure quest object and difficulty are loaded
  const questDetails =
    typeof userQuest.quest === 'number'
      ? await getRandomQuest(1, 'easy') // Fallback, ideally use getQuestById
      : userQuest.quest

  if (!questDetails || !questDetails.difficulty) {
    throw new Error('Could not determine difficulty of the quest to replace.')
  }

  // Get a new random quest of the same difficulty
  const newQuest = await getRandomQuest(1, questDetails.difficulty)
  if (!newQuest) {
    throw new Error(`Failed to get a new random quest of difficulty '${questDetails.difficulty}'`)
  }

  // Delete the old quest
  await deleteUserQuest(userId, questId)

  // Add the new quest
  await addUserQuest(userId, newQuest)
}
