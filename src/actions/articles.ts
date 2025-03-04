'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getSlugFromTitle } from '@/core/articles'
import { Article as PayloadArticle } from '@/payload-types'

export type ArticleWithTutorial = {
  id: string
  title: string
  subtitle?: string
  tutorialSlug: string
  type: 'tutorial' | 'examples' | 'references'
  url: string
  searchKey: string
}

interface ArticleWithTutorialInfo extends PayloadArticle {
  _tutorial: {
    slug: string
    type: 'tutorial' | 'examples' | 'references'
    originalId: string
  }
}

const CHUNK_SIZE = 10

let tutorialsCache: any[] | null = null
let tutorialsCacheExpiry = 0
const CACHE_TTL = 5 * 60 * 1000

const articlesCache = new Map<string, ArticleWithTutorial[]>()
const articlesCacheExpiry = new Map<string, number>()

async function getCachedTutorials() {
  const now = Date.now()

  if (tutorialsCache && tutorialsCacheExpiry > now) {
    return tutorialsCache
  }

  const payload = await getPayload({ config })
  const tutorials = await payload.find({
    collection: 'tutorials',
    depth: 1,
  })

  tutorialsCache = tutorials.docs
  tutorialsCacheExpiry = now + CACHE_TTL

  return tutorialsCache
}

interface Section {
  title?: string
  articles: (PayloadArticle | number)[]
}

function getCachedArticlesResult(startIndex: number) {
  const cacheKey = `articles-${startIndex}-${CHUNK_SIZE}`
  const now = Date.now()

  if (articlesCache.has(cacheKey) && (articlesCacheExpiry.get(cacheKey) || 0) > now) {
    const cachedResult = articlesCache.get(cacheKey)!
    return {
      articles: cachedResult,
      hasMore: cachedResult.length === CHUNK_SIZE,
      total: startIndex + cachedResult.length + (cachedResult.length === CHUNK_SIZE ? 1 : 0),
      nextIndex: cachedResult.length === CHUNK_SIZE ? startIndex + CHUNK_SIZE : null,
    }
  }

  return null
}

function cacheArticlesResult(startIndex: number, articlesWithTutorial: ArticleWithTutorial[]) {
  const cacheKey = `articles-${startIndex}-${CHUNK_SIZE}`
  const now = Date.now()

  articlesCache.set(cacheKey, articlesWithTutorial)
  articlesCacheExpiry.set(cacheKey, now + CACHE_TTL)
}

function collectArticleFromSection(
  article: any,
  tutorialSlug: string,
  type: 'tutorial' | 'examples' | 'references',
): ArticleWithTutorialInfo | null {
  if (typeof article === 'object' && article !== null) {
    const slug =
      article.slug || (article.title ? getSlugFromTitle(article.title) : `article-${article.id}`)

    return {
      ...article,
      slug,
      _tutorial: {
        slug: tutorialSlug,
        type,
        originalId: String(article.id),
      },
    }
  }
  return null
}

function processSection(
  section: Section,
  type: 'tutorial' | 'examples' | 'references',
  tutorialSlug: string,
): ArticleWithTutorialInfo[] {
  if (!section?.articles) return []

  const sectionArticles: ArticleWithTutorialInfo[] = []

  for (const article of section.articles) {
    const processedArticle = collectArticleFromSection(article, tutorialSlug, type)
    if (processedArticle) {
      sectionArticles.push(processedArticle)
    }
  }

  return sectionArticles
}

function collectArticlesFromTutorial(
  tutorial: any,
  tutorialSlug: string,
): ArticleWithTutorialInfo[] {
  const allArticles: ArticleWithTutorialInfo[] = []

  if (tutorial.sections) {
    tutorial.sections.forEach((section: Section) => {
      allArticles.push(...processSection(section, 'tutorial', tutorialSlug))
    })
  }

  if (tutorial.exampleSections) {
    tutorial.exampleSections.forEach((section: Section) => {
      allArticles.push(...processSection(section, 'examples', tutorialSlug))
    })
  }

  if (tutorial.referenceSections) {
    tutorial.referenceSections.forEach((section: Section) => {
      allArticles.push(...processSection(section, 'references', tutorialSlug))
    })
  }

  return allArticles
}

function transformArticleForClient(article: ArticleWithTutorialInfo): ArticleWithTutorial {
  const tutorialInfo = article._tutorial
  const articleSlug = article.slug
  const path = `/articles/${tutorialInfo.slug}/${tutorialInfo.type !== 'tutorial' ? `${tutorialInfo.type}/` : ''}${articleSlug}`

  return {
    id: `${tutorialInfo.slug}-${tutorialInfo.type}-${tutorialInfo.originalId}-${articleSlug}`,
    title: article.title,
    subtitle: article.subtitle || undefined,
    tutorialSlug: tutorialInfo.slug,
    type: tutorialInfo.type,
    url: path,
    searchKey: `${article.title} ${article.subtitle || ''} ${tutorialInfo.slug}`.toLowerCase(),
  }
}

function paginateAndTransformArticles(
  allArticles: ArticleWithTutorialInfo[],
  startIndex: number,
): ArticleWithTutorial[] {
  const paginatedArticles = allArticles.slice(startIndex, startIndex + CHUNK_SIZE)
  return paginatedArticles.map(transformArticleForClient)
}

function createArticlesResponse(
  articlesWithTutorial: ArticleWithTutorial[],
  allArticles: ArticleWithTutorialInfo[],
  startIndex: number,
) {
  return {
    articles: articlesWithTutorial,
    hasMore: startIndex + CHUNK_SIZE < allArticles.length,
    total: allArticles.length,
    nextIndex: startIndex + CHUNK_SIZE < allArticles.length ? startIndex + CHUNK_SIZE : null,
  }
}

export async function fetchArticlesChunk(startIndex: number = 0) {
  try {
    const cachedResult = getCachedArticlesResult(startIndex)
    if (cachedResult) return cachedResult

    const tutorials = await getCachedTutorials()
    const allArticles: ArticleWithTutorialInfo[] = []

    const tutorialSlugs = tutorials.map((tutorial) => ({
      tutorial,
      slug: getSlugFromTitle(tutorial.title),
    }))

    for (const { tutorial, slug: tutorialSlug } of tutorialSlugs) {
      const tutorialArticles = collectArticlesFromTutorial(tutorial, tutorialSlug)
      allArticles.push(...tutorialArticles)
    }

    // Dédupliquer les articles en utilisant un Map avec l'ID original comme clé
    const uniqueArticlesMap = new Map<string, ArticleWithTutorialInfo>()

    for (const article of allArticles) {
      const uniqueKey = `${article._tutorial.slug}-${article._tutorial.type}-${article._tutorial.originalId}-${article.slug}`

      // Ne garder que la première occurrence de chaque article
      if (!uniqueArticlesMap.has(uniqueKey)) {
        uniqueArticlesMap.set(uniqueKey, article)
      }
    }

    // Convertir le Map en tableau
    const uniqueArticles = Array.from(uniqueArticlesMap.values())

    const articlesWithTutorial = paginateAndTransformArticles(uniqueArticles, startIndex)
    cacheArticlesResult(startIndex, articlesWithTutorial)

    return createArticlesResponse(articlesWithTutorial, uniqueArticles, startIndex)
  } catch (error) {
    console.error('Error fetching articles chunk:', error)
    return {
      articles: [],
      hasMore: false,
      total: 0,
      nextIndex: null,
    }
  }
}

export async function invalidateArticlesCache() {
  tutorialsCache = null
  articlesCache.clear()
  articlesCacheExpiry.clear()
}
