import { UserInformation as PayloadUserInformation } from '@/payload-types'
import { UserInformations, UserRole, UserPermission } from '@/types/user'
import { getPayload } from 'payload'
import config from '@payload-config'

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

export const createInitialUserInformation = async (
  userId: string,
  userName: string,
): Promise<void> => {
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
          name: userName,
          avatar: `https://avatar.vercel.sh/${userName}`,
          initials: userName.slice(0, 2),
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

export const setUserRole = async (userId: string, role: UserRole): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-informations',
    where: { userId: { equals: userId } },
    data: { role },
  })
}

export const upgradeToPro = async (userId: string): Promise<void> => {
  await setUserRole(userId, 'pro')
}

export const upgradeToMax = async (userId: string): Promise<void> => {
  await setUserRole(userId, 'max')
}

export const downgradeToBasic = async (userId: string): Promise<void> => {
  await setUserRole(userId, 'basic')
}

export const downgradeToPro = async (userId: string): Promise<void> => {
  await setUserRole(userId, 'pro')
}

export const hasPermission = async (userId: string, permission: string): Promise<boolean> => {
  const userInformation = await getUserInformation(userId)
  return userInformation.permissions.some((p) => p.name === permission || p.code === permission)
}

export const hasPermissions = async (userId: string, permissions: string[]): Promise<boolean> => {
  const userInformation = await getUserInformation(userId)
  return permissions.every((p) =>
    userInformation.permissions.some((p2) => p2.name === p || p2.code === p),
  )
}

export const addPermission = async (userId: string, permission: string): Promise<void> => {}

export const removePermission = async (userId: string, permission: string): Promise<void> => {}

export const addFriendsNotifications = async (userId: string): Promise<void> => {}

export const removeFriendsNotifications = async (userId: string): Promise<void> => {}

export const addMarketingEmails = async (userId: string): Promise<void> => {}

export const removeMarketingEmails = async (userId: string): Promise<void> => {}

export const addAffiliatesEmails = async (userId: string): Promise<void> => {}

export const removeAffiliatesEmails = async (userId: string): Promise<void> => {}
