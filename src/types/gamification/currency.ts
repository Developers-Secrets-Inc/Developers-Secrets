export enum TransactionType {
  EARN = 'earn',
  SPEND = 'spend',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

// Sources de transaction courantes (pour référence, mais pas utilisées comme enum dans la base de données)
export const TransactionSources = {
  DAILY_CHALLENGE: 'daily_challenge',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT: 'achievement_reward',
  ITEM_PURCHASE: 'item_purchase',
  QUEST_REWARD: 'quest_reward',
  OTHER: 'other',
} as const

export interface CurrencyTransaction {
  timestamp: Date
  type: TransactionType
  amount: number
  source: string
  details?: string
}

export interface UserCurrencyInfo {
  userId: string
  coins: number
  transactionHistory: CurrencyTransaction[]
  lastUpdated: Date
}
