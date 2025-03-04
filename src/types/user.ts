import type { CollectionConfig } from 'payload'

/**
 * Type représentant un utilisateur du système
 * Basé sur la collection Users de Payload CMS
 */
export type User = {
  id: string
  email: string
  // Autres champs qui pourraient être ajoutés dans le futur
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
