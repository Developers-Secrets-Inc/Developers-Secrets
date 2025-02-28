import { getTutorialArticles } from '.'
import { Article as PayloadArticle } from '@/payload-types'

/**
 * Get similar articles based on tags and other metadata
 * This is a placeholder implementation that will be expanded in the future
 */
export const getSimilarArticles = async (
  tutorialSlug: string,
  articleId: string | number,
  limit: number = 4,
): Promise<PayloadArticle[]> => {
  // For now, just return other articles from the same tutorial
  const articles = await getTutorialArticles(tutorialSlug)
  return articles.filter((a) => String(a.id) !== String(articleId)).slice(0, limit)
}

/**
 * Calculate a hotness score for an article based on engagement and time
 * score = engagement / (hours since publication + 2)^alpha
 * where alpha is a parameter that controls the decay rate (default: 1.5)
 */
export const calculateHotnessScore = (article: PayloadArticle, alpha: number = 1.5): number => {
  if (!article.analytics) {
    return 0
  }

  // Use createdAt as a fallback if publishedAt is not available
  const publishDate = article._status === 'published' ? article.createdAt : new Date().toISOString()
  const publishedAt = new Date(publishDate)
  const hoursSincePublication = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60))

  // Simple engagement score based on views and ratings
  const views = article.analytics.views || 0
  const ratingSum = article.analytics.ratingSum || 0
  const recommendationClicks = article.analytics.recommendationClicks || 0

  const engagement = views + ratingSum * 10 + recommendationClicks * 5

  // Calculate hotness score
  return engagement / Math.pow(hoursSincePublication + 2, alpha)
}

/**
 * Get popular articles based on hotness score
 */
export const getPopularArticles = async (
  tutorialSlug: string,
  excludeArticleId?: string | number,
  limit: number = 2,
): Promise<PayloadArticle[]> => {
  const articles = await getTutorialArticles(tutorialSlug)

  // Filter out the current article if specified
  const filteredArticles = excludeArticleId
    ? articles.filter((a) => String(a.id) !== String(excludeArticleId))
    : articles

  // Sort by hotness score
  return filteredArticles
    .sort((a, b) => calculateHotnessScore(b) - calculateHotnessScore(a))
    .slice(0, limit)
}

/**
 * Get personalized article recommendations for a user
 * This is a placeholder implementation that will be expanded in the future
 */
export const getPersonalizedArticleRecommendations = async (
  tutorialSlug: string,
  excludeArticleId?: string | number,
  limit: number = 2,
): Promise<PayloadArticle[]> => {
  // For now, just return other articles from the same tutorial
  // In the future, this will use user preferences and reading history
  const articles = await getTutorialArticles(tutorialSlug)

  // Filter out the current article if specified
  const filteredArticles = excludeArticleId
    ? articles.filter((a) => String(a.id) !== String(excludeArticleId))
    : articles

  return filteredArticles.slice(0, limit)
}
