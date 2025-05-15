import { login } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { LoginPageClient } from '../components/LoginPageClient'

// Warn if Redis env vars are missing (for local/dev debug)
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set. Throttling will not work.',
  )
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string }
}) {
  // Defensive: check if searchParams is defined and is an object
  let redirectTo: string | undefined = undefined
  if (searchParams && typeof searchParams === 'object' && 'redirect' in searchParams) {
    const val = searchParams.redirect
    if (typeof val === 'string' && val.startsWith('/')) {
      redirectTo = val
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <LoginPageClient loginAction={login} redirectTo={redirectTo} />
    </div>
  )
}
