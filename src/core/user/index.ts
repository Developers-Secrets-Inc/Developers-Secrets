'use server'

import 'server-only'

import { UserInformation as PayloadUserInformation } from '@/payload-types'
import {
  User,
  UserConnectionStats,
  UserInformations,
  UserPermission,
  UserPreferences,
  UserRole,
} from '@/types/user'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createClient } from '@/utils/supabase/server'
import { User as SupabaseUser } from '@supabase/supabase-js'

const convertPayloadUserInformationToUserInformations = (
  payloadUserInformation: PayloadUserInformation,
): UserInformations => {
  // Convertir les permissions de Payload en UserPermission[]
  const permissions: UserPermission[] = Array.isArray(payloadUserInformation.permissions)
    ? payloadUserInformation.permissions
        .filter((p) => typeof p === 'object' && p !== null)
        .map((p) => ({
          name: p.name || '',
          description: p.description || '',
          code: p.code || '',
          category: (p.category as 'content' | 'users' | 'system' | 'other') || 'other',
          isActive: p.isActive || false,
        }))
    : []

  // S'assurer que les préférences existent
  const preferences = {
    notifications: {
      friends: payloadUserInformation.preferences?.notifications?.friends || false,
    },
    emails: {
      marketing: payloadUserInformation.preferences?.emails?.marketing || false,
      affiliates: payloadUserInformation.preferences?.emails?.affiliates || false,
    },
    theme: (payloadUserInformation.preferences?.theme as 'light' | 'dark' | 'system') || 'system',
  }

  return {
    role: payloadUserInformation.role as UserRole,
    permissions,
    preferences,
  }
}

export const createInitialUserInformation = async (userId: string): Promise<void> => {
  const payload = await getPayload({ config })

  try {
    try {
      await getUserInformation(userId)
    } catch (_error) {
      await payload.create({
        collection: 'user-informations',
        data: {
          userId,
          role: 'basic', // Rôle par défaut
          preferences: {
            notifications: {
              friends: true,
            },
            emails: {
              marketing: true,
              affiliates: true,
            },
            theme: 'system',
          },
          // Les permissions seront ajoutées séparément
        },
      })
    }

    // Créer les informations initiales de l'utilisateur

    console.log(`Created initial user information for user ${userId}`)
  } catch (error) {
    console.error('Error creating initial user information:', error)
    throw new Error(
      `Failed to create initial user information: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

// ================================================
// User Connection Stats
// ================================================

export const getUserConnectionStats = async (userId: string): Promise<UserConnectionStats> => {
  return {} as UserConnectionStats
}

export const incrementConnectionDays = async (userId: string): Promise<void> => {}

export const incrementCurrentStreak = async (userId: string): Promise<void> => {}

export const resetCurrentStreak = async (userId: string): Promise<void> => {}

export const setMaxStreak = async (userId: string, maxStreak: number): Promise<void> => {}

export const setLastConnectionDate = async (
  userId: string,
  lastConnectionDate: Date,
): Promise<void> => {}

// ================================================
// User Role
// ================================================

export const getUserRole = async (userId: string): Promise<UserRole> => {
  const payload = await getPayload({ config })

  const user = await payload.find({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
  })

  if (!user.docs || user.docs.length === 0) {
    throw new Error(`User information not found for user ${userId}`)
  }

  return user.docs[0].role
}

export const setUserRole = async (userId: string, role: UserRole): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
    data: { role },
  })
}

export const upgradeToPro = async (userId: string): Promise<void> => {
  return await setUserRole(userId, 'pro')
}

export const upgradeToMax = async (userId: string): Promise<void> => {
  return await setUserRole(userId, 'max')
}

export const downgradeToBasic = async (userId: string): Promise<void> => {
  return await setUserRole(userId, 'basic')
}

export const downgradeToPro = async (userId: string): Promise<void> => {
  return await setUserRole(userId, 'pro')
}

// ================================================
// User Preferences
// ================================================

export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  const user = await getUserInformation(userId)

  return user.preferences
}

export const disableNotification = async (
  userId: string,
  notificationType: 'friends',
): Promise<void> => {
  const payload = await getPayload({ config })

  const updateData: {
    preferences: {
      notifications: Record<string, boolean>
    }
  } = {
    preferences: {
      notifications: {},
    },
  }
  updateData.preferences.notifications[notificationType] = false

  await payload.update({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
    data: updateData,
  })
}

export const enableNofication = async (
  userId: string,
  notificationType: 'friends',
): Promise<void> => {
  const payload = await getPayload({ config })

  const updateData: {
    preferences: {
      notifications: Record<string, boolean>
    }
  } = {
    preferences: {
      notifications: {},
    },
  }
  updateData.preferences.notifications[notificationType] = true

  await payload.update({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
    data: updateData,
  })
}

export const disableEmail = async (
  userId: string,
  emailType: 'marketing' | 'affiliates',
): Promise<void> => {
  const payload = await getPayload({ config })

  const updateData: {
    preferences: {
      emails: Record<string, boolean>
    }
  } = {
    preferences: {
      emails: {},
    },
  }
  updateData.preferences.emails[emailType] = false

  await payload.update({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
    data: updateData,
  })
}

export const enableEmail = async (
  userId: string,
  emailType: 'marketing' | 'affiliates',
): Promise<void> => {
  const payload = await getPayload({ config })

  const updateData: {
    preferences: {
      emails: Record<string, boolean>
    }
  } = {
    preferences: {
      emails: {},
    },
  }
  updateData.preferences.emails[emailType] = true

  await payload.update({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
    data: updateData,
  })
}

export const getTheme = async (userId: string): Promise<'light' | 'dark' | 'system'> => {
  const user = await getUserInformation(userId)

  return user.preferences.theme
}

export const getUserInformation = async (userId: string): Promise<UserInformations> => {
  const payload = await getPayload({ config })

  const userInformation = await payload.find({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
  })

  if (!userInformation.docs || userInformation.docs.length === 0) {
    throw new Error(`User information not found for user ${userId}`)
  }

  return convertPayloadUserInformationToUserInformations(userInformation.docs[0])
}

const getSupabaseUser = async (): Promise<SupabaseUser> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}




export const getUser = async (): Promise<User> => {
  const supabaseUser = await getSupabaseUser()

  const user = await getUserInformation(supabaseUser.id)

  return {
    ...supabaseUser,
    informations: user,
  }
}

export const getUserById = async (userId: string): Promise<User> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.admin.getUserById(userId)

  if (error) {
    throw new Error(error.message)
  }

  const user = await getUserInformation(data.user.id)

  return {
    ...data.user,
    informations: user,
  }
}
