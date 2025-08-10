'use server'

import 'server-only'

import { AuthError } from '@supabase/supabase-js'
import { UserNotFoundError } from './errors'
import { Result, failure, success, flatMapAsync, mapAsync } from '@/lib/result'
import { User as SupabaseUser } from '@supabase/supabase-js'

import { User } from './types'
import { getAllUserInformations } from './informations'
import { UserInformationsNotFoundError } from './errors'
import { createClient } from '@/utils/supabase/server'
import { mergeUserInformations } from './utils'

const checkSupabaseUser = async (
  data: { user: SupabaseUser | null },
  error: AuthError | null,
): Promise<Result<SupabaseUser, AuthError | UserNotFoundError>> => {
  if (error) {
    return failure(error)
  }

  if (!data.user) {
    return failure(new UserNotFoundError('Supabase user not found.'))
  }

  return success(data.user)
}


const getSupabaseSessionUser = async (): Promise<
  Result<SupabaseUser, AuthError | UserNotFoundError>
> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  return await checkSupabaseUser(data, error)
}


const getSupabaseUserById = async (
  userId: string,
): Promise<Result<SupabaseUser, AuthError | UserNotFoundError>> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.admin.getUserById(userId)
  return await checkSupabaseUser(data, error)
}


const getMergedUser = async <E>(
  supabaseUserResult: Result<SupabaseUser, E>,
): Promise<Result<User, E | UserInformationsNotFoundError>> => {
  return await flatMapAsync(supabaseUserResult, async (supabaseUser) =>
    mapAsync(await getAllUserInformations(supabaseUser.id), async (userInformations) =>
      mergeUserInformations(supabaseUser, userInformations),
    ),
  )
}


export const getUser = async (): Promise<
  Result<User, UserNotFoundError | AuthError | UserInformationsNotFoundError>
> => {
  return await getMergedUser(await getSupabaseSessionUser())
}


export const getUserById = async (
  userId: string,
): Promise<Result<User, UserNotFoundError | AuthError | UserInformationsNotFoundError>> => {
  return await getMergedUser(await getSupabaseUserById(userId))
}
