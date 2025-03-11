import { User } from './user'

// Type de base pour tous les items
export type GamificationItem = {
  id: string
  name: string
  description: string
  type: ItemType
  // Métadonnées spécifiques au type d'item
  metadata?: Record<string, unknown>
}

// Information de shop pour un item
export type ShopItemInfo = {
  itemId: string
  price: number
  discount?: number // Pourcentage de réduction (optionnel)
  available: boolean // Si l'item est disponible à l'achat
  featured?: boolean // Si l'item est mis en avant
  dailyOffer?: boolean // Si c'est une offre quotidienne
  rareOffer?: boolean // Si c'est une offre rare
  offerExpiresAt?: Date // Date d'expiration de l'offre
  limitedQuantity?: number // Quantité limitée disponible
}

// Types d'items possibles
export enum ItemType {
  CONSUMABLE = 'consumable', // Item consommable avec boost temporaire
  SPECIAL = 'special', // Item spécial avec comportement personnalisé
}

// Types d'effets possibles
export enum EffectType {
  EXPERIENCE_MULTIPLIER = 'experience_multiplier',
  COINS_MULTIPLIER = 'coins_multiplier',
  LEVEL_UP_BOOST = 'level_up_boost',
  SPECIAL_EFFECT = 'special_effect',
}

// Types d'items spéciaux
export enum SpecialItemType {
  STREAK_SAVER = 'streak_saver', // Permet de ne pas casser son streak
  STREAK_RECOVERY = 'streak_recovery', // Permet de récupérer son streak
  SOLUTION_VIEWER = 'solution_viewer', // Permet de voir la solution sans perdre d'XP
}

// Métadonnées pour les items consommables (boost)
export type ConsumableMetadata = {
  // Durée du boost en millisecondes
  duration: number
  // Type d'effet (exp, coins, etc.)
  effectType: EffectType
  // Valeur de l'effet (pourcentage ou valeur absolue)
  effectValue: number
}

// Métadonnées pour les items spéciaux
export type SpecialItemMetadata = {
  // Type d'item spécial
  specialType: SpecialItemType
  // Valeur associée (ex: nombre de jours pour streak_saver)
  value?: number
}

// Interface pour les handlers d'items
export interface ItemHandler {
  // Méthode appelée quand un item est acheté
  onPurchase: (item: GamificationItem, user: UserGamification) => Promise<void>
  // Méthode appelée quand un item est utilisé (si applicable)
  onUse?: (item: GamificationItem, user: UserGamification) => Promise<void>
  // Méthode appelée quand un item est obtenu (par quête, récompense, etc.)
  onAcquire?: (
    item: GamificationItem,
    user: UserGamification,
    source: AcquisitionSource,
  ) => Promise<void>
}

// Sources d'acquisition d'items
export enum AcquisitionSource {
  SHOP_PURCHASE = 'shop_purchase',
  QUEST_REWARD = 'quest_reward',
  ACHIEVEMENT = 'achievement',
  GIFT = 'gift',
  EVENT = 'event',
  ADMIN = 'admin',
}

type quantity = number

export type UserInventory = {
  [itemId: string]: quantity
}

export type ActiveEffect = {
  expiresAt: Date
  effectType: EffectType
  effectValue: number
  metadata?: Record<string, unknown>
}

export type UserGamification = {
  user: User
  level: number
  experience: number
  coins: number
  inventory: UserInventory
  // Effets actifs (boosters, etc.)
  activeEffects?: {
    [effectId: string]: ActiveEffect
  }
  // Quêtes et coffres
  quests?: {
    active: string[] // IDs des quêtes actives
    completed: string[] // IDs des quêtes complétées
    history: Array<{
      questId: string
      completedAt: Date
      reward: {
        experiencePoints: number
        coins: number
        chestId?: string
      }
    }>
  }
  chests?: {
    unopened: string[] // IDs des coffres non ouverts
    opened: string[] // IDs des coffres ouverts
  }
  // Statistiques de streak
  streak?: {
    current: number
    max: number
    lastLoginDate: Date
    savedDays: number // Jours sauvegardés par des items
  }
}

// Shop avec système de registre pour les handlers
export interface ShopSystem {
  // Enregistrer un handler pour un type d'item spécifique
  registerHandler: (type: ItemType, handler: ItemHandler) => void
  // Acheter un item
  purchaseItem: (itemId: string, user: UserGamification) => Promise<boolean>
  // Utiliser un item de l'inventaire
  useItem: (itemId: string, user: UserGamification) => Promise<boolean>
  // Obtenir les informations de shop pour un item
  getShopInfo: (itemId: string) => Promise<ShopItemInfo | null>
  // Ajouter un item à l'inventaire (quelle que soit la source)
  addItemToInventory: (
    itemId: string,
    quantity: number,
    user: UserGamification,
    source: AcquisitionSource,
  ) => Promise<boolean>
}

// Service de gestion des boosts
export interface BoostService {
  // Ajouter un boost à l'utilisateur
  addBoost(
    user: UserGamification,
    effectType: EffectType,
    effectValue: number,
    durationMs: number,
  ): Promise<string>

  // Vérifier si un boost est actif
  hasActiveBoost(user: UserGamification, effectType: EffectType): boolean

  // Appliquer les boosts à une valeur (exp, coins, etc.)
  applyBoosts(user: UserGamification, baseValue: number, effectType: EffectType): number

  // Nettoyer les boosts expirés
  cleanupExpiredBoosts(user: UserGamification): Promise<void>

  // Obtenir tous les boosts actifs
  getActiveBoosts(user: UserGamification): ActiveEffect[]
}
