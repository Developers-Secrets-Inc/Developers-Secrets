'use server'

import { UserCreationError } from './errors'
import { Email, Password } from './types'
import { createInitialUserInformation, getUserInformation } from '.'
import { createClient } from '@/utils/supabase/server'
import { User } from '@/types/user'


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
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { user: null, error: new UserCreationError(error.message) }
  }

  if (!data.user) {
    return { user: null, error: new UserCreationError('User not found') }
  }

  await createInitialUserInformation(data.user.id)
  const userInformations = await getUserInformation(data.user.id)

  return { user: { ...data.user, informations: userInformations }, error: null }
}


export const logoutSessionUser = async () => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}
