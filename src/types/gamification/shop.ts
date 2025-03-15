import { Item, ItemType, UserInventory, UserInventoryItem } from './item'
import { UserGamificationInformation } from './level'

export type VirtualCurrency = {
  userId: string
  balance: number
  totalEarned: number
  totalPurchased: number
  transactions: CurrencyTransaction[]
  lastUpdated: Date
}

export enum CurrencyTransactionType {
  QUEST_REWARD = 'quest_reward',
  LEVEL_UP_REWARD = 'level_up_reward',
  ACHIEVEMENT_REWARD = 'achievement_reward',
  DAILY_LOGIN = 'daily_login',
  EVENT_REWARD = 'event_reward',
  CHEST_REWARD = 'chest_reward',
  REAL_MONEY_PURCHASE = 'real_money_purchase',
  ITEM_PURCHASE = 'item_purchase',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

export type CurrencyTransaction = {
  id: string
  userId: string
  amount: number
  type: CurrencyTransactionType
  referenceId?: string
  description: string
  timestamp: Date
}

export enum ItemAvailability {
  ALWAYS = 'always',
  LIMITED_TIME = 'limited_time',
  EVENT_ONLY = 'event_only',
  RESTRICTED = 'restricted',
  SOLD_OUT = 'sold_out',
}

export type ShopItem = {
  itemId: string
  displayName: string
  description: string
  price: number
  discount?: number
  availability: ItemAvailability
  availableFrom?: Date
  availableTo?: Date
  quantityAvailable?: number
  featured: boolean
  isNew: boolean
  isPopular: boolean
  displayOrder: number
}

export type Chest = {
  id: string
  name: string
  description: string
  imageUrl: string
  rarity: string
  possibleContent: ChestContentProbability[]
  minItems: number
  maxItems: number
  price?: number
}

export type ChestContentProbability = {
  contentType: 'item' | 'currency'
  itemId?: string
  currencyAmount?: number
  probability: number
  minQuantity: number
  maxQuantity: number
}

export type ChestReward = {
  chestId: string
  userId: string
  items: {
    itemId: string
    quantity: number
  }[]
  currency?: number
  openedAt: Date
}

export interface VirtualCurrencyService {
  getBalance(userId: string): Promise<number>
  addCurrency(
    userId: string,
    amount: number,
    type: CurrencyTransactionType,
    referenceId?: string,
    description?: string,
  ): Promise<VirtualCurrency>
  subtractCurrency(
    userId: string,
    amount: number,
    type: CurrencyTransactionType,
    referenceId?: string,
    description?: string,
  ): Promise<VirtualCurrency>
  addPurchasedCurrency(
    userId: string,
    amount: number,
    transactionId: string,
    description?: string,
  ): Promise<VirtualCurrency>
  getTransactionHistory(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<CurrencyTransaction[]>
}

export interface ShopService {
  getAvailableItems(userId: string): Promise<ShopItem[]>
  getShopItem(itemId: string): Promise<ShopItem | null>
  purchaseItem(
    userId: string,
    itemId: string,
    quantity?: number,
  ): Promise<{
    success: boolean
    inventory: UserInventory
    currency: VirtualCurrency
    error?: string
  }>
  getFeaturedItems(): Promise<ShopItem[]>
  getNewItems(): Promise<ShopItem[]>
  getPopularItems(): Promise<ShopItem[]>
}

export interface ChestService {
  getAvailableChests(userId: string): Promise<Chest[]>
  getChest(chestId: string): Promise<Chest | null>
  purchaseChest(
    userId: string,
    chestId: string,
  ): Promise<{
    success: boolean
    inventory: UserInventory
    currency: VirtualCurrency
    error?: string
  }>
  openChest(userId: string, chestId: string): Promise<ChestReward>
}

export interface GamificationEventSystem {
  registerHandler(eventType: string, handler: (userId: string, data: any) => Promise<void>): void
  triggerEvent(eventType: string, userId: string, data: any): Promise<void>
  removeHandler(eventType: string, handler: (userId: string, data: any) => Promise<void>): void
}
