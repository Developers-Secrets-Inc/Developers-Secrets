import { ChallengeHeader } from '../components/challenge-header'
import { CommunitySolutions } from '../components/community-solutions'
import { getAllSolutions } from '@/lib/challenge-utils'
import { Suspense } from 'react'

// Ajoutons la configuration ISR pour cette page
export const revalidate = 600; // 10 minutes en secondes

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
export async function generateMetadata({ params }: { params: Promise<{ challenge_slug: string }> }) {
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug } = await params

  // Préchargement des solutions pendant la génération des métadonnées
  await getAllSolutions(challenge_slug)

  return {
    title: `Community Solutions | Challenge`,
    description: `View community solutions for the challenge`,
  }
}

export default async function SolutionsPage({ params }: { params: { challenge_slug: string } }) {
  // Précharger les solutions au niveau du serveur
  await getAllSolutions(params.challenge_slug)

  return (
    <div>
      <ChallengeHeader />
      <Suspense fallback={<SolutionsLoading />}>
        <CommunitySolutions challengeSlug={params.challenge_slug} />
      </Suspense>
    </div>
  )
}
