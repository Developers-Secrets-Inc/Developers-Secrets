'use server'

import { getSessionUser } from '@/core/user'
import { getGamificationInformations, getUserNextLevelExperience } from '@/core/gamification/level'
import { getPayload } from 'payload'
import config from '@payload-config'

export interface UserProfile {
  id: string
  name: string
  avatar: string
  level: number
  experience: number
  maxExperience: number
  isPremium: boolean
  followers: number
  following: number
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const userResult = await getSessionUser()

  if (!userResult.success) {
    return null
  }

  const user = userResult.value

  // Récupérer les informations de gamification
  let gamificationInfo
  try {
    gamificationInfo = await getGamificationInformations(user.id)
  } catch (error) {
    // Si l'utilisateur n'a pas encore d'informations de gamification, on utilise des valeurs par défaut
    gamificationInfo = {
      currentLevel: 1,
      currentExperience: 0,
      totalExperience: 0,
    }
  }

  // Récupérer l'expérience nécessaire pour le prochain niveau
  const maxExperience = await getUserNextLevelExperience(user.id)

  return {
    id: user.id,
    name: user.informations.name,
    avatar: user.informations.avatar,
    level: gamificationInfo.currentLevel,
    experience: gamificationInfo.currentExperience,
    maxExperience,
    isPremium: user.informations.role !== 'basic',
    followers: 0, // À implémenter avec la base de données
    following: 0, // À implémenter avec la base de données
  }
}

export async function getUserProfileBySlug(slug: string): Promise<UserProfile | null> {
  const payload = await getPayload({ config })

  // Chercher l'utilisateur par son nom slugifié
  const users = await payload.find({
    collection: 'user-informations',
    where: {
      name: {
        like: slug.replace(/-/g, ' '),
      },
    },
    limit: 1,
  })

  if (!users.docs.length) {
    return null
  }

  const user = users.docs[0]

  // Récupérer les informations de gamification
  let gamificationInfo
  try {
    gamificationInfo = await getGamificationInformations(user.userId)
  } catch (error) {
    // Si l'utilisateur n'a pas encore d'informations de gamification, on utilise des valeurs par défaut
    gamificationInfo = {
      currentLevel: 1,
      currentExperience: 0,
      totalExperience: 0,
    }
  }

  // Récupérer l'expérience nécessaire pour le prochain niveau
  const maxExperience = await getUserNextLevelExperience(user.userId)

  return {
    id: user.userId,
    name: user.name || '',
    avatar: user.avatar || '',
    level: gamificationInfo.currentLevel,
    experience: gamificationInfo.currentExperience,
    maxExperience,
    isPremium: user.role !== 'basic',
    followers: 0, // À implémenter avec la base de données
    following: 0, // À implémenter avec la base de données
  }
}
