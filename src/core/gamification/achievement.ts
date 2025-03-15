'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import {
  Achievement,
  AchievementTier,
  AchievementType,
  UserAchievementProgress,
  UserAchievements,
  getTierByValue,
} from '../../types/gamification/achievement'
import { addCoins } from './currency'
import { addExperience } from './level'

/**
 * Initialise les accomplissements pour un utilisateur
 */
export async function initializeUserAchievements(userId: string): Promise<void> {
  const payload = await getPayload({ config })

  // Vérifier si l'utilisateur a déjà des accomplissements
  const existingUserAchievements = await payload.find({
    collection: 'user-achievements',
    where: {
      userId: {
        equals: userId,
      },
    },
  })

  if (existingUserAchievements.docs.length > 0) {
    throw new Error('User achievements already initialized')
  }

  // Récupérer tous les accomplissements actifs
  const achievements = await payload.find({
    collection: 'achievements',
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  // Créer un tableau de progression vide pour chaque accomplissement
  const achievementEntries = achievements.docs.map((achievement) => ({
    achievementId: achievement.id,
    currentValue: 0,
    currentTier: AchievementTier.NONE,
    unlockedTiers: [],
    lastUpdated: new Date().toISOString(),
  }))

  // Créer l'entrée pour l'utilisateur
  await payload.create({
    collection: 'user-achievements',
    data: {
      userId,
      achievements: achievementEntries,
      totalAchievements: 0,
      lastUpdated: new Date().toISOString(),
    },
  })
}

/**
 * Récupère les accomplissements d'un utilisateur
 */
export async function getUserAchievements(userId: string): Promise<UserAchievements | null> {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'user-achievements',
      where: {
        userId: {
          equals: userId,
        },
      },
      depth: 2, // Pour récupérer les détails des accomplissements liés
    })

    if (result.docs.length === 0) {
      return null
    }

    return result.docs[0] as unknown as UserAchievements
  } catch (error) {
    console.error('Error fetching user achievements:', error)
    return null
  }
}

/**
 * Met à jour la progression d'un accomplissement pour un utilisateur
 */
export async function updateAchievementProgress(
  userId: string,
  achievementType: AchievementType,
  newValue: number,
): Promise<UserAchievementProgress | null> {
  const payload = await getPayload({ config })

  // Récupérer les accomplissements de l'utilisateur
  const userAchievements = await getUserAchievements(userId)
  if (!userAchievements) {
    throw new Error('User achievements not found')
  }

  // Récupérer tous les accomplissements du type spécifié
  const achievements = await payload.find({
    collection: 'achievements',
    where: {
      type: {
        equals: achievementType,
      },
      isActive: {
        equals: true,
      },
    },
  })

  if (achievements.docs.length === 0) {
    return null
  }

  // Pour chaque accomplissement du type spécifié, mettre à jour la progression
  const updatedAchievements: UserAchievementProgress[] = []

  for (const achievement of achievements.docs) {
    // Trouver la progression actuelle pour cet accomplissement
    const achievementProgress = userAchievements.achievements.find((a) => {
      if (typeof a.achievementId === 'string' && a.achievementId === achievement.id) {
        return true
      }
      if (typeof a.achievementId === 'object' && a.achievementId && 'id' in a.achievementId) {
        return a.achievementId.id === achievement.id
      }
      return false
    })

    if (!achievementProgress) {
      continue
    }

    // Convertir l'accomplissement au format attendu
    const typedAchievement = achievement as unknown as Achievement

    // Déterminer le niveau actuel et le nouveau niveau
    const currentTier = achievementProgress.currentTier
    const newTier = getTierByValue(typedAchievement, newValue)

    // Préparer les données de mise à jour
    const updatedProgress: UserAchievementProgress = {
      ...achievementProgress,
      currentValue: newValue,
      currentTier: newTier,
      lastUpdated: new Date(),
    }

    // Si un nouveau niveau a été atteint, l'ajouter aux niveaux débloqués
    if (newTier !== AchievementTier.NONE && newTier !== currentTier) {
      // Vérifier si ce niveau a déjà été débloqué
      const tierAlreadyUnlocked = updatedProgress.unlockedTiers.some((ut) => ut.tier === newTier)

      if (!tierAlreadyUnlocked) {
        // Trouver les informations du niveau
        const tierInfo = typedAchievement.tiers.find((t) => t.name === newTier)

        if (tierInfo) {
          // Ajouter le niveau aux niveaux débloqués
          updatedProgress.unlockedTiers.push({
            tier: newTier,
            unlockedAt: new Date(),
            rewardClaimed: false,
          })

          // Attribuer automatiquement les récompenses
          if (tierInfo.rewardCoins > 0) {
            await addCoins(
              userId,
              tierInfo.rewardCoins,
              'achievement_reward',
              `Récompense pour l'accomplissement "${typedAchievement.title}" - niveau ${newTier}`,
            )
          }

          if (tierInfo.rewardXp > 0) {
            await addExperience(userId, tierInfo.rewardXp)
          }

          // Marquer la récompense comme réclamée
          updatedProgress.unlockedTiers[updatedProgress.unlockedTiers.length - 1].rewardClaimed =
            true
        }
      }
    }

    updatedAchievements.push(updatedProgress)
  }

  // Mettre à jour les accomplissements de l'utilisateur
  if (updatedAchievements.length > 0) {
    // Créer un nouvel array avec les accomplissements mis à jour
    const newAchievements = userAchievements.achievements.map((achievement) => {
      const updated = updatedAchievements.find((ua) => {
        if (typeof ua.achievementId === 'string' && typeof achievement.achievementId === 'string') {
          return ua.achievementId === achievement.achievementId
        }
        if (
          typeof ua.achievementId === 'object' &&
          typeof achievement.achievementId === 'object' &&
          ua.achievementId &&
          achievement.achievementId &&
          'id' in ua.achievementId &&
          'id' in achievement.achievementId
        ) {
          return ua.achievementId.id === achievement.achievementId.id
        }
        return false
      })
      return updated || achievement
    })

    // Convertir les données pour la mise à jour
    const achievementsForUpdate = newAchievements.map((achievement) => {
      // Si achievementId est un objet, le convertir en ID string
      const achievementId =
        typeof achievement.achievementId === 'object' &&
        achievement.achievementId &&
        'id' in achievement.achievementId
          ? achievement.achievementId.id
          : achievement.achievementId

      // Convertir les dates en chaînes ISO
      const lastUpdated =
        typeof achievement.lastUpdated === 'object'
          ? achievement.lastUpdated.toISOString()
          : achievement.lastUpdated

      // Convertir les unlockedTiers
      const unlockedTiers = achievement.unlockedTiers.map((tier) => ({
        ...tier,
        unlockedAt:
          typeof tier.unlockedAt === 'object' ? tier.unlockedAt.toISOString() : tier.unlockedAt,
      }))

      return {
        achievementId,
        currentValue: achievement.currentValue,
        currentTier: achievement.currentTier,
        unlockedTiers,
        lastUpdated,
      }
    })

    // Mettre à jour dans la base de données
    await payload.update({
      collection: 'user-achievements',
      where: {
        userId: {
          equals: userId,
        },
      },
      data: {
        achievements: achievementsForUpdate,
        lastUpdated: new Date().toISOString(),
      },
    })

    return updatedAchievements[0]
  }

  return null
}

/**
 * Incrémente la progression d'un accomplissement pour un utilisateur
 */
export async function incrementAchievementProgress(
  userId: string,
  achievementType: AchievementType,
  incrementValue: number = 1,
): Promise<UserAchievementProgress | null> {
  const payload = await getPayload({ config })

  // Récupérer les accomplissements de l'utilisateur
  const userAchievements = await getUserAchievements(userId)
  if (!userAchievements) {
    throw new Error('User achievements not found')
  }

  // Récupérer tous les accomplissements du type spécifié
  const achievements = await payload.find({
    collection: 'achievements',
    where: {
      type: {
        equals: achievementType,
      },
      isActive: {
        equals: true,
      },
    },
  })

  if (achievements.docs.length === 0) {
    return null
  }

  // Pour le premier accomplissement du type spécifié, incrémenter la progression
  const achievement = achievements.docs[0]
  const achievementProgress = userAchievements.achievements.find((a) => {
    if (typeof a.achievementId === 'string' && a.achievementId === achievement.id) {
      return true
    }
    if (typeof a.achievementId === 'object' && a.achievementId && 'id' in a.achievementId) {
      return a.achievementId.id === achievement.id
    }
    return false
  })

  if (!achievementProgress) {
    return null
  }

  // Calculer la nouvelle valeur
  const newValue = achievementProgress.currentValue + incrementValue

  // Mettre à jour la progression
  return updateAchievementProgress(userId, achievementType, newValue)
}

/**
 * Récupère les détails d'un accomplissement
 */
export async function getAchievement(achievementId: string): Promise<Achievement | null> {
  const payload = await getPayload({ config })

  try {
    const achievement = await payload.findByID({
      collection: 'achievements',
      id: achievementId,
    })

    return achievement as unknown as Achievement
  } catch (error) {
    console.error('Error fetching achievement:', error)
    return null
  }
}

/**
 * Récupère tous les accomplissements actifs
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  const payload = await getPayload({ config })

  try {
    const achievements = await payload.find({
      collection: 'achievements',
      where: {
        isActive: {
          equals: true,
        },
      },
    })

    return achievements.docs as unknown as Achievement[]
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
}
