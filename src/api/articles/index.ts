import { Tutorial, Article } from '@/payload-types'
import { find } from '..'
import { failure, Result, success } from '@/lib/result'

type FormattedArticle = {
  id: number
  title: string
  slug: string
}

type Section = {
  id?: string | null
  title: string
  description?: string | null
  articles: FormattedArticle[]
}

type UnformatedSections = Tutorial['sections']

export const getSectionsArticles = async (
  initialSections: UnformatedSections,
): Promise<Section[]> => {
  const getArticle = async (articleId: number): Promise<FormattedArticle> => {
    const payloadArticles = await find({
      collection: 'articles',
      where: { id: { equals: articleId } },
      select: {
        title: true,
        slug: true,
      },
    })

    return payloadArticles.docs[0]
  }

  const sectionsWithArticlesPromises = initialSections.map((section) => {
    return {
      id: section.id,
      title: section.title,
      description: section.description,
      articles: Promise.all(
        section.articles.map(async (article) => {
          return typeof article === 'number'
            ? await getArticle(article)
            : await getArticle(article.id)
        }),
      ),
    }
  })

  const resolvedSections = await Promise.all(
    sectionsWithArticlesPromises.map(async (section) => {
      return {
        ...section,
        articles: await section.articles,
      }
    }),
  )

  return resolvedSections
}

export const getFirstTutorialArticle = async (
  tutorialSlug: string,
): Promise<{
  id: number
  slug: string
}> => {
  const docs = await find({
    collection: 'tutorials',
    where: { slug: { equals: tutorialSlug } },
    select: { sections: { articles: true } },
  })

  const tutorial = docs.docs[0]
  const firstArticle = tutorial.sections[0].articles[0]

  const articlesDocs = await find({
    collection: 'articles',
    where: { id: { equals: typeof firstArticle === 'number' ? firstArticle : firstArticle.id } },
  })

  const article = articlesDocs.docs[0]

  if (!article) {
    throw new Error(
      `Article with ID ${typeof firstArticle === 'number' ? firstArticle : firstArticle.id} not found.`,
    )
  }

  return { id: article.id, slug: article.slug }
}

export const getFirstExampleArticle = async (
  tutorialSlug: string,
): Promise<{
  id: number
  slug: string
}> => {
  const docs = await find({
    collection: 'tutorials',
    where: { slug: { equals: tutorialSlug } },
    select: { exampleSections: { articles: true } },
  })

  const tutorial = docs.docs[0]

  if (!tutorial.exampleSections) {
    throw new Error(`No example sections for this tutorial`)
  }

  const firstArticle = tutorial.exampleSections[0].articles[0]

  const articlesDocs = await find({
    collection: 'articles',
    where: { id: { equals: typeof firstArticle === 'number' ? firstArticle : firstArticle.id } },
  })

  const article = articlesDocs.docs[0]

  if (!article) {
    throw new Error(
      `Article with ID ${typeof firstArticle === 'number' ? firstArticle : firstArticle.id} not found.`,
    )
  }

  return { id: article.id, slug: article.slug }
}

export const getFirstReferenceArticle = async (
  tutorialSlug: string,
): Promise<{
  id: number
  slug: string
}> => {
  const docs = await find({
    collection: 'tutorials',
    where: { slug: { equals: tutorialSlug } },
    select: { referenceSections: { articles: true } },
  })

  const tutorial = docs.docs[0]

  if (!tutorial.referenceSections) {
    throw new Error(`No references sections for this tutorial`)
  }

  const firstArticle = tutorial.referenceSections[0].articles[0]

  const articlesDocs = await find({
    collection: 'articles',
    where: { id: { equals: typeof firstArticle === 'number' ? firstArticle : firstArticle.id } },
  })

  const article = articlesDocs.docs[0]

  if (!article) {
    throw new Error(
      `Article with ID ${typeof firstArticle === 'number' ? firstArticle : firstArticle.id} not found.`,
    )
  }

  return { id: article.id, slug: article.slug }
}

export const getTutorialForLayout = async (
  tutorialSlug: string,
): Promise<Result<Tutorial, Error>> => {
  const result = await find({
    collection: 'tutorials',
    where: { slug: { equals: tutorialSlug } },
    depth: 0,
  })

  if (!result.docs[0]) {
    return failure(new Error(`Tutorial with slug ${tutorialSlug} not found.`))
  }

  const tutorial = result.docs[0]
  return success(tutorial)
}
