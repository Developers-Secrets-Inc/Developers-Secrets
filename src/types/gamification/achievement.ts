export enum AchievementType {
  LEVEL = 'level',
  EXERCISES_COMPLETED = 'exercises_completed',
  STREAK = 'streak',
  TUTORIALS_COMPLETED = 'tutorials_completed',
  QUESTS_COMPLETED = 'quests_completed',
  ITEMS_USED = 'items_used',
  COINS_EARNED = 'coins_earned',
}

export enum AchievementTier {
  NONE = 'none',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  DIAMOND = 'diamond',
  PLATINUM = 'platinum',
}

export interface AchievementTierInfo {
  name: AchievementTier
  description: string
  threshold: number
  rewardCoins: number
  rewardXp: number
}

export interface Achievement {
  id: string
  title: string
  type: AchievementType
  icon?: string
  maxTier: number
  tiers: AchievementTierInfo[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UnlockedTier {
  tier: AchievementTier
  unlockedAt: Date
  rewardClaimed: boolean
}

export interface UserAchievementProgress {
  achievementId: string | Achievement
  currentValue: number
  currentTier: AchievementTier
  unlockedTiers: UnlockedTier[]
  lastUpdated: Date
}

export interface UserAchievements {
  userId: string
  achievements: UserAchievementProgress[]
  totalAchievements: number
  lastUpdated: Date
}

// Fonctions utilitaires pour les accomplissements
export function getTierByValue(achievement: Achievement, value: number): AchievementTier {
  if (!achievement.tiers || achievement.tiers.length === 0) {
    return AchievementTier.NONE
  }

  // Trier les niveaux par seuil croissant
  const sortedTiers = [...achievement.tiers].sort((a, b) => a.threshold - b.threshold)

  // Trouver le niveau le plus élevé que la valeur actuelle dépasse
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (value >= sortedTiers[i].threshold) {
      return sortedTiers[i].name
    }
  }

  return AchievementTier.NONE
}

export function getNextTier(
  achievement: Achievement,
  currentTier: AchievementTier,
): AchievementTierInfo | null {
  if (!achievement.tiers || achievement.tiers.length === 0) {
    return null
  }

  // Trier les niveaux par seuil croissant
  const sortedTiers = [...achievement.tiers].sort((a, b) => a.threshold - b.threshold)

  // Si pas de niveau actuel, retourner le premier niveau
  if (currentTier === AchievementTier.NONE && sortedTiers.length > 0) {
    return sortedTiers[0]
  }

  // Trouver l'index du niveau actuel
  const currentIndex = sortedTiers.findIndex((tier) => tier.name === currentTier)

  // Si le niveau actuel est le dernier ou n'a pas été trouvé, retourner null
  if (currentIndex === -1 || currentIndex === sortedTiers.length - 1) {
    return null
  }

  // Retourner le niveau suivant
  return sortedTiers[currentIndex + 1]
}

export function getProgressPercentage(
  achievement: Achievement,
  currentValue: number,
  currentTier: AchievementTier,
): number {
  if (!achievement.tiers || achievement.tiers.length === 0) {
    return 0
  }

  // Trier les niveaux par seuil croissant
  const sortedTiers = [...achievement.tiers].sort((a, b) => a.threshold - b.threshold)

  // Si pas de niveau actuel, calculer le pourcentage par rapport au premier niveau
  if (currentTier === AchievementTier.NONE && sortedTiers.length > 0) {
    return Math.min(100, Math.floor((currentValue / sortedTiers[0].threshold) * 100))
  }

  // Trouver l'index du niveau actuel
  const currentIndex = sortedTiers.findIndex((tier) => tier.name === currentTier)

  // Si le niveau actuel est le dernier ou n'a pas été trouvé, retourner 100%
  if (currentIndex === -1 || currentIndex === sortedTiers.length - 1) {
    return 100
  }

  // Calculer le pourcentage entre le niveau actuel et le niveau suivant
  const currentThreshold = sortedTiers[currentIndex].threshold
  const nextThreshold = sortedTiers[currentIndex + 1].threshold
  const range = nextThreshold - currentThreshold
  const progress = currentValue - currentThreshold

  return Math.min(100, Math.floor((progress / range) * 100))
}
