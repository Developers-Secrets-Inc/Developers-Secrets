export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type QuestRewardItem = {
  id: string
  name: string
  quantity: number
  description?: string
}

export type Quest = {
  id: string
  name: string
  description: string
  difficulty: QuestDifficulty
  reward: {
    experiencePoints: number
    items?: Array<QuestRewardItem>
  }
  timeRemaining: number
}

// Catégories de quêtes
export enum QuestCategory {
  CHALLENGE_COMPLETION = 'challenge_completion', // Compléter des challenges
  EXPERIENCE_GAIN = 'experience_gain', // Gagner de l'expérience
}

// Condition de quête
export type QuestCondition = {
  category: QuestCategory
  target: number // Valeur cible à atteindre
  current?: number // Progression actuelle (optionnel)
  metadata?: Record<string, unknown> // Métadonnées spécifiques à la catégorie
}

// Quête dynamique
export type DynamicQuest = {
  id: string
  name: string
  description: string
  difficulty: QuestDifficulty
  category: QuestCategory
  condition: QuestCondition
  reward: {
    experiencePoints: number
    coins: number
    chestRarity?: ChestRarity // Rareté du coffre à obtenir
  }
  expiresAt: Date // Date d'expiration de la quête
  createdAt: Date
  completedAt?: Date // Date de complétion (si complétée)
}

// Rareté des coffres
export enum ChestRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

// Coffre de récompense
export type RewardChest = {
  id: string
  rarity: ChestRarity
  items: Array<{
    item: QuestRewardItem
    quantity: number
  }>
  coins: number
  opened: boolean
  createdAt: Date
  expiresAt?: Date // Date d'expiration (optionnel)
}

// Interface pour le service de quêtes
export interface QuestService {
  // Générer des quêtes quotidiennes pour un utilisateur
  generateDailyQuests: (userId: string) => Promise<DynamicQuest[]>

  // Vérifier la progression d'une quête
  checkQuestProgress: (questId: string, userId: string) => Promise<QuestCondition>

  // Compléter une quête
  completeQuest: (questId: string, userId: string) => Promise<RewardChest | null>

  // Ouvrir un coffre de récompense
  openChest: (
    chestId: string,
    userId: string,
  ) => Promise<{
    items: Array<{
      item: QuestRewardItem
      quantity: number
    }>
    coins: number
  }>

  // Obtenir les quêtes actives d'un utilisateur
  getUserQuests: (userId: string) => Promise<DynamicQuest[]>

  // Obtenir les coffres non ouverts d'un utilisateur
  getUserChests: (userId: string) => Promise<RewardChest[]>
}
