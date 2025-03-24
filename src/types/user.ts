import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser & {
  informations: UserInformations
  connectionStats?: UserConnectionStats
}

/**
 * Statistiques de connexion de l'utilisateur
 */
export type UserConnectionStats = {
  totalConnectionDays: number
  currentStreak: number
  maxStreak: number
  lastConnectionDate?: Date
}

export type UserInformations = {
  name: string
  avatar: string
  initials: string
  role: UserRole
  permissions: UserPermission[]
  preferences: UserPreferences
}

export type UserRole = 'basic' | 'pro' | 'max'

export type UserPermission = {
  name: string
  description: string
  code: string
  category: 'content' | 'users' | 'system' | 'other'
  isActive: boolean
}

export type UserPreferences = {
  notifications: {
    friends: boolean
  }
  emails: {
    marketing: boolean
    affiliates: boolean
  }
  theme: 'light' | 'dark' | 'system'
}
