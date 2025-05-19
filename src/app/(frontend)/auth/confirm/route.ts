import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Endpoint GET /auth/confirm
export async function GET(request: NextRequest) {
  // Récupération des paramètres de la query string
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Sécurisation du paramètre next : doit commencer par '/'
  const safeNext = next.startsWith('/') ? next : '/'
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = safeNext

  if (token_hash && type) {
    const supabase = await createClient()
    // Vérification du token via Supabase
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Succès : rediriger vers la page de saisie du nouveau mot de passe
      return NextResponse.redirect(redirectTo)
    }
  }
  // Échec : rediriger vers une page d'erreur dédiée
  redirectTo.pathname = '/auth/auth-code-error'
  return NextResponse.redirect(redirectTo)
}
