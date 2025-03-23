'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import { UserGamification } from '@/payload-types'


export const DEFAULT_LEVEL_UP_FORMULA = (currentLevel: number) =>
  currentLevel * 100


// ================================================
// Create Operations
// ================================================


const BASE_LEVEL = 1
const BASE_EXPERIENCE = 0

export async function initializeUser(userId: string): Promise<void> {
  const payload = await getPayload({ config })

  // ! May not work because no null value is returned
  if (await getGamificationInformations(userId)) {
    throw new Error('User already initialized')
  }

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

// ================================================
// Read Operations
// ================================================


// TODO: Add UserGamificationNotFoundError
export const getGamificationInformations = async (userId: string): Promise<UserGamification> => {
  const payload = await getPayload({ config })

  const informations = await payload.find({
    collection: 'user-gamification',
    where: {
      userId: {
        equals: userId,
      },
    },
  })

  if (informations.docs.length === 0) {
    throw new Error('User not found')
  }

  return informations.docs[0]
}


export const getUserExperience = async (userId: string): Promise<number> => {
  const informations = await getGamificationInformations(userId)

  return informations.currentExperience
}


export const getUserLevel = async (userId: string): Promise<number> => {
  const informations = await getGamificationInformations(userId)

  return informations.currentLevel
}


export const getUserTotalExperience = async (userId: string): Promise<number> => {
  const informations = await getGamificationInformations(userId)

  return informations.totalExperience
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
  const userInfo = await getGamificationInformations(userId)
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

export async function recalculateLevel(
  userId: string,
): Promise<UserGamification> {
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
    const experienceForNextLevel = DEFAULT_LEVEL_UP_FORMULA(newLevel)

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

