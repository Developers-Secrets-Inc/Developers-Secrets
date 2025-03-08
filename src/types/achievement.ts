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

  // Image de l'accomplissement
  imageUrl: string

  // Conditions d'obtention
  condition: AchievementCondition

  // Récompenses
  reward: AchievementReward

  // Accomplissement suivant dans la série (pour les accomplissements progressifs)
  nextTierId?: string // ID de l'accomplissement de niveau supérieur

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
  tiers: Array<{
    achievement: Achievement
    order: number // Position dans la série
  }>
}

/**
 * Représente un accomplissement débloqué par un utilisateur
 */
export type UnlockedAchievement = {
  achievementId: string
  userId: string
  unlockedAt: string
  progress: number // Pourcentage de progression (0-100)

  // Pour les accomplissements progressifs
  currentTier: number // Niveau actuel dans la série
  nextTierProgress?: number // Progression vers le prochain niveau
}
