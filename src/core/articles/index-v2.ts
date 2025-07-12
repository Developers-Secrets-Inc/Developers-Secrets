'use server'

import 'server-only'

import { getPayload } from 'payload'
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

export const getTutorialBySlug = async <S extends TutorialSelect | undefined>(
  tutorialSlug: string,
  select?: S,
): Promise<Result<GetProjectedType<Tutorial, S>, TutorialNotFoundError>> => {
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

      return success(tutorial.docs[0] as GetProjectedType<Tutorial, S>)
    },
    ['tutorial-by-slug', tutorialSlug, select ? JSON.stringify(select) : 'all-fields'],
    {
      tags: [`tutorial-${tutorialSlug}`],
      revalidate: TIME.ONE_DAY,
    },
  )
  return cached(tutorialSlug, select)
}

export const getArticlesByType = async (
  tutorialSlug: string,
  type: 'sections' | 'exampleSections' | 'referenceSections',
): Promise<Result<Article[], TutorialsNotFoundError>> => {
  const cached = unstable_cache(
    async (currentSlug, currentType) => {
      const selectParam: TutorialSelect = {
        [currentType]: { articles: true }, // Explicitly select articles within the section
      }

      return flatMapAsync(
        await getTutorialBySlug(currentSlug, selectParam),
        async (tutorial: Partial<Tutorial>) => {
          // tutorial is Partial here because getTutorialBySlug returns Partial when `select` is used
          const articles =
            (
              (tutorial[currentType as keyof Partial<Tutorial>] as Array<{
                articles: Article[]
              }>) || []
            ).flatMap((section) => section.articles as Article[]) || []
          return success(articles)
        },
      )
    },
    [`articles-by-type-${tutorialSlug}-${type}`],
    {
      tags: [`articles-by-type-${tutorialSlug}-${type}`],
      revalidate: TIME.ONE_DAY,
    },
  )
  return cached(tutorialSlug, type)
}

export const getTutorialArticles = async (
  tutorialSlug: string,
): Promise<Result<Article[], TutorialsNotFoundError>> => {
  return getArticlesByType(tutorialSlug, 'sections')
}

export const getTutorialExamplesArticles = async (
  tutorialSlug: string,
): Promise<Result<Article[], TutorialsNotFoundError>> => {
  return getArticlesByType(tutorialSlug, 'exampleSections')
}

export const getTutorialReferenceArticles = async (
  tutorialSlug: string,
): Promise<Result<Article[], TutorialsNotFoundError>> => {
  return getArticlesByType(tutorialSlug, 'referenceSections')
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

export const getFirstTutorialArticle = async (
  tutorialSlug: string,
): Promise<Result<Article, TutorialNotFoundError>> => {
  const articlesResult = await getTutorialArticles(tutorialSlug)
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

export const getFirstExampleArticle = async (
  tutorialSlug: string,
): Promise<Result<Article, TutorialNotFoundError>> => {
  const articlesResult = await getTutorialExamplesArticles(tutorialSlug)
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

export const getFirstTutorialReferenceArticle = async (
  tutorialSlug: string,
): Promise<Result<Article, TutorialNotFoundError>> => {
  const referenceArticlesResult = await getTutorialReferenceArticles(tutorialSlug)
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
