import { redirect } from 'next/navigation'

export default function ChallengePage({ params }: { params: { challenge_slug: string } }) {
  const { challenge_slug } = params
  redirect(`/challenges/${challenge_slug}/description`)
}
