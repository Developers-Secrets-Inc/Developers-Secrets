import { getPayload } from 'payload'
import config from '@payload-config'
import { Article as PayloadArticle, Tutorial as PayloadTutorial } from '@/payload-types'
import { extractOutline, OutlineItem } from '@/core/markdown/parser'
import { slugify } from '../format'
import { Article, ArticleVisibility, DifficultyLevel } from '@/types/article'
import { Tutorial } from '@/types/tutorial'

// Custom error classes
export class TutorialError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TutorialError'
  }
}

export class TutorialNotFoundError extends TutorialError {
  constructor(slug: string) {
    super(`Tutorial with slug "${slug}" not found`)
    this.name = 'TutorialNotFoundError'
  }
}

export class MultipleTutorialsFoundError extends TutorialError {
  constructor(slug: string) {
    super(`Multiple tutorials found with slug "${slug}"`)
    this.name = 'MultipleTutorialsFoundError'
  }
}

export class InvalidTutorialSlugError extends TutorialError {
  constructor() {
    super('Tutorial slug is required')
    this.name = 'InvalidTutorialSlugError'
  }
}

export class PayloadConnectionError extends TutorialError {
  constructor(originalError: unknown) {
    super('Failed to connect to database')
    this.name = 'PayloadConnectionError'
    this.cause = originalError
  }
}

export class ArticleNotFoundError extends Error {
  constructor(slug: string) {
    super(`Article with slug "${slug}" not found`)
    this.name = 'ArticleNotFoundError'
  }
}

const getTutorialBySlugFromCollection = async (slug: string): Promise<PayloadTutorial> => {
  if (!slug) {
    throw new InvalidTutorialSlugError()
  }

  let payload
  try {
    payload = await getPayload({ config })
  } catch (error) {
    throw new PayloadConnectionError(error)
  }

  let tutorials
  try {
    // Get all tutorials and filter by slug manually
    tutorials = await payload.find({
      collection: 'tutorials',
      // No where clause - we'll filter manually
    })
  } catch (error) {
    throw new TutorialError(
      `Error querying tutorials: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  // Filter tutorials by comparing slugified titles to the requested slug
  const matchingTutorials = tutorials.docs.filter((tutorial) => slugify(tutorial.title) === slug)

  if (matchingTutorials.length < 1) {
    throw new TutorialNotFoundError(slug)
  }

  if (matchingTutorials.length > 1) {
    throw new MultipleTutorialsFoundError(slug)
  }

  return matchingTutorials[0]
}

// The big difference that may happen in the future is that we will need
// the custom Article type, not the PayloadTutorial type.
export const getTutorial = async (slug: string): Promise<PayloadTutorial> => {
  try {
    return await getTutorialBySlugFromCollection(slug)
  } catch (error) {
    console.error(`Error in getTutorial for slug "${slug}":`, error)
    throw error
  }
}

/**
 * Helper function to extract articles from tutorial sections
 */
const extractArticlesFromSections = <T extends { articles: (number | PayloadArticle)[] }>(
  sections: T[] | undefined,
): PayloadArticle[] => {
  if (!sections) {
    return []
  }

  try {
    return sections.flatMap((section) =>
      section.articles.filter(
        (article): article is PayloadArticle => typeof article === 'object' && article !== null,
      ),
    )
  } catch (error) {
    console.error('Error extracting articles from sections:', error)
    throw new TutorialError('Failed to extract articles from tutorial sections')
  }
}

export const getTutorialArticles = async (slug: string): Promise<PayloadArticle[]> => {
  const tutorial = await getTutorialBySlugFromCollection(slug).catch((error) => {
    console.error(`Error in getTutorialArticles for slug "${slug}":`, error)
    throw error
  })

  return extractArticlesFromSections(tutorial.sections)
}

export const getTutorialExampleArticles = async (slug: string): Promise<PayloadArticle[]> => {
  const tutorial = await getTutorialBySlugFromCollection(slug).catch((error) => {
    console.error(`Error in getTutorialExampleArticles for slug "${slug}":`, error)
    throw error
  })

  return extractArticlesFromSections(tutorial.exampleSections ?? undefined)
}

export const getTutorialReferenceArticles = async (slug: string): Promise<PayloadArticle[]> => {
  const tutorial = await getTutorialBySlugFromCollection(slug).catch((error) => {
    console.error(`Error in getTutorialReferenceArticles for slug "${slug}":`, error)
    throw error
  })

  return extractArticlesFromSections(tutorial.referenceSections ?? undefined)
}

export const getFirstArticleOfTutorial = async (slug: string): Promise<PayloadArticle> => {
  const articles = await getTutorialArticles(slug)

  if (articles.length === 0) {
    throw new TutorialError(`No articles found for tutorial "${slug}"`)
  }

  return articles[0]
}

export const getFirstExampleArticleOfTutorial = async (slug: string): Promise<PayloadArticle> => {
  const articles = await getTutorialExampleArticles(slug)

  if (articles.length === 0) {
    throw new TutorialError(`No example articles found for tutorial "${slug}"`)
  }

  return articles[0]
}

export const getFirstReferenceArticleOfTutorial = async (slug: string): Promise<PayloadArticle> => {
  const articles = await getTutorialReferenceArticles(slug)

  if (articles.length === 0) {
    throw new TutorialError(`No reference articles found for tutorial "${slug}"`)
  }

  return articles[0]
}

/**
 * Get an article by its slug within a tutorial
 */
export const getArticle = async (
  tutorialSlug: string,
  articleSlug: string,
): Promise<PayloadArticle> => {
  const articles = await getTutorialArticles(tutorialSlug)
  // Find article by comparing slugified titles to the requested slug
  const article = articles.find((a) => slugify(a.title) === articleSlug)

  if (!article) {
    throw new ArticleNotFoundError(articleSlug)
  }

  return article
}

/**
 * Get an example article by its slug within a tutorial
 */
export const getExampleArticle = async (
  tutorialSlug: string,
  articleSlug: string,
): Promise<PayloadArticle> => {
  const articles = await getTutorialExampleArticles(tutorialSlug)
  // Find article by comparing slugified titles to the requested slug
  const article = articles.find((a) => slugify(a.title) === articleSlug)

  if (!article) {
    throw new ArticleNotFoundError(articleSlug)
  }

  return article
}

/**
 * Get a reference article by its slug within a tutorial
 */
export const getReferenceArticle = async (
  tutorialSlug: string,
  articleSlug: string,
): Promise<PayloadArticle> => {
  const articles = await getTutorialReferenceArticles(tutorialSlug)
  // Find article by comparing slugified titles to the requested slug
  const article = articles.find((a) => slugify(a.title) === articleSlug)

  if (!article) {
    throw new ArticleNotFoundError(articleSlug)
  }

  return article
}

/**
 * Get the outline of an article
 */
export const getArticleOutline = (content: string): OutlineItem[] => {
  return extractOutline(content)
}

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

/**
 * Get the slug for a title
 */
export const getSlugFromTitle = (title: string): string => {
  return slugify(title)
}

/**
 * Convert a PayloadArticle to our custom Article type
 */
export const convertPayloadArticleToArticle = (payloadArticle: PayloadArticle): Article => {
  return {
    id: String(payloadArticle.id),
    title: payloadArticle.title,
    subtitle: payloadArticle.subtitle || undefined,
    content: payloadArticle.content,
    slug: getSlugFromTitle(payloadArticle.title),
    metadata: {
      createdAt: payloadArticle.createdAt,
      updatedAt: payloadArticle.updatedAt,
      publishedAt: payloadArticle._status === 'published' ? payloadArticle.createdAt : undefined,
      articleStatus: payloadArticle.articleStatus as ArticleVisibility,
      author: 'system', // Default author
    },
    seo: {
      title: payloadArticle.seo?.title || undefined,
      description: payloadArticle.seo?.description || undefined,
      keywords:
        payloadArticle.seo?.keywords?.map((k) => ({ keyword: k.keyword || '' })) || undefined,
    },
    difficultyLevel: payloadArticle.difficultyLevel as DifficultyLevel,
  }
}

/**
 * Convert a PayloadTutorial to our custom Tutorial type
 */
export const convertPayloadTutorialToTutorial = (payloadTutorial: PayloadTutorial): Tutorial => {
  return {
    id: String(payloadTutorial.id),
    title: payloadTutorial.title,
    description: payloadTutorial.description || undefined,
    slug: getSlugFromTitle(payloadTutorial.title),
    metadata: {
      createdAt: payloadTutorial.createdAt,
      updatedAt: payloadTutorial.updatedAt,
      publishedAt: payloadTutorial._status === 'published' ? payloadTutorial.createdAt : undefined,
      tutorialStatus: payloadTutorial.tutorialStatus as any,
    },
    sections: payloadTutorial.sections.map((section) => ({
      id: section.id || String(Math.random()),
      title: section.title,
      description: section.description || undefined,
      articles: section.articles.map((article) =>
        typeof article === 'number' ? String(article) : String(article.id),
      ),
    })),
    exampleSections:
      payloadTutorial.exampleSections?.map((section) => ({
        id: section.id || String(Math.random()),
        title: section.title,
        articles: section.articles.map((article) =>
          typeof article === 'number' ? String(article) : String(article.id),
        ),
      })) || undefined,
    referenceSections:
      payloadTutorial.referenceSections?.map((section) => ({
        id: section.id || String(Math.random()),
        title: section.title,
        description: section.description || undefined,
        articles: section.articles.map((article) =>
          typeof article === 'number' ? String(article) : String(article.id),
        ),
      })) || undefined,
  }
}
