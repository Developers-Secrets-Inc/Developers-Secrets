export type User = {
  id: string
  email: string
  // Statistiques de connexion
  connectionStats?: UserConnectionStats
  // Autres champs qui pourraient être ajoutés dans le futur
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
