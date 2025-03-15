'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import { UserGamificationInformation } from '../../types/gamification/level'

export type LevelUpFormulaFunction = (currentLevel: number) => number

export const DEFAULT_LEVEL_UP_FORMULA: LevelUpFormulaFunction = (currentLevel: number) =>
  currentLevel * 100

export async function initializeUser(userId: string): Promise<void> {
  const payload = await getPayload({ config })

  if (await getUserGamificationInfo(userId)) {
    throw new Error('User already initialized')
  }

  await payload.create({
    collection: 'user-gamification',
    data: {
      userId,
      currentLevel: 1,
      currentExperience: 0,
      totalExperience: 0,
      lastLevelUpDate: new Date().toISOString(),
    },
  })
}

export async function addExperience(
  userId: string,
  experienceAmount: number,
): Promise<UserGamificationInformation> {
  const payload = await getPayload({ config })

  // Récupérer les informations actuelles de l'utilisateur
  const userInfo = await getUserGamificationInfo(userId)
  if (!userInfo) {
    throw new Error('User not found')
  }

  // Calculer la nouvelle expérience
  let newCurrentExperience = userInfo.currentExperience + experienceAmount
  const newTotalExperience = userInfo.totalExperience + experienceAmount
  let newLevel = userInfo.currentLevel
  let shouldUpdateLevelUpDate = false

  // Vérifier si l'utilisateur doit monter de niveau
  let shouldContinueChecking = true
  while (shouldContinueChecking) {
    const experienceForNextLevel = DEFAULT_LEVEL_UP_FORMULA(newLevel)

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

  // Convertir le résultat en UserGamificationInformation
  return convertToUserGamificationInfo(updatedUser.docs[0])
}

export async function increaseLevel(
  userId: string,
  levelAmount: number,
): Promise<UserGamificationInformation> {
  if (levelAmount <= 0) {
    throw new Error('Level amount must be positive')
  }

  const payload = await getPayload({ config })

  // Récupérer les informations actuelles de l'utilisateur
  const userInfo = await getUserGamificationInfo(userId)
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
  return convertToUserGamificationInfo(updatedUser.docs[0])
}

export async function recalculateLevel(
  userId: string,
  formula: LevelUpFormulaFunction,
): Promise<UserGamificationInformation> {
  const payload = await getPayload({ config })

  // Récupérer les informations actuelles de l'utilisateur
  const userInfo = await getUserGamificationInfo(userId)
  if (!userInfo) {
    throw new Error('User not found')
  }

  // Réinitialiser le niveau et l'expérience
  let newLevel = 1
  let remainingExperience = userInfo.totalExperience

  // Recalculer le niveau en fonction de l'expérience totale
  let shouldContinueChecking = true
  while (shouldContinueChecking) {
    const experienceForNextLevel = formula(newLevel)

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
  return convertToUserGamificationInfo(updatedUser.docs[0])
}

export async function getUserGamificationInfo(
  userId: string,
): Promise<UserGamificationInformation | null> {
  const payload = await getPayload({ config })

  try {
    // Rechercher l'utilisateur dans la base de données
    const result = await payload.find({
      collection: 'user-gamification',
      where: {
        userId: {
          equals: userId,
        },
      },
    })

    // Vérifier si l'utilisateur a été trouvé
    if (result.docs.length === 0) {
      return null
    }

    // Convertir le résultat en UserGamificationInformation
    return convertToUserGamificationInfo(result.docs[0])
  } catch (error) {
    console.error('Error fetching user gamification info:', error)
    return null
  }
}

/**
 * Convertit un document de la base de données en UserGamificationInformation
 */
function convertToUserGamificationInfo(doc: any): UserGamificationInformation {
  return {
    userId: doc.userId,
    currentLevel: doc.currentLevel,
    currentExperience: doc.currentExperience,
    totalExperience: doc.totalExperience,
    lastLevelUpDate: doc.lastLevelUpDate ? new Date(doc.lastLevelUpDate) : new Date(),
  }
}
