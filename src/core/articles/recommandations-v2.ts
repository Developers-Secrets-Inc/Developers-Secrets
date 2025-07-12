'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import { getTutorialArticles } from './index-v2'
import { calculateHotnessScore } from './index'
import { Article as PayloadArticle } from '@/payload-types'
import { unstable_cache } from 'next/cache'
import { TIME } from '@/lib/time'
import { Articles } from '@/collections/Articles'

const getCachedPopularArticles = (
  tutorialSlug: string,
  excludedArticleId?: number,
  limit: number = 1,
) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const popularArticles = await payload.find({
        collection: 'articles',
        select: {
          _status: true,
          createdAt: true, 
          analytics: true
        }
      })

      const articles = popularArticles.docs
      const finalArticles = articles.filter((article) => article.id !== excludedArticleId)

      return finalArticles
        .sort((a, b) => calculateHotnessScore(b) - calculateHotnessScore(a))
        .slice(0, limit)
    },
    [`cached-articles-${tutorialSlug}-${excludedArticleId}-${limit}`],
    { revalidate: TIME.ONE_DAY },
  )

export const getPopularArticles = async (
  tutorialSlug: string,
  excludeArticleId?: number,
  limit: number = 1,
): Promise<PayloadArticle[]> => {
  return await getCachedPopularArticles(tutorialSlug, excludeArticleId, limit)()
}

export const getPersonalizedArticles = async (
  tutorialSlug: string,
  excludeArticleId?: number,
  limit: number = 3,
): Promise<PayloadArticle[]> => {
  const articles = await getTutorialArticles(tutorialSlug)

  // Filter out the current article if specified
  const filteredArticles = excludeArticleId
    ? articles.filter((a) => String(a.id) !== String(excludeArticleId))
    : articles

  // Also filter out articles that are already in popular articles
  // to avoid duplicates between popular and personalized recommendations
  const popularArticles = await getPopularArticles(tutorialSlug, excludeArticleId, 1)
  const popularArticleIds = popularArticles.map((article) => String(article.id))

  const candidateArticles = filteredArticles.filter(
    (article) => !popularArticleIds.includes(String(article.id)),
  )

  // If we don't have enough articles after filtering out popular ones,
  // just use the filtered articles
  const articlesToRandomize =
    candidateArticles.length >= limit ? candidateArticles : filteredArticles

  // Shuffle the articles to get random recommendations
  const shuffledArticles = [...articlesToRandomize].sort(() => Math.random() - 0.5)

  return shuffledArticles.slice(0, limit)
}
