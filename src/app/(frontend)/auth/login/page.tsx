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

// Type for login page search params
export type LoginPageSearchParams = {
  redirect?: string
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<LoginPageSearchParams>
}) {
  const params = await searchParams
  const redirectTo = params?.redirect?.startsWith('/') ? params.redirect : undefined

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <LoginPageClient loginAction={login} redirectTo={redirectTo} />
    </div>
  )
}
