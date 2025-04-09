'use server'

import { UserCreationError } from './errors'
import { Email, Password } from './types'
import { createInitialUserInformation, getUserInformation } from '.'
import { createClient } from '@/utils/supabase/server'
import { User } from '@/types/user'
import { User as SupabaseUser } from '@supabase/supabase-js'

export const createSupabaseUser = async (
  email: Email,
  password: Password,
): Promise<{
  user: SupabaseUser | null
  error: UserCreationError | null
}> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { user: null, error: new UserCreationError(error.message) }
  }

  if (!data.user) {
    return { user: null, error: new UserCreationError('User not found') }
  }

  return { user: data.user, error: null }
}

/**
 * Creates a new Supabase user and initializes their user information.
 *
 * @param {Email} email - The email address of the user to be created.
 * @param {Password} password - The password for the new user.
 * @returns {Promise<{ user: User | null, error: UserCreationError | null }>} 
 * An object containing the created user or an error if the creation failed.
 */
export const createUser = async (
  email: Email,
  password: Password,
): Promise<{
  user: User | null
  error: UserCreationError | null
}> => {
  const { user, error } = await createSupabaseUser(email, password)

  const IS_SUPABASE_USER_CREATED = !error && user

  if (IS_SUPABASE_USER_CREATED) {
    await createInitialUserInformation(user.id)
    const userInformations = await getUserInformation(user.id)
    return { user: { ...user, informations: userInformations }, error: null }
  }

  return { user: null, error }
}


export const logoutSessionUser = async () => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}


export const changeUserEmail = async (newEmail: Email) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ email: newEmail })
  if (error) {
    throw new Error(error.message)
  }
}

export const changeUserPassword = async (newPassword: Password) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) {
    throw new Error(error.message)
  }
}
