'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import { unstable_cache } from 'next/cache'

import { Article, Tutorial } from '@/payload-types'

const ONE_DAY = 60 * 60 * 24
const EVERY_DAY = ONE_DAY

export const getTutorials = unstable_cache(async (): Promise<Tutorial[]> => {
  const payload = await getPayload({ config })

  const tutorials = await payload.find({
    collection: 'tutorials',
  })

  return tutorials.docs
}, ['tutorials'])

export const getTutorialBySlug = async (tutorialSlug: string): Promise<Tutorial> => {
  const cached = unstable_cache(
    async (tutorialSlug: string) => {
      const payload = await getPayload({ config })

      const tutorial = await payload.find({
        collection: 'tutorials',
        where: { slug: { equals: tutorialSlug } },
      })

      return tutorial.docs[0]
    },
    ['tutorials-by-slug', tutorialSlug],
    {
      tags: [`tutorial-${tutorialSlug}`],
      revalidate: EVERY_DAY,
    },
  )
  return cached(tutorialSlug)
}

export const getTutorialArticles = async (tutorialSlug: string): Promise<Article[]> => {
  const cached = unstable_cache(
    async (tutorialSlug: string) => {
      const tutorial = await getTutorialBySlug(tutorialSlug)

      const articles = tutorial.sections.flatMap((section) => (section.articles as Article[]))

      return articles
    },
    ['tutorial-articles', tutorialSlug],
    {
      tags: [`tutorial-articles-${tutorialSlug}`],
      revalidate: EVERY_DAY,
    },
  )
  return cached(tutorialSlug)
}

export const getTutorialReferenceArticles = async (tutorialSlug: string): Promise<Article[]> => {
  const cached = unstable_cache(
    async (tutorialSlug: string) => {
      const tutorial = await getTutorialBySlug(tutorialSlug)

      const referenceArticles = tutorial.referenceSections?.flatMap((section) => (section.articles as Article[])) ?? []

      return referenceArticles
    },
    ['tutorial-reference-articles', tutorialSlug],
    {
      tags: [`tutorial-reference-articles-${tutorialSlug}`],
      revalidate: EVERY_DAY,
    },
  )
  return cached(tutorialSlug)
}

// TODO: In the future, we should modify the Articles collection to include the tutorial. It could help us avoid the loop through the sections. 
export const getArticleBySlug = async (tutorialSlug: string, articleSlug: string): Promise<Article> => {
    const cached = unstable_cache(
        async (tutorialSlug: string, articleSlug: string) => {
            const articles = await getTutorialArticles(tutorialSlug)
            const article = articles.find((article) => article.slug === articleSlug)

            if (!article) {
                throw new Error('Article not found')
            }

            return article
            
        },
        ['article-by-slug', tutorialSlug, articleSlug],
        {
            tags: [`article-by-slug-${tutorialSlug}-${articleSlug}`],
            revalidate: EVERY_DAY,
        },
    )
    return cached(tutorialSlug, articleSlug)
}

export const getReferenceArticleBySlug = async (tutorialSlug: string, referenceSlug: string): Promise<Article> => {
  const cached = unstable_cache(
    async (tutorialSlug: string, referenceSlug: string) => {
      const referenceArticles = await getTutorialReferenceArticles(tutorialSlug)    
      const article = referenceArticles.find((article) => article.slug === referenceSlug)

      if (!article) {
        throw new Error('Article not found')
      }

      return article
    },
    ['reference-article-by-slug', tutorialSlug, referenceSlug],
    {
      tags: [`reference-article-by-slug-${tutorialSlug}-${referenceSlug}`],
      revalidate: EVERY_DAY,
    },
  )
  return cached(tutorialSlug, referenceSlug)
}


export const getTutorialsArticles = async (): Promise<
  {
    tutorial: Tutorial
    articles: Article[]
  }[]
> => {
  const tutorials = await getTutorials()

  return Promise.all(
    tutorials.map(async (tutorial) => {
      const articles = await getTutorialArticles(tutorial.slug)
      return {
        tutorial,
        articles,
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
      const tutorials = await getTutorials()

      return Promise.all(tutorials.map(async (tutorial) => {
        const referenceArticles = await getTutorialReferenceArticles(tutorial.slug)
        return {
          tutorial,
          referenceArticles,
        }
      }))
    },
    ['tutorials-reference-articles'],
    {
      tags: [`tutorials-reference-articles`],
      revalidate: EVERY_DAY,
    },
  )
  return cached()
}
