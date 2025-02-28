'use server'

import { getAllArticles, getSlugFromTitle } from '@/core/articles'
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

const CHUNK_SIZE = 20 // Nombre d'articles par chunk

export async function fetchArticlesChunk(startIndex: number = 0) {
  try {
    const { articles, tutorialMapping } = await getAllArticles({
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    // Créer un Set pour tracker les IDs uniques
    const seenIds = new Set<string>()

    // Transform the data to only include what's needed on the client
    const articlesWithTutorial = articles
      .filter((article) => {
        const id = String(article.id)
        if (seenIds.has(id)) return false
        seenIds.add(id)
        return true
      })
      .map((article) => {
        const tutorialInfo = tutorialMapping[String(article.id)]
        const articleSlug = getSlugFromTitle(article.title)
        const path = `/articles/${tutorialInfo.tutorialSlug}/${tutorialInfo.type !== 'tutorial' ? `${tutorialInfo.type}/` : ''}${articleSlug}`

        return {
          id: String(article.id),
          title: article.title,
          subtitle: article.subtitle || undefined,
          tutorialSlug: tutorialInfo.tutorialSlug,
          type: tutorialInfo.type,
          url: path,
          searchKey:
            `${article.title} ${article.subtitle || ''} ${tutorialInfo.tutorialSlug}`.toLowerCase(),
        }
      })

    // Retourner le chunk demandé et les informations de pagination
    const chunk = articlesWithTutorial.slice(startIndex, startIndex + CHUNK_SIZE)
    const hasMore = startIndex + CHUNK_SIZE < articlesWithTutorial.length
    const total = articlesWithTutorial.length

    return {
      articles: chunk,
      hasMore,
      total,
      nextIndex: hasMore ? startIndex + CHUNK_SIZE : null,
    }
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

export async function* streamArticles() {
  try {
    const { chunks } = await fetchAllArticles()

    for (const chunk of chunks) {
      // Simuler un délai pour voir l'effet de streaming (à retirer en production)
      await new Promise((resolve) => setTimeout(resolve, 100))
      yield chunk
    }
  } catch (error) {
    console.error('Error streaming articles:', error)
    return []
  }
}
