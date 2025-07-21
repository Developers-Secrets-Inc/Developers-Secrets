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
import { checkAndIncrementThrottle } from '@/utils/throttle'

export async function login(email: string, password: string, rememberMe: boolean) {
  // Throttling : 5 tentatives sur 10 minutes par email
  const throttleKey = `login:throttle:email:${email}`
  const { allowed, retryAfter } = await checkAndIncrementThrottle(throttleKey, 5, 600)
  if (!allowed) {
    return {
      success: false,
      error: {
        code: 'TOO_MANY_ATTEMPTS',
        message: `Too many attempts. Please try again in ${Math.ceil((retryAfter || 0) / 60)} minutes.`,
      },
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      return {
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' },
      }
    }
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_VERIFIED',
          message: 'The email for this account has not yet been verified.',
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
        error: { code: 'EMAIL_IN_USE', message: 'This email is already in use.' },
      }
    }
    if (authError.message.toLowerCase().includes('password')) {
      return {
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'The password is invalid or too weak.',
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
      error: { code: 'USER_NOT_FOUND', message: 'User not found after signup.' },
    }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/onboarding?step=1')
}

export async function loginWithGoogle(redirectTo?: string) {
  const supabase = await createClient()
  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  })
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, url: data.url }
}

export async function loginWithGitHub(redirectTo?: string) {
  const supabase = await createClient()
  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: callbackUrl,
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
