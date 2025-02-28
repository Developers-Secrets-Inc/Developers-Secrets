'use server'

import { revalidateTag } from 'next/cache'

/**
 * Revalidate all caches related to an article
 */
export async function revalidateArticle(tutorialSlug: string, articleSlug: string) {
  // Revalidate the specific article
  revalidateTag(`article-${tutorialSlug}-${articleSlug}`)

  // Also revalidate related data that might have changed
  revalidateTag(`tutorial-articles-${tutorialSlug}`)
  revalidateTag(`popular-articles-${tutorialSlug}`)
  revalidateTag(`personalized-articles-${tutorialSlug}`)
}

/**
 * Revalidate all caches related to a tutorial
 */
export async function revalidateTutorial(tutorialSlug: string) {
  // Revalidate the tutorial itself
  revalidateTag(`tutorial-${tutorialSlug}`)

  // Revalidate all tutorial-related data
  revalidateTag(`tutorial-articles-${tutorialSlug}`)
  revalidateTag(`popular-articles-${tutorialSlug}`)
  revalidateTag(`personalized-articles-${tutorialSlug}`)
}

/**
 * Revalidate all caches for a tutorial and its articles
 */
export async function revalidateEntireTutorial(tutorialSlug: string, articleSlugs: string[]) {
  // Revalidate the tutorial
  await revalidateTutorial(tutorialSlug)

  // Revalidate each article
  for (const articleSlug of articleSlugs) {
    await revalidateArticle(tutorialSlug, articleSlug)
  }
}

/**
 * Revalidate popular articles across all tutorials
 */
export async function revalidatePopularArticles(tutorialSlugs: string[]) {
  for (const tutorialSlug of tutorialSlugs) {
    revalidateTag(`popular-articles-${tutorialSlug}`)
  }
}

/**
 * Revalidate personalized recommendations across all tutorials
 */
export async function revalidatePersonalizedRecommendations(tutorialSlugs: string[]) {
  for (const tutorialSlug of tutorialSlugs) {
    revalidateTag(`personalized-articles-${tutorialSlug}`)
  }
}
