'use server'

import { UserId, UserInformations, UserInformationsFields, validateUserInformationField, validateUserId, validateUserInformations, validateUserInitials, validateUserName, validateUserAvatar, validateUserRole, UserPreferences, validateUserPreferences, UserName, UserAvatar, UserInitials, validateUserCustomerId, UserCustomerId } from './types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { UserNotFoundError } from './errors'

export const getUserInformations = async (userId: string): Promise<UserInformations> => {
  const payload = await getPayload({ config })

  const user = await payload.findByID({
    collection: 'user-informations',
    id: userId,
  })

  if (!user) {
    throw new UserNotFoundError(userId)
  }

  const validatedUser = validateUserInformations(user)
  return validatedUser
}


export const updateUserInformations = async <T extends UserInformationsFields>(userId: UserId, key: T, value: UserInformations[T]): Promise<void> => {
  const validatedKey = validateUserInformationField(key)
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-informations',
    id: userId,
    data: {
      [validatedKey]: value,
    },
  })
}

export const updateUserName = async (userId: UserId, name: UserName): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedName = validateUserName(name)

  await updateUserInformations(validatedUserId, 'name', validatedName)
}

export const updateUserAvatar = async (userId: UserId, avatar: UserAvatar): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedAvatar = validateUserAvatar(avatar)

  await updateUserInformations(validatedUserId, 'avatar', validatedAvatar)
}

export const updateUserInitials = async (userId: UserId, initials: UserInitials): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedInitials = validateUserInitials(initials)

  await updateUserInformations(validatedUserId, 'initials', validatedInitials)
}

type UserRole = 'basic' | 'lite' | 'pro' | 'max'
export const updateUserRole = async (userId: UserId, role: UserRole): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedRole = validateUserRole(role)

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-informations',
    where: {
      userId: {
        equals: validatedUserId,
      },
    },
    data: { role: validatedRole },
  })
}


export const updateUserPreferences = async (userId: UserId, preferences: UserPreferences): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedPreferences = validateUserPreferences(preferences)

  await updateUserInformations(validatedUserId, 'preferences', validatedPreferences)
}

export const updateUserCustomerId = async (userId: UserId, customerId: UserCustomerId): Promise<void> => {
  const validatedUserId = validateUserId(userId)
  const validatedCustomerId = validateUserCustomerId(customerId)

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-informations',
    where: {
      userId: {
        equals: validatedUserId,
      },
    },
    data: { customerId: validatedCustomerId },
  })
}

