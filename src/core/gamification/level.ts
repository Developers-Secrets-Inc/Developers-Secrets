'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getUserInformation } from '@/core/user'
import { handleExperienceGainForQuests } from './quests/actions'

import { UserGamification } from '@/payload-types'

export const DEFAULT_LEVEL_UP_FORMULA = async (currentLevel: number) => currentLevel * 100

// ================================================
// Create Operations
// ================================================

const BASE_LEVEL = 1
const BASE_EXPERIENCE = 0

export async function initializeUser(userId: string): Promise<void> {
  const payload = await getPayload({ config })

  try {
    if (await getGamificationInformations(userId)) {
      throw new Error('User already initialized')
    }
  } catch (_error) {
    await payload.create({
      collection: 'user-gamification',
      data: {
        userId,
        currentLevel: BASE_LEVEL,
        currentExperience: BASE_EXPERIENCE,
        totalExperience: BASE_EXPERIENCE,
        lastLevelUpDate: new Date().toISOString(),
      },
    })
  }
}

// ================================================
// Read Operations
// ================================================

const getPayloadUserGamification = async (userId: string): Promise<UserGamification[]> => {
  const payload = await getPayload({ config })

  const informations = await payload.find({
    collection: 'user-gamification',
    where: {
      userId: {
        equals: userId,
      },
    },
  })

  return informations.docs
}

export const getGamificationInformations = async (userId: string): Promise<UserGamification> => {
  const userGamification = await getPayloadUserGamification(userId)

  const HAS_INFORMATIONS = userGamification.length > 0
  const HAS_MULTIPLE_INFORMATIONS = userGamification.length > 1

  if (HAS_MULTIPLE_INFORMATIONS) {
    throw new Error(
      `User with id ${userId} has multiple gamification informations. This is an admin problem, you should check the UserGamification collection. This may error may have been caused by calling initializeUser multiple times.`,
    )
  }

  if (!HAS_INFORMATIONS) {
    throw new Error(
      `User with id ${userId} has no gamification informations. This is an admin problem, you should check the UserGamification collection. This may error may have been caused by not calling initializeUser. A user has no gamification informations if they have not completed any challenge.`,
    )
  }

  return userGamification[0]
}

export const getUserNextLevelExperience = async (userId: string): Promise<number> => {
  const informations = await getGamificationInformations(userId)

  return DEFAULT_LEVEL_UP_FORMULA(informations.currentLevel)
}

// ================================================
// Update Operations
// ================================================

export async function addExperience(
  userId: string,
  experienceAmount: number,
): Promise<UserGamification> {
  const payload = await getPayload({ config })

  // Récupérer les informations actuelles de l'utilisateur
  try {
    await getGamificationInformations(userId)
  } catch (error) {
    await initializeUser(userId)
  }
  const userInfo = await getGamificationInformations(userId)

  // Calculer la nouvelle expérience
  let newCurrentExperience = userInfo.currentExperience + experienceAmount
  const newTotalExperience = userInfo.totalExperience + experienceAmount
  let newLevel = userInfo.currentLevel
  let shouldUpdateLevelUpDate = false

  // Vérifier si l'utilisateur doit monter de niveau
  let shouldContinueChecking = true
  while (shouldContinueChecking) {
    const experienceForNextLevel = await DEFAULT_LEVEL_UP_FORMULA(newLevel)

    if (newCurrentExperience >= experienceForNextLevel) {
      // Monter de niveau
      newLevel += 1
      newCurrentExperience -= experienceForNextLevel
      shouldUpdateLevelUpDate = true
    } else {
      // Pas besoin de monter de niveau
      shouldContinueChecking = false
    }
  }

  // Mettre à jour les informations de l'utilisateur
  const updateData: {
    currentLevel: number
    currentExperience: number
    totalExperience: number
    lastLevelUpDate?: string
  } = {
    currentLevel: newLevel,
    currentExperience: newCurrentExperience,
    totalExperience: newTotalExperience,
  }

  // Mettre à jour la date de dernier level up si nécessaire
  if (shouldUpdateLevelUpDate) {
    updateData.lastLevelUpDate = new Date().toISOString()
  }

  // Effectuer la mise à jour dans la base de données
  const updatedUser = await payload.update({
    collection: 'user-gamification',
    where: {
      userId: {
        equals: userId,
      },
    },
    data: updateData,
  })

  // Update quest progression for experience gain quests
  await handleExperienceGainForQuests(userId, experienceAmount)

  // Convertir le résultat en UserGamificationInformation
  return updatedUser.docs[0]
}

export async function increaseLevel(
  userId: string,
  levelAmount: number,
): Promise<UserGamification> {
  if (levelAmount <= 0) {
    throw new Error('Level amount must be positive')
  }

  const payload = await getPayload({ config })

  // Récupérer les informations actuelles de l'utilisateur
  const userInfo = await getGamificationInformations(userId)
  if (!userInfo) {
    throw new Error('User not found')
  }

  // Calculer le nouveau niveau
  const newLevel = userInfo.currentLevel + levelAmount

  // Mettre à jour les informations de l'utilisateur
  const updatedUser = await payload.update({
    collection: 'user-gamification',
    where: {
      userId: {
        equals: userId,
      },
    },
    data: {
      currentLevel: newLevel,
      lastLevelUpDate: new Date().toISOString(),
    },
  })

  // Convertir le résultat en UserGamificationInformation
  return updatedUser.docs[0]
}

export async function recalculateLevel(userId: string): Promise<UserGamification> {
  const payload = await getPayload({ config })

  // Récupérer les informations actuelles de l'utilisateur
  const userInfo = await getGamificationInformations(userId)
  if (!userInfo) {
    throw new Error('User not found')
  }

  // Réinitialiser le niveau et l'expérience
  let newLevel = 1
  let remainingExperience = userInfo.totalExperience

  // Recalculer le niveau en fonction de l'expérience totale
  let shouldContinueChecking = true
  while (shouldContinueChecking) {
    const experienceForNextLevel = await DEFAULT_LEVEL_UP_FORMULA(newLevel)

    if (remainingExperience >= experienceForNextLevel) {
      // Monter de niveau
      newLevel += 1
      remainingExperience -= experienceForNextLevel
    } else {
      // Pas besoin de monter de niveau
      shouldContinueChecking = false
    }
  }

  // Mettre à jour les informations de l'utilisateur
  const updatedUser = await payload.update({
    collection: 'user-gamification',
    where: {
      userId: {
        equals: userId,
      },
    },
    data: {
      currentLevel: newLevel,
      currentExperience: remainingExperience,
      lastLevelUpDate: new Date().toISOString(),
    },
  })

  // Convertir le résultat en UserGamificationInformation
  return updatedUser.docs[0]
}

type LeaderboardPeriod = 'day' | 'week' | 'month'

type LeaderboardEntry = {
  informations: {
    id: number
    userId: string
    name: string
    avatar: string
    initials: string
  }
  totalExperience: number
  rank: number
}

export async function getLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardEntry[]> {
  const payload = await getPayload({ config })

  // Get the date range based on the period
  const now = new Date()
  const startDate = new Date()

  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
  }

  // Get all user gamification data
  const gamificationData = await payload.find({
    collection: 'user-gamification',
    where: {
      lastLevelUpDate: {
        greater_than: startDate.toISOString(),
      },
    },
    sort: '-totalExperience',
  })

  // Get user information for each gamification entry
  const leaderboardEntries: LeaderboardEntry[] = []

  for (const entry of gamificationData.docs) {
    try {
      const userInfo = await getUserInformation(entry.userId)

      leaderboardEntries.push({
        informations: {
          id: Number(entry.id),
          userId: entry.userId,
          name: userInfo.name,
          avatar: userInfo.avatar,
          initials: userInfo.initials,
        },
        totalExperience: entry.totalExperience,
        rank: 0, // Will be set after sorting
      })
    } catch (error) {
      console.error(`Failed to get user information for user ${entry.userId}:`, error)
      // Skip this user if we can't get their information
      continue
    }
  }

  // Sort by total experience and assign ranks
  leaderboardEntries.sort((a, b) => b.totalExperience - a.totalExperience)
  leaderboardEntries.forEach((entry, index) => {
    entry.rank = index + 1
  })

  return leaderboardEntries
}
