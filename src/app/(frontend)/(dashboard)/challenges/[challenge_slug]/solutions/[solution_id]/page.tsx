import { notFound } from 'next/navigation'
import { SolutionDetail } from '../../components/solution-detail'
import { Suspense } from 'react'
import { getSolution } from '@/lib/challenge-utils'

// This function enables ISR with a 10-minute revalidation period
export const revalidate = 600 // 10 minutes in seconds

// Composant de chargement optimisé
function SolutionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse -mt-6">
      <div className="flex items-center justify-between py-2 border-b -mx-6 px-6">
        <div className="h-8 w-32 bg-muted rounded"></div>
        <div className="h-8 w-32 bg-muted rounded"></div>
      </div>
      <div>
        <div className="h-8 w-3/4 bg-muted rounded mb-2"></div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-muted"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div className="h-4 w-full bg-muted rounded mb-4"></div>
      </div>
    </div>
  )
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ challenge_slug: string; solution_id: string }>
}) {
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug, solution_id } = await params

  const solution = await getSolution(challenge_slug, solution_id)

  if (!solution) {
    notFound()
  }

  return (
    <Suspense fallback={<SolutionSkeleton />}>
      <SolutionDetail solution={solution} challengeSlug={challenge_slug} />
    </Suspense>
  )
}

// Génération statique des paramètres pour les routes - améliore considérablement les performances
// Ce code sera exécuté pendant le temps de build
import { getAllSolutions } from '@/lib/challenge-utils'
import { EXAMPLE_SOLUTIONS } from '../../data/solutions-data'

export async function generateStaticParams() {
  // Note: Dans une application réelle, vous récupéreriez la liste des slugs de défis de votre API
  // Ensuite, vous pourriez utiliser getAllSolutions pour chaque slug
  // Pour l'exemple, on utilise directement EXAMPLE_SOLUTIONS
  return EXAMPLE_SOLUTIONS.map((solution) => ({
    solution_id: solution.id,
  }))
}
