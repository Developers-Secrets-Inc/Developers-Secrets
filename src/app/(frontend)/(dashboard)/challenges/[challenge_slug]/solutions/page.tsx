import { ChallengeHeader } from '../components/challenge-header'
import { CommunitySolutions } from '../components/community-solutions'
import { prefetchAllChallengeData } from '@/lib/challenge-utils'
import { Suspense } from 'react'

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
export async function generateMetadata({ params }: { params: { challenge_slug: string } }) {
  // Préchargement des données pendant la génération des métadonnées
  await prefetchAllChallengeData(params.challenge_slug)

  return {
    title: `Community Solutions | Challenge`,
    description: `View community solutions for the challenge`,
  }
}

export default async function SolutionsPage({ params }: { params: { challenge_slug: string } }) {
  // Précharger les données au niveau du serveur
  await prefetchAllChallengeData(params.challenge_slug)

  return (
    <div>
      <ChallengeHeader />
      <Suspense fallback={<SolutionsLoading />}>
        <CommunitySolutions challengeSlug={params.challenge_slug} />
      </Suspense>
    </div>
  )
}
