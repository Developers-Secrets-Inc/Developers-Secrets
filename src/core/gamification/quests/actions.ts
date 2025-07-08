'use server'

import { Quest, UserQuest } from '@/payload-types'
import { getRandomQuest, getQuestById } from '.'
import {
  addMultipleUserQuests,
  addUserQuest,
  deleteAllUserQuests,
  deleteUserQuest,
  getUserQuest,
  getUserQuests,
  markQuestAsCompleted,
  updateUserQuestProgression,
} from './user-quests'
import { getSessionUser, getUserInformation } from '@/core/user'
import { addExperience, getGamificationInformations } from '../level'
import { createNotification } from '@/core/notifications'
import { addItemToInventory } from '../inventory'
import { Item } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getSessionUserQuests = async (): Promise<UserQuest[]> => {
  const userResult = await getSessionUser()
  if (!userResult.success) {
    throw new Error('User not authenticated')
  }

  return await getUserQuests(userResult.value.id)
}

const checkAndCompleteQuest = async (userId: string, questId: number) => {
  const quest = await getUserQuest(userId, questId)
  if (!quest || quest.isCompleted) return

  const questValue = quest.quest.value

  if (quest.currentProgression >= questValue) {
    await completeUserQuest(quest)
  }
}

const increaseUserQuestProgression = async (
  userId: string,
  userQuest: UserQuest,
  quantity: number,
) => {
  const NEW_PROGRESSION = userQuest.currentProgression + quantity
  const QUEST = userQuest.quest as Quest

  await updateUserQuestProgression(userId, QUEST.id, NEW_PROGRESSION)
  await checkAndCompleteQuest(userId, QUEST.id)
}

export const handleUserQuestsProgression = async (
  userId: string,
  type: Quest['type'],
  quantity: number,
) => {
  const userQuests = await getUserQuests(userId, type)

  await Promise.all(
    userQuests.map(async (userQuest: UserQuest) => {
      await increaseUserQuestProgression(userId, userQuest, quantity)
    }),
  )
}

export const handleExperienceGainForQuests = async (userId: string, experienceAmount: number) => {
  await handleUserQuestsProgression(userId, 'experienceGained', experienceAmount)
}

export const handleChallengeCompletionForQuests = async (userId: string) => {
  await handleUserQuestsProgression(userId, 'challengesCompleted', 1)
}

export const completeUserQuest = async (userQuest: UserQuest) => {
  if (userQuest.isCompleted) {
    console.warn(
      `Attempted to complete already completed quest: ${userQuest.id} for user ${userQuest.userId}`,
    )
    return false
  }

  const quest = userQuest.quest as Quest
  const userId = userQuest.userId

  await markQuestAsCompleted(userQuest.userId, quest.id)
  const chestRewardString = await handleChestReward(userQuest)
  await addExperience(userQuest.userId, quest.experience)

  await createNotification({
    userId: userId,
    content: `Quest completed: ${quest.title} (+${quest.experience} XP${chestRewardString})`,
    importance: 'medium',
    type: 'achievement',
  })

  return true
}

const handleChestReward = async (userQuest: UserQuest) => {
  const quest = userQuest.quest as Quest
  const questId = quest.id
  const userId = userQuest.userId

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

  return chestRewardString
}

const generateUserDailyQuests = async (): Promise<Quest[]> => {
  const easyQuestsArray = await getRandomQuest(2, 'easy') // Devrait retourner Quest[]
  const mediumQuestObject = await getRandomQuest(1, 'medium') // Devrait retourner Quest (objet unique)
  const hardQuestObject = await getRandomQuest(1, 'hard') // Devrait retourner Quest (objet unique)

  // Construit la liste: 2 faciles (d'un tableau), 1 moyenne (objet), 1 difficile (objet)
  const quests = [...easyQuestsArray, mediumQuestObject, hardQuestObject]

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

export const replaceUserQuest = async (
  questId: string,
): Promise<{ success: boolean; error?: string }> => {
  const payload = await getPayload({ config })

  // Get current user session
  const userResult = await getSessionUser()
  if (!userResult.success) {
    return { success: false, error: 'User not authenticated' }
  }
  const userId = userResult.value.id

  try {
    // Fetch user gamification data and general info concurrently
    const [userGamification, userInfo] = await Promise.all([
      getGamificationInformations(userId),
      getUserInformation(userId),
    ])

    // --- Daily Reset Logic ---
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0) // Normalize to start of UTC day
    const lastReplacementDate = userGamification.lastQuestReplacementDate
      ? new Date(userGamification.lastQuestReplacementDate)
      : null
    lastReplacementDate?.setUTCHours(0, 0, 0, 0)

    let currentReplacementsUsed = userGamification.dailyQuestReplacementsUsed || 0

    if (!lastReplacementDate || lastReplacementDate.getTime() < today.getTime()) {
      currentReplacementsUsed = 0
    }

    // --- Determine Limit based on Role ---
    const role = userInfo.role
    let maxReplacements: number
    switch (role) {
      // case 'lite':
      //   maxReplacements = 2
      //   break
      case 'pro':
        maxReplacements = 3
        break
      case 'max':
        maxReplacements = Infinity // Effectively unlimited
        break
      case 'basic':
      default:
        maxReplacements = 1
        break
    }

    // --- Check Limit ---
    if (currentReplacementsUsed >= maxReplacements) {
      return { success: false, error: 'Daily quest replacement limit reached.' }
    }

    // Get the quest to be replaced
    const userQuestToReplace = await getUserQuest(userId, questId)
    if (!userQuestToReplace) {
      return { success: false, error: 'Quest to replace not found for this user.' }
    }
    if (userQuestToReplace.isCompleted) {
      return { success: false, error: 'Cannot replace a completed quest.' }
    }

    // Ensure quest details and difficulty are loaded
    const questDetails: Quest | undefined =
      typeof userQuestToReplace.quest === 'number'
        ? await getQuestById(userQuestToReplace.quest)
        : (userQuestToReplace.quest as Quest)

    if (!questDetails || !questDetails.difficulty) {
      throw new Error('Could not determine details or difficulty of the quest to replace.')
    }
    const difficulty = questDetails.difficulty

    // --- Get Replacement Quest ---
    // 1. Get IDs of current active (non-completed) quests
    const activeUserQuests = await getUserQuests(userId)
    const activeQuestIds = activeUserQuests
      .filter((uq) => !uq.isCompleted)
      .map((uq) => (typeof uq.quest === 'number' ? uq.quest : uq.quest.id))

    // 2. Fetch potential replacements
    const potentialReplacements = await getRandomQuest(5, difficulty) // Fetch a few candidates
    if (!Array.isArray(potentialReplacements)) {
      // Handle case where getRandomQuest returns a single object or nothing
      throw new Error(`Failed to get potential replacement quests of difficulty '${difficulty}'`)
    }

    // 3. Find a unique replacement
    let newQuest: Quest | undefined = potentialReplacements.find(
      (quest) => !activeQuestIds.includes(quest.id),
    )

    // If no unique quest found in the first batch, take the first one that is not the one being replaced
    if (!newQuest) {
      newQuest = potentialReplacements.find((quest) => quest.id !== questDetails.id)
    }

    // If still no suitable quest (very unlikely with enough quest variety), error out
    if (!newQuest) {
      console.warn(
        `Could not find a suitable unique replacement quest for quest ${questId} (difficulty: ${difficulty}) for user ${userId}.`,
      )
      return { success: false, error: 'No suitable replacement quest available. Try again later.' }
    }

    // --- Perform Replacement ---
    await deleteUserQuest(userId, questId)
    await addUserQuest(userId, newQuest)

    // --- Update Gamification Stats ---
    await payload.update({
      collection: 'user-gamification',
      id: userGamification.id, // Use the gamification record ID
      data: {
        dailyQuestReplacementsUsed: currentReplacementsUsed + 1,
        lastQuestReplacementDate: today.toISOString(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error(`Error replacing quest ${questId} for user ${userId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, error: `Failed to replace quest: ${errorMessage}` }
  }
}

// --- New Action to get Replacement Stats ---
export const getQuestReplacementInfo = async (): Promise<{
  role: string
  replacementsUsed: number
  maxReplacements: number
}> => {
  const userResult = await getSessionUser()
  if (!userResult.success) {
    throw new Error('User not authenticated')
  }
  const userId = userResult.value.id

  try {
    const [userGamification, userInfo] = await Promise.all([
      getGamificationInformations(userId),
      getUserInformation(userId),
    ])

    // Reset logic (mirrors the one in replaceUserQuest)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const lastReplacementDate = userGamification.lastQuestReplacementDate
      ? new Date(userGamification.lastQuestReplacementDate)
      : null
    lastReplacementDate?.setUTCHours(0, 0, 0, 0)

    let currentReplacementsUsed = userGamification.dailyQuestReplacementsUsed || 0
    if (!lastReplacementDate || lastReplacementDate.getTime() < today.getTime()) {
      currentReplacementsUsed = 0
    }

    // Determine limit
    const role = userInfo.role
    let maxReplacements: number
    switch (role) {
      // case 'lite': maxReplacements = 2; break; // Keep commented out as per user edit
      case 'pro':
        maxReplacements = 3
        break
      case 'max':
        maxReplacements = Infinity
        break
      case 'basic':
      default:
        maxReplacements = 1
        break
    }

    return {
      role: role,
      replacementsUsed: currentReplacementsUsed,
      maxReplacements: maxReplacements,
    }
  } catch (error) {
    console.error(`Error fetching quest replacement info for user ${userId}:`, error)
    // Return default/basic values on error
    return {
      role: 'basic',
      replacementsUsed: 0,
      maxReplacements: 1,
    }
  }
}
// --- End New Action ---
