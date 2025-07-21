import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createInitialUserInformation, getUserInformation } from '@/core/user'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectParam = requestUrl.searchParams.get('redirect')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    // Synchronisation profil après OAuth
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      try {
        await getUserInformation(user.id)
      } catch {
        await createInitialUserInformation(user.id, user.user_metadata?.username || user.email)
      }
    }
  }

  return NextResponse.redirect(
    new URL(redirectParam && redirectParam.startsWith('/') ? redirectParam : '/home', request.url),
  )
}
