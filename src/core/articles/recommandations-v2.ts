'use server'

import 'server-only'

import { getTutorialArticles } from './index-v2'
import { calculateHotnessScore } from './index'
import { Article as PayloadArticle } from '@/payload-types'

export const getPopularArticles = async (
  tutorialSlug: string,
  excludeArticleId?: number,
  limit: number = 1,
): Promise<PayloadArticle[]> => {
    const articles = await getTutorialArticles(tutorialSlug)
    const popularArticles = articles.filter((article) => article.id !== excludeArticleId)
    
    return popularArticles
        .sort((a, b) => calculateHotnessScore(b) - calculateHotnessScore(a))
        .slice(0, limit)
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
