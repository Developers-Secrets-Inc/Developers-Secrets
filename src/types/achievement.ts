/**
 * Type d'accomplissement
 */
export type AchievementType =
  | 'challenges_completed' // Nombre de challenges complétés
  | 'quests_completed' // Nombre de quêtes complétées
  | 'guild_level' // Niveau de guilde atteint
  | 'members_invited' // Nombre de membres invités
  | 'courses_completed' // Nombre de formations terminées
  | 'contribution' // Points de contribution accumulés
  | 'time_spent' // Temps passé sur la plateforme
  | 'consecutive_days' // Jours consécutifs de connexion
  | 'friends_count' // Nombre d'amis
  | 'special' // Accomplissements spéciaux

/**
 * Niveau de rareté d'un accomplissement
 */
export type AchievementRarity =
  | 'common' // Commun (facile à obtenir)
  | 'uncommon' // Peu commun
  | 'rare' // Rare
  | 'epic' // Épique
  | 'legendary' // Légendaire (très difficile à obtenir)

/**
 * Niveaux de progression des accomplissements
 */
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond'

/**
 * Configuration des paliers pour chaque niveau d'accomplissement
 */
export type AchievementTierConfig = {
  tier: AchievementTier
  requiredValue: number
  reward: AchievementReward
  imageUrl: string
}

/**
 * Condition pour obtenir un accomplissement
 */
export type AchievementCondition = {
  type: AchievementType
  requiredValue: number // Valeur requise pour débloquer l'accomplissement
  currentValue?: number // Valeur actuelle (pour le suivi de progression)
}

/**
 * Récompense pour un accomplissement
 */
export type AchievementReward = {
  experiencePoints: number // Points d'expérience gagnés
  badge?: {
    name: string
    imageUrl: string
  }
  unlocks?: string[] // IDs des éléments débloqués
}

/**
 * Représente un accomplissement
 */
export type Achievement = {
  id: string
  name: string
  description: string

  // Type et rareté
  type: AchievementType
  rarity: AchievementRarity

  // Image de l'accomplissement par défaut
  defaultImageUrl: string

  // Conditions d'obtention et paliers
  tiers: AchievementTierConfig[]

  // Métadonnées
  metadata: {
    createdAt: string
    updatedAt: string
    unlockedBy: number // Nombre de personnes ayant débloqué cet accomplissement
  }
}

/**
 * Représente une série d'accomplissements progressifs
 */
export type AchievementSeries = {
  id: string
  name: string
  description: string

  // Liste des accomplissements dans l'ordre de progression
  achievements: Achievement[]
}

/**
 * Données utilisateur associées aux accomplissements
 */
export type UserAchievementData = {
  userId: string
  metrics: {
    [key in AchievementType]?: number
  }
  lastUpdated: string
}

/**
 * Représente un accomplissement débloqué par un utilisateur
 */
export type UnlockedAchievement = {
  achievementId: string
  userId: string
  unlockedAt: string

  // Niveau actuel débloqué
  currentTier: AchievementTier

  // Progression vers le prochain niveau
  progress: number // Pourcentage de progression (0-100)
  currentValue: number // Valeur actuelle
  nextTierRequiredValue?: number // Valeur requise pour le prochain niveau
}

/**
 * Fonction de vérification pour déterminer si un utilisateur a débloqué un accomplissement
 */
export type AchievementChecker = (
  userData: UserAchievementData,
  achievement: Achievement,
) => {
  unlocked: boolean
  currentTier?: AchievementTier
  progress: number
  currentValue: number
}
