import { SolutionDetailProps } from '@/app/(frontend)/(dashboard)/challenges/[challenge_slug]/components/solution-detail'
import { EXAMPLE_SOLUTIONS } from '@/app/(frontend)/(dashboard)/challenges/[challenge_slug]/data/solutions-data'

// Cache pour stocker les données déjà chargées
const cache = new Map<string, any>()

/**
 * Précharge toutes les solutions d'un challenge donné
 * @param challengeSlug L'identifiant du challenge
 */
export async function prefetchChallengeSolutions(challengeSlug: string): Promise<void> {
  // Dans une application réelle, nous ferions un appel API
  // Nous simulons avec un délai pour représenter un chargement asynchrone
  await new Promise((resolve) => setTimeout(resolve, 10))

  // Stocker les données dans le cache
  const cacheKey = `challenge-${challengeSlug}-solutions`
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, EXAMPLE_SOLUTIONS)
  }
}

/**
 * Récupère une solution spécifique
 * @param challengeSlug L'identifiant du challenge
 * @param solutionId L'identifiant de la solution
 */
export async function getSolution(
  challengeSlug: string,
  solutionId: string,
): Promise<SolutionDetailProps | null> {
  // Vérifier si les données sont déjà en cache
  const cacheKey = `challenge-${challengeSlug}-solutions`
  if (!cache.has(cacheKey)) {
    await prefetchChallengeSolutions(challengeSlug)
  }

  const solutions = cache.get(cacheKey) as SolutionDetailProps[]
  return solutions.find((s) => s.id === solutionId) || null
}

/**
 * Récupère toutes les solutions d'un challenge
 * @param challengeSlug L'identifiant du challenge
 */
export async function getAllSolutions(challengeSlug: string): Promise<SolutionDetailProps[]> {
  // Vérifier si les données sont déjà en cache
  const cacheKey = `challenge-${challengeSlug}-solutions`
  if (!cache.has(cacheKey)) {
    await prefetchChallengeSolutions(challengeSlug)
  }

  return cache.get(cacheKey) as SolutionDetailProps[]
}

/**
 * Précharge les données pour plusieurs routes à la fois
 * @param challengeSlug L'identifiant du challenge
 */
export async function prefetchAllChallengeData(challengeSlug: string): Promise<void> {
  await Promise.all([
    prefetchChallengeSolutions(challengeSlug),
    // Ici, nous pourrions ajouter d'autres fonctions de préchargement
  ])
}
