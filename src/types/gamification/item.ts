export enum ItemType {
  EXPERIENCE_BOOST = 'experience_boost',
  STREAK_SAVER = 'streak_saver',
  STREAK_RECOVERY = 'streak_recovery',
  SOLUTION_VIEWER = 'solution_viewer',
  CHEST = 'chest',
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export type Item = {
  id: string
  name: string
  description: string
  type: ItemType
  rarity: ItemRarity
  imageUrl?: string
  isConsumable: boolean
  isTradable: boolean
  basePrice: number
}

export enum ItemAcquisitionSource {
  SHOP_PURCHASE = 'shop_purchase',
  QUEST_REWARD = 'quest_reward',
  ACHIEVEMENT_REWARD = 'achievement_reward',
  LEVEL_UP_REWARD = 'level_up_reward',
  ADMIN_GIFT = 'admin_gift',
  DAILY_REWARD = 'daily_reward',
  EVENT_REWARD = 'event_reward',
}

export type UserInventory = {
  userId: string
  items: {
    [itemId: string]: number // itemId -> quantity
  }
  lastUpdated: Date
}

// Exemple d'utilisation:
/*
const userInventory = {
  userId: '123',
  items: {
    'experience-boost-1': 2,
    'streak-saver-1': 1,
    'streak-recovery-1': 1,
    'solution-viewer-1': 1,
  },
  lastUpdated: new Date()
}
*/
