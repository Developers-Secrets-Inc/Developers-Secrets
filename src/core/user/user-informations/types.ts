import { z } from 'zod'

const UserInformationsFieldsSchema = z.enum(['name', 'avatar', 'initials', 'role', 'preferences'])
export type UserInformationsFields = z.infer<typeof UserInformationsFieldsSchema>

const UserInformationIdSchema = z.number().int().positive()
export type UserInformationId = z.infer<typeof UserInformationIdSchema>

const UserIdSchema = z.string().uuid()
export type UserId = z.infer<typeof UserIdSchema>

const UserNameSchema = z.string().min(1).max(50).nullable().optional()
export type UserName = z.infer<typeof UserNameSchema>

const UserAvatarSchema = z.string().url().nullable().optional()
export type UserAvatar = z.infer<typeof UserAvatarSchema>

const UserInitialsSchema = z.string().min(1).max(3).nullable().optional()
export type UserInitials = z.infer<typeof UserInitialsSchema>

const UserRoleSchema = z.enum(['basic', 'pro', 'max'])
export type UserRole = z.infer<typeof UserRoleSchema>

// TODO: Add permissions schema

const UserNotificationsSchema = z.object({
  friends: z.boolean().nullable().optional(),
}).optional()
export type UserNotifications = z.infer<typeof UserNotificationsSchema>

const UserEmailPreferencesSchema = z.object({
  marketing: z.boolean().nullable().optional(),
  affiliates: z.boolean().nullable().optional(),
}).optional()
export type UserEmailPreferences = z.infer<typeof UserEmailPreferencesSchema>

const UserThemeSchema = z.enum(['light', 'dark', 'system']).nullable().optional()
export type UserTheme = z.infer<typeof UserThemeSchema>

const UserPreferencesSchema = z.object({
  notifications: UserNotificationsSchema,
  emails: UserEmailPreferencesSchema,
  theme: UserThemeSchema,
}).optional()
export type UserPreferences = z.infer<typeof UserPreferencesSchema>


// TODO: Add language schema


export const UserInformationsSchema = z.object({
  id: UserInformationIdSchema,
  userId: UserIdSchema,
  name: UserNameSchema,
  avatar: UserAvatarSchema,
  initials: UserInitialsSchema,
  role: UserRoleSchema,
  preferences: UserPreferencesSchema,
})
export type UserInformations = z.infer<typeof UserInformationsSchema>

export const validateUserInformationField = (field: string): UserInformationsFields => {
  const result = UserInformationsFieldsSchema.safeParse(field)
  if (!result.success) {
    throw new Error('Invalid user information field')
  }
  return result.data
}

export const validateUserInformationId = (id: number): UserInformationId => {
  const result = UserInformationIdSchema.safeParse(id)
  if (!result.success) {
    throw new Error('Invalid user information ID')
  }
  return result.data
}

export const validateUserId = (userId: string): UserId => {
  const result = UserIdSchema.safeParse(userId)
  if (!result.success) {
    throw new Error('Invalid user ID')
  }
  return result.data
}

export const validateUserName = (name: string | null | undefined): UserName => {
  const result = UserNameSchema.safeParse(name)
  if (!result.success) {
    throw new Error('Invalid user name')
  }
  return result.data
}

export const validateUserAvatar = (avatar: string | null | undefined): UserAvatar => {
  const result = UserAvatarSchema.safeParse(avatar)
  if (!result.success) {
    throw new Error('Invalid user avatar')
  }
  return result.data
}

export const validateUserInitials = (initials: string | null | undefined): UserInitials => {
  const result = UserInitialsSchema.safeParse(initials)
  if (!result.success) {
    throw new Error('Invalid user initials')
  }
  return result.data
}

export const validateUserRole = (role: string): UserRole => {
  const result = UserRoleSchema.safeParse(role)
  if (!result.success) {
    throw new Error('Invalid user role')
  }
  return result.data
}

export const validateUserPreferences = (preferences: UserPreferences): UserPreferences => {
  const result = UserPreferencesSchema.safeParse(preferences)
  if (!result.success) {
    throw new Error('Invalid user preferences')
  }
  return result.data
}


export const validateUserEmailPreferences = (preferences: UserEmailPreferences): UserEmailPreferences => {
  const result = UserEmailPreferencesSchema.safeParse(preferences)
  if (!result.success) {
    throw new Error('Invalid user email preferences')
  }
  return result.data
}

export const validateUserTheme = (theme: string): UserTheme => {
  const result = UserThemeSchema.safeParse(theme)
  if (!result.success) {
    throw new Error('Invalid user theme')
  }
  return result.data
}   

export const validateUserInformations = (informations: UserInformations): UserInformations => {
  const result = UserInformationsSchema.safeParse(informations)
  if (!result.success) {
    throw new Error('Invalid user informations')
  }
  return result.data
}


