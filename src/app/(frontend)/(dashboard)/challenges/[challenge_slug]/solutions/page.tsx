import { CommunitySolutions } from '../components/community-solutions'
import { NoSolutionsAvailable } from '@/core/challenges/users-solutions/components/no-solutions-available'
import { CreateSolutionBanner } from '@/core/challenges/users-solutions/components/create-solution-banner'
import { getAllSolutions } from '@/lib/challenge-utils'
import { getChallengeBySlug } from '@/core/challenges'
import { Suspense } from 'react'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
// Ajoutons la configuration ISR pour cette page
export const revalidate = 600 // 10 minutes en secondes

// Composant de chargement pour éviter les flashs UI
function SolutionsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-60 bg-muted rounded mb-6"></div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  )
}

// Cette fonction sera exécutée au moment de la génération de la page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug } = await params

  // Préchargement des solutions pendant la génération des métadonnées
  await getAllSolutions(challenge_slug)

  return {
    title: `Community Solutions | Challenge`,
    description: `View community solutions for the challenge`,
  }
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params
  const solutions = await getAllSolutions(challenge_slug)
  const challenge = await getChallengeBySlug(challenge_slug)
  const hasSolutions = solutions && solutions.length > 0
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  if (!hasSolutions) {
    return (
      <div className="p-6">
        <CreateSolutionBanner challengeId={challenge.id} userId={user.id} />
        <NoSolutionsAvailable />
      </div>
    )
  }

  return (
    <div className="p-6">
      <CreateSolutionBanner challengeId={challenge.id} userId={user.id} />
      <Suspense fallback={<SolutionsLoading />}>
        <CommunitySolutions challengeSlug={challenge_slug} />
      </Suspense>
    </div>
  )
}
