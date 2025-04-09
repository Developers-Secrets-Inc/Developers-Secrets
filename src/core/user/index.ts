'use server'

import 'server-only'

import { UserInformation as PayloadUserInformation } from '@/payload-types'
import {
  User,
  UserInformations,
  UserPermission,
  UserRole
} from '@/types/user'
import { createClient } from '@/utils/supabase/server'
import config from '@payload-config'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { getPayload } from 'payload'
import { SupabaseUserNotFoundError, UserInformationsNotFoundError, UserNotFoundError } from './errors'
import { isError, Result } from './result'
import { UserId, validateUserId } from './types'

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
    name: payloadUserInformation.name || '',
    avatar: payloadUserInformation.avatar || '',
    initials: payloadUserInformation.initials || '',
    role: payloadUserInformation.role as UserRole,
    permissions,
    preferences,
    customerId: payloadUserInformation.customerId || '',
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

const getSupabaseUser = async (): Promise<SupabaseUser | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (!data.user || error) {
    return null
  }

  return data.user
}




export const getUser = async (): Promise<User | null> => {
  const supabaseUser = await getSupabaseUser()

  if (!supabaseUser) {
    return null
  }

  const user = await getUserInformation(supabaseUser.id)

  return {
    ...supabaseUser,
    informations: user,
  }
}

export const getUserById = async (userId: UserId): Promise<Result<User, UserNotFoundError>> => {
  const validatedUserId = validateUserId(userId)
  const supabase = await createClient()

  const { data, error } = await supabase.auth.admin.getUserById(userId)

  if (error) {
    return { success: false, error: new UserNotFoundError(userId) }
  }

  const user = await getUserInformation(data.user.id)

  return { success: true, value: { ...data.user, informations: user } }
}






const getSessionUserInformations = async (
  supabaseUser: SupabaseUser,
): Promise<Result<UserInformations, UserInformationsNotFoundError>> => {
  const userInformations = await getUserInformation(supabaseUser.id)
  return { success: true, value: userInformations }
}


const getSupabaseSessionUser = async (): Promise<Result<SupabaseUser, SupabaseUserNotFoundError>> => {
  try {
    const supabaseClient = await createClient()
    const { data, error } = await supabaseClient.auth.getUser()

    if (error) {
      throw new SupabaseUserNotFoundError()
    }

    return { success: true, value: data.user }
  } catch (error) {
    if (error instanceof SupabaseUserNotFoundError) {
      return { success: false, error: error }
    }
    throw error
  }
}

export const getSessionUser = async (): Promise<Result<User, UserNotFoundError>> => {
  const supabaseSessionUser = await getSupabaseSessionUser()

  if (isError(supabaseSessionUser)) {
    return { success: false, error: new UserNotFoundError(supabaseSessionUser.error.message) }
  }

  const userInformations = await getSessionUserInformations(supabaseSessionUser.value)


  if (isError(userInformations)) {
    return { success: false, error: new UserNotFoundError(userInformations.error.message) }
  }

  return { success: true, value: { ...supabaseSessionUser.value, informations: userInformations.value } }
}



const getAllSupabaseUsers = async (): Promise<Result<SupabaseUser[], SupabaseUserNotFoundError>> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    return { success: false, error: new Error(error.message) }
  }

  return { success: true, value: data.users }
}

const getSupabaseUserByEmail = async (email: string): Promise<Result<SupabaseUser, SupabaseUserNotFoundError>> => {
  const allSupabaseUsers = await getAllSupabaseUsers()

  if (isError(allSupabaseUsers)) {
    return { success: false, error: new SupabaseUserNotFoundError() }
  }

  const user = allSupabaseUsers.value.find((user) => user.email === email)

  if (!user) {
    return { success: false, error: new SupabaseUserNotFoundError() }
  }

  return { success: true, value: user }
}

export const getUserByEmail = async (email: string): Promise<Result<User, UserNotFoundError>> => {
  const supabaseUser = await getSupabaseUserByEmail(email)

  if (isError(supabaseUser)) {
    return { success: false, error: new UserNotFoundError(supabaseUser.error.message) }
  }

  const userInformations = await getUserInformation(supabaseUser.value.id)

  return { success: true, value: { ...supabaseUser.value, informations: userInformations } }
}




// ============= 






