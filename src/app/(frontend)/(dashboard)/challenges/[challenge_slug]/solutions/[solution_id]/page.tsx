import { notFound } from 'next/navigation'
import { SolutionDetail } from '../../components/solution-detail'
import { EXAMPLE_SOLUTIONS } from '../../data/solutions-data'
import { Suspense } from 'react'

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

export default function SolutionDetailPage({
  params,
}: {
  params: { challenge_slug: string; solution_id: string }
}) {
  // Dans une application réelle, on récupérerait les données depuis une API
  // en utilisant le challenge_slug et le solution_id
  const solution = EXAMPLE_SOLUTIONS.find((sol) => sol.id === params.solution_id)

  if (!solution) {
    notFound()
  }

  return (
    <Suspense fallback={<SolutionSkeleton />}>
      <SolutionDetail solution={solution} challengeSlug={params.challenge_slug} />
    </Suspense>
  )
}

// Génération statique des paramètres pour les routes - améliore considérablement les performances
// Dans un environnement réel, cela viendrait d'une base de données ou d'une API
export function generateStaticParams() {
  return EXAMPLE_SOLUTIONS.map((solution) => ({
    solution_id: solution.id,
  }))
}
