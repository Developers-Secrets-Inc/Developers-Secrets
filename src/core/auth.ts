'use server'

import 'server-only'
import { createClient } from '@/utils/supabase/server'

interface UserSession {
  userId: string
  email?: string
}

export async function getUserSession(): Promise<UserSession | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return null
    }

    return {
      userId: data.user.id,
      email: data.user.email,
    }
  } catch (error) {
    console.error('Error getting user session:', error)
    return null
  }
}
