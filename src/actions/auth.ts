'use server'

import { initializeUser } from '@/core/gamification/level'
import { createInitialUserInformation } from '@/core/user'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  EmailInUseError,
  InvalidPasswordError,
  InvalidCredentialsError,
  UserNotVerifiedError,
} from '@/core/user/errors'

export async function login(email: string, password: string, rememberMe: boolean) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      return {
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email ou mot de passe incorrect.' },
      }
    }
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_VERIFIED',
          message: "L'email de ce compte n'a pas encore été vérifié.",
        },
      }
    }
    return { success: false, error: { code: 'LOGIN_ERROR', message: error.message } }
  }

  if (rememberMe) {
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
    if (authError.message.toLowerCase().includes('user already registered')) {
      return {
        success: false,
        error: { code: 'EMAIL_IN_USE', message: 'Cet email est déjà utilisé.' },
      }
    }
    if (authError.message.toLowerCase().includes('password')) {
      return {
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Le mot de passe est invalide ou trop faible.',
        },
      }
    }
    return { success: false, error: { code: 'SIGNUP_ERROR', message: authError.message } }
  }

  if (authData.user?.id) {
    await createInitialUserInformation(authData.user.id, username)
    await initializeUser(authData.user.id)
  } else {
    return {
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'Utilisateur non trouvé après inscription.' },
    }
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
