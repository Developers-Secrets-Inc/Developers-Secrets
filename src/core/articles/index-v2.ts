'use server'

import 'server-only'

import {
  BasePayload,
  CollectionSlug,
  GeneratedTypes,
  getPayload,
  SelectType,
  TypedCollectionSelect,
} from 'payload'
import config from '@payload-config'

import { unstable_cache } from 'next/cache'

import { Tutorial, Article } from '@/payload-types'
import { failure, Result, success, isFailure, flatMapAsync } from '@/lib/result'
import { TutorialNotFoundError, TutorialsNotFoundError } from './errors'
import { TIME } from '@/lib/time'
import { GetProjectedType, PayloadSelect } from './types'

type TutorialSelect = PayloadSelect<Tutorial>
type ArticleSelect = PayloadSelect<Article>

export const getTutorials = unstable_cache(
  async (): Promise<Result<Tutorial[], TutorialsNotFoundError>> => {
    const payload = await getPayload({ config })

    const tutorials = await payload.find({
      collection: 'tutorials',
    })

    if (!tutorials.docs || tutorials.docs.length === 0) {
      return failure(new TutorialsNotFoundError())
    }

    return success(tutorials.docs)
  },
  ['tutorials'],
  { revalidate: TIME.ONE_DAY },
)

type Select<TSlug extends CollectionSlug> = TypedCollectionSelect[TSlug]

export const getTutorialBySlug = async (
  tutorialSlug: string,
  select?: Select<'tutorials'>,
): Promise<Result<GetProjectedType<Tutorial, typeof select>, TutorialNotFoundError>> => {
  const cached = unstable_cache(
    async (currentSlug, currentSelect) => {
      const payload = await getPayload({ config })

      const tutorial = await payload.find({
        collection: 'tutorials',
        where: { slug: { equals: currentSlug } },
        select: currentSelect,
      })

      if (!tutorial.docs || tutorial.docs.length === 0) {
        return failure(new TutorialNotFoundError(currentSlug))
      }

      return success(tutorial.docs[0] as GetProjectedType<Tutorial, TSelect>)
    },
    ['tutorial-by-slug', tutorialSlug, select ? JSON.stringify(select) : 'all-fields'],
    {
      tags: [`tutorial-${tutorialSlug}`],
      revalidate: TIME.ONE_DAY,
    },
  )
  return cached(tutorialSlug, select)
}

export const getArticlesByType = async <
  S extends SelectFromCollectionSlug<'tutorials'> | undefined,
>(
  tutorialSlug: string,
  type: 'sections' | 'exampleSections' | 'referenceSections',
  articleSelect?: S, // Add articleSelect parameter
): Promise<Result<GetProjectedType<Article, S>[], TutorialsNotFoundError>> => {
  // Update return type
  const cached = unstable_cache(
    async (currentSlug, currentType, currentArticleSelect) => {
      // Add currentArticleSelect
      const selectParam: TutorialSelect = {
        [currentType]: { articles: currentArticleSelect || true }, // Pass articleSelect or true for all fields
      }

      return flatMapAsync(
        await getTutorialBySlug(currentSlug, selectParam),
        async (tutorial: Partial<Tutorial>) => {
          const articles =
            (
              (tutorial[currentType as keyof Partial<Tutorial>] as Array<{
                articles: Article[]
              }>) || []
            ).flatMap((section) => section.articles as GetProjectedType<Article, S>[]) || []
          return success(articles)
        },
      )
    },
    [
      `articles-by-type-${tutorialSlug}-${type}-${articleSelect ? JSON.stringify(articleSelect) : 'all-fields'}`,
    ], // Update cache key
    {
      tags: [`articles-by-type-${tutorialSlug}-${type}`],
      revalidate: TIME.ONE_DAY,
    },
  )
  return cached(tutorialSlug, type, articleSelect) // Pass articleSelect
}

export const getTutorialArticles = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  select?: S, // Add select parameter
): Promise<Result<GetProjectedType<Article, S>[], TutorialsNotFoundError>> => {
  // Update return type
  return getArticlesByType(tutorialSlug, 'sections', select) // Pass select
}

export const getTutorialExamplesArticles = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  select?: S, // Add select parameter
): Promise<Result<GetProjectedType<Article, S>[], TutorialsNotFoundError>> => {
  // Update return type
  return getArticlesByType(tutorialSlug, 'exampleSections', select) // Pass select
}

export const getTutorialReferenceArticles = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  select?: S, // Add select parameter
): Promise<Result<GetProjectedType<Article, S>[], TutorialsNotFoundError>> => {
  // Update return type
  return getArticlesByType(tutorialSlug, 'referenceSections', select) // Pass select
}

export const getArticleBySlugAndType = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  articleSlug: string,
  type: 'sections' | 'exampleSections' | 'referenceSections',
  select?: S,
): Promise<Result<GetProjectedType<Article, S>, TutorialNotFoundError>> => {
  const cached = unstable_cache(
    async (currentTutorialSlug, currentArticleSlug, currentType, currentSelect) => {
      const articlesResult = await getArticlesByType(currentTutorialSlug, currentType)

      return flatMapAsync(articlesResult, async (articles) => {
        const article = articles.find((art) => art.slug === currentArticleSlug)

        if (!article) {
          return failure(
            new TutorialNotFoundError(
              `Article ${currentArticleSlug} not found in tutorial ${currentTutorialSlug} ${currentType} section.`,
            ),
          )
        }

        // Apply select to the found article
        const selectedArticle = currentSelect
          ? (Object.keys(currentSelect) as Array<keyof Article>).reduce(
              (acc, key) => {
                if (currentSelect[key]) {
                  ;(acc as any)[key] = article[key]
                }
                return acc
              },
              {} as GetProjectedType<Article, S>,
            )
          : (article as GetProjectedType<Article, S>) // Cast to the projected type when no select is applied

        return success(selectedArticle)
      })
    },
    [
      `article-by-slug-and-type-${tutorialSlug}-${articleSlug}-${type}-${select ? JSON.stringify(select) : 'all-fields'}`,
    ],
    {
      tags: [`article-by-slug-and-type-${tutorialSlug}-${articleSlug}-${type}`],
      revalidate: TIME.ONE_DAY,
    },
  )
  return cached(tutorialSlug, articleSlug, type, select)
}

// TODO: In the future, we should modify the Articles collection to include the tutorial. It could help us avoid the loop through the sections.
export const getArticleBySlug = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  articleSlug: string,
  select?: S,
): Promise<Result<GetProjectedType<Article, S>, TutorialNotFoundError>> => {
  return getArticleBySlugAndType(tutorialSlug, articleSlug, 'sections', select)
}

export const getFirstTutorialArticle = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  select?: S, // Add select parameter
): Promise<Result<GetProjectedType<Article, S>, TutorialNotFoundError>> => {
  // Update return type
  const articlesResult = await getTutorialArticles(tutorialSlug, select) // Pass select
  if (isFailure(articlesResult)) {
    console.error(
      `Failed to retrieve first tutorial article for slug ${tutorialSlug}:`,
      articlesResult.error,
    )
    return failure(articlesResult.error)
  }
  const firstArticle = articlesResult.value[0]
  if (!firstArticle) {
    return failure(new TutorialNotFoundError(`No first article found for tutorial ${tutorialSlug}`))
  }
  return success(firstArticle)
}

export const getExampleArticleBySlug = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  exampleSlug: string,
  select?: S,
): Promise<Result<GetProjectedType<Article, S>, TutorialNotFoundError>> => {
  return getArticleBySlugAndType(tutorialSlug, exampleSlug, 'exampleSections', select)
}

export const getFirstExampleArticle = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  select?: S, // Add select parameter
): Promise<Result<GetProjectedType<Article, S>, TutorialNotFoundError>> => {
  // Update return type
  const articlesResult = await getTutorialExamplesArticles(tutorialSlug, select) // Pass select
  if (isFailure(articlesResult)) {
    console.error(
      `Failed to retrieve first example article for slug ${tutorialSlug}:`,
      articlesResult.error,
    )
    return failure(articlesResult.error)
  }
  const firstArticle = articlesResult.value[0]
  if (!firstArticle) {
    return failure(
      new TutorialNotFoundError(`No first example article found for tutorial ${tutorialSlug}`),
    )
  }
  return success(firstArticle)
}

export const getReferenceArticleBySlug = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  referenceSlug: string,
  select?: S,
): Promise<Result<GetProjectedType<Article, S>, TutorialNotFoundError>> => {
  return getArticleBySlugAndType(tutorialSlug, referenceSlug, 'referenceSections', select)
}

export const getFirstTutorialReferenceArticle = async <S extends ArticleSelect | undefined>(
  tutorialSlug: string,
  select?: S, // Add select parameter
): Promise<Result<GetProjectedType<Article, S>, TutorialNotFoundError>> => {
  // Update return type
  const referenceArticlesResult = await getTutorialReferenceArticles(tutorialSlug, select) // Pass select
  if (isFailure(referenceArticlesResult)) {
    console.error(
      `Failed to retrieve first reference article for slug ${tutorialSlug}:`,
      referenceArticlesResult.error,
    )
    return failure(referenceArticlesResult.error)
  }
  const firstArticle = referenceArticlesResult.value[0]
  if (!firstArticle) {
    return failure(
      new TutorialNotFoundError(`No first reference article found for tutorial ${tutorialSlug}`),
    )
  }
  return success(firstArticle)
}

export const getTutorialsArticles = async (): Promise<
  {
    tutorial: Tutorial
    articles: Article[]
  }[]
> => {
  const tutorialsResult = await getTutorials()

  if (isFailure(tutorialsResult)) {
    console.error('Failed to retrieve tutorials for articles:', tutorialsResult.error)
    return []
  }

  return Promise.all(
    tutorialsResult.value.map(async (tutorial) => {
      const articlesResult = await getTutorialArticles(tutorial.slug)
      if (isFailure(articlesResult)) {
        console.error(
          `Failed to retrieve articles for tutorial ${tutorial.slug}:`,
          articlesResult.error,
        )
        return { tutorial, articles: [] } // Return empty array for articles on failure
      }
      return {
        tutorial,
        articles: articlesResult.value,
      }
    }),
  )
}

export const getTutorialsReferenceArticles = async (): Promise<
  {
    tutorial: Tutorial
    referenceArticles: Article[]
  }[]
> => {
  const cached = unstable_cache(
    async () => {
      const tutorialsResult = await getTutorials()

      if (isFailure(tutorialsResult)) {
        console.error('Failed to retrieve tutorials for reference articles:', tutorialsResult.error)
        return []
      }

      return Promise.all(
        tutorialsResult.value.map(async (tutorial) => {
          const referenceArticlesResult = await getTutorialReferenceArticles(tutorial.slug)
          if (isFailure(referenceArticlesResult)) {
            console.error(
              `Failed to retrieve reference articles for tutorial ${tutorial.slug}:`,
              referenceArticlesResult.error,
            )
            return { tutorial, referenceArticles: [] }
          }
          return {
            tutorial,
            referenceArticles: referenceArticlesResult.value,
          }
        }),
      )
    },
    ['tutorials-reference-articles'],
    {
      tags: [`tutorials-reference-articles`],
      revalidate: TIME.ONE_DAY,
    },
  )
  return cached()
}
