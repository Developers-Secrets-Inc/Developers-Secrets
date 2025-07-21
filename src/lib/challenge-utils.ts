// import { SolutionDetailProps } from '@/app/(frontend)/(dashboard)/challenges/[challenge_slug]/components/solution-detail'
import { EXAMPLE_SOLUTIONS } from '@/app/(frontend)/(dashboard)/challenges/[challenge_slug]/data/solutions-data'
import { unstable_cache } from 'next/cache'

// Cache TTL in seconds (10 minutes)
const CACHE_TTL = 600

/**
 * Précharge toutes les solutions d'un challenge donné avec support pour ISR
 * @param challengeSlug L'identifiant du challenge
 */
export const prefetchChallengeSolutions = unstable_cache(
  async (challengeSlug: string) => {
    // Dans une application réelle, nous ferions un appel API
    // Simulation d'un délai pour représenter un chargement asynchrone
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Retourne les solutions
    return EXAMPLE_SOLUTIONS
  },
  ['challenge-solutions'],
  { revalidate: CACHE_TTL, tags: ['solutions'] },
)

/**
 * Récupère une solution spécifique avec support pour ISR
 * @param challengeSlug L'identifiant du challenge
 * @param solutionId L'identifiant de la solution
 */
export const getSolution = unstable_cache(
  async (challengeSlug: string, solutionId: string) => {
    const solutions = await prefetchChallengeSolutions(challengeSlug)
    return solutions.find((s) => s.id === solutionId) || null
  },
  ['solution-detail'],
  { revalidate: CACHE_TTL, tags: ['solution'] },
)

/**
 * Récupère toutes les solutions d'un challenge avec support pour ISR
 * @param challengeSlug L'identifiant du challenge
 */
export const getAllSolutions = unstable_cache(
  async (challengeSlug: string) => {
    return await prefetchChallengeSolutions(challengeSlug)
  },
  ['all-solutions'],
  { revalidate: CACHE_TTL, tags: ['solutions'] },
)

/**
 * Fonction pour forcer la revalidation des données
 * @param paths Chemins à revalider
 * @param tags Tags à revalider
 */
export async function forceRevalidate(paths?: string[], tags?: string[]): Promise<void> {
  // Cette fonction serait appelée après des mises à jour pour déclencher la revalidation
  // Dans une application réelle, cela enverrait une requête à l'API de revalidation
  const apiEndpoint = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Boucle sur tous les chemins pour les revalider
  if (paths && paths.length > 0) {
    for (const path of paths) {
      try {
        await fetch(`${apiEndpoint}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path,
            secret: process.env.REVALIDATION_SECRET || 'default-secret-change-me',
          }),
        })
      } catch (error) {
        console.error(`Failed to revalidate path: ${path}`, error)
      }
    }
  }

  // Boucle sur tous les tags pour les revalider
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      try {
        await fetch(`${apiEndpoint}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tag,
            secret: process.env.REVALIDATION_SECRET || 'default-secret-change-me',
          }),
        })
      } catch (error) {
        console.error(`Failed to revalidate tag: ${tag}`, error)
      }
    }
  }
}
