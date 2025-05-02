'use server'

import { createClient } from '@/utils/supabase/server'
import type { AuthError, Session, User } from '@supabase/supabase-js'

/**
 * Server-side helper to get basic authentication details.
 * Inspired by Clerk's auth().
 *
 * @returns An object containing the user ID, session, and any potential auth error.
 */
export const auth = async (): Promise<{
  userId: string | null
  session: Session | null
  user: User | null
  error: AuthError | null
}> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Auth Error:', error)
      return { userId: null, session: null, user: null, error }
    }

    const { data: sessionData } = await supabase.auth.getSession()

    return {
      userId: data?.user?.id ?? null,
      session: sessionData.session,
      user: data?.user ?? null,
      error: null,
    }
  } catch (e) {
    // Handle unexpected errors during client creation or auth calls
    console.error('Unexpected error in auth():', e)
    // Simulate an AuthError structure for consistency, if possible
    const error = new Error('Unexpected server error during authentication.') as AuthError
    error.name = 'UnexpectedAuthError'
    return { userId: null, session: null, user: null, error: error }
  }
}
