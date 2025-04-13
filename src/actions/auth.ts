'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { createInitialUserInformation } from '@/core/users'
import { initializeUser } from '@/core/gamification/level'

export async function login(email: string, password: string, rememberMe: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Set session cookie expiration based on rememberMe
  if (rememberMe) {
    // Set a longer expiration time (e.g., 30 days)
    // This would typically be handled by the Supabase Auth configuration
    // or by setting a custom cookie with the desired expiration
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

export async function signup(username: string, email: string, password: string) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  if (authData.user?.id) {
    await createInitialUserInformation(authData.user.id, username)
    await initializeUser(authData.user.id)
  } else {
    return { success: false, error: 'User not found' }
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, url: data.url }
}

export async function loginWithGitHub() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, url: data.url }
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function getSession() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, session: data.session }
}
