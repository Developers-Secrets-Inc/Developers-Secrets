'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import { Article as PayloadArticle } from '@/payload-types'
import { unstable_cache } from 'next/cache'
import { TIME } from '@/lib/time'
import { Articles } from '@/collections/Articles'
import { Result, success, failure, isFailure, flatMapAsync } from '@/lib/result'
import { TutorialsNotFoundError, ArticleNotFoundError } from '@/core/articles/errors'
import { PayloadSelect, GetProjectedType } from '@/core/articles/types'
import { calculateHotnessScore } from './hotness'
import { getTutorialArticles } from '..'
import { isNone } from '@/lib/maybe'

type ArticleSelect = PayloadSelect<PayloadArticle>

const getCachedPopularArticles = <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  excludedArticleId?: number,
  limit: number = 1,
  select?: S,
) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const popularArticles = await payload.find({
        collection: 'articles',
        select: select
          ? { ...select, analytics: true, _status: true } // Ensure analytics and _status are selected for hotness calculation
          : { analytics: true, _status: true }, // Default selection if no select is provided
      })

      if (!popularArticles.docs || popularArticles.docs.length === 0) {
        return failure(new ArticleNotFoundError('No popular articles found.'))
      }

      const articles = popularArticles.docs
      const finalArticles = articles.filter((article) => article.id !== excludedArticleId)

      return success(
        finalArticles
          .sort((a, b) => calculateHotnessScore(b) - calculateHotnessScore(a))
          .slice(0, limit) as GetProjectedType<PayloadArticle, S>[],
      )
    },
    [
      `cached-popular-articles-${tutorialSlug}-${excludedArticleId}-${limit}-${select ? JSON.stringify(select) : 'all-fields'}`,
    ],
    { revalidate: TIME.ONE_DAY },
  )

export const getPopularArticles = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  excludeArticleId?: number,
  limit: number = 1,
  select?: S,
): Promise<Result<GetProjectedType<PayloadArticle, S>[], ArticleNotFoundError>> => {
  return await getCachedPopularArticles(tutorialSlug, excludeArticleId, limit, select)()
}

export const getPersonalizedArticles = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  excludeArticleId?: number,
  limit: number = 3,
  select?: S,
): Promise<
  Result<GetProjectedType<PayloadArticle, S>[], TutorialsNotFoundError | ArticleNotFoundError>
> => {
  const articlesResult = await getTutorialArticles({tutorialSlug})

  if (isNone(articlesResult)) return []

  return flatMapAsync(articlesResult.value, async (articles) => {
    // Filter out the current article if specified
    const filteredArticles = excludeArticleId
      ? articles.filter((a) => String(a.id) !== String(excludeArticleId))
      : articles

    // Also filter out articles that are already in popular articles
    // to avoid duplicates between popular and personalized recommendations
    const popularArticlesResult = await getPopularArticles(
      tutorialSlug,
      excludeArticleId,
      1,
      select,
    )

    if (isFailure(popularArticlesResult)) {
      console.error(
        'Failed to retrieve popular articles for personalization:',
        popularArticlesResult.error,
      )
      // Continue with just filteredArticles if popular articles fail to load
      const shuffledArticlesIfPopularFail = [...filteredArticles].sort(() => Math.random() - 0.5)
      return success(
        shuffledArticlesIfPopularFail.slice(0, limit) as GetProjectedType<PayloadArticle, S>[],
      )
    }

    const popularArticleIds = popularArticlesResult.value.map((article) => String(article.id))

    const candidateArticles = filteredArticles.filter(
      (article) => !popularArticleIds.includes(String(article.id)),
    )

    // If we don't have enough articles after filtering out popular ones,
    // just use the filtered articles
    const articlesToRandomize =
      candidateArticles.length >= limit ? candidateArticles : filteredArticles

    // Shuffle the articles to get random recommendations
    const shuffledArticles = [...articlesToRandomize].sort(() => Math.random() - 0.5)

    return success(shuffledArticles.slice(0, limit) as GetProjectedType<PayloadArticle, S>[])
  })
}
