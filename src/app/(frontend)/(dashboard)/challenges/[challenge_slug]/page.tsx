import { redirect } from 'next/navigation'

export default async function ChallengePage({ params }: { params: Promise<{ challenge_slug: string }> }) {
  const { challenge_slug } = await params
  redirect(`/challenges/${challenge_slug}/description`)
}
