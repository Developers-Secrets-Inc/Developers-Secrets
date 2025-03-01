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

const CHUNK_SIZE = 2

export async function fetchArticlesChunk(startIndex: number = 0) {
  try {
    const payload = await getPayload({ config })

    // Fetch tutorials with pagination directly from Payload
    const tutorials = await payload.find({
      collection: 'tutorials',
      depth: 1,
    })

    const articles: ArticleWithTutorialInfo[] = []
    let count = 0
    let skipped = 0

    // Process each tutorial
    for (const tutorial of tutorials.docs) {
      const tutorialSlug = getSlugFromTitle(tutorial.title)

      // Helper function to process articles from sections
      const processArticles = (section: any, type: 'tutorial' | 'examples' | 'references') => {
        if (!section?.articles) return

        for (const article of section.articles) {
          if (typeof article === 'object' && article !== null) {
            // Skip articles before startIndex
            if (skipped < startIndex) {
              skipped++
              continue
            }

            // Stop if we have enough articles for this chunk
            if (articles.length >= CHUNK_SIZE) {
              count++
              continue
            }

            articles.push({
              ...article,
              _tutorial: {
                slug: tutorialSlug,
                type,
                originalId: article.id, // Store the original ID
              },
            })
            count++
          }
        }
      }

      // Process each type of section
      if (tutorial.sections) {
        tutorial.sections.forEach((section) => processArticles(section, 'tutorial'))
      }
      if (tutorial.exampleSections) {
        tutorial.exampleSections.forEach((section) => processArticles(section, 'examples'))
      }
      if (tutorial.referenceSections) {
        tutorial.referenceSections.forEach((section) => processArticles(section, 'references'))
      }
    }

    // Transform articles for client
    const articlesWithTutorial = articles.map((article) => {
      const tutorialInfo = article._tutorial
      const articleSlug = getSlugFromTitle(article.title)
      const path = `/articles/${tutorialInfo.slug}/${tutorialInfo.type !== 'tutorial' ? `${tutorialInfo.type}/` : ''}${articleSlug}`

      return {
        id: `${tutorialInfo.slug}-${tutorialInfo.type}-${tutorialInfo.originalId}`,
        title: article.title,
        subtitle: article.subtitle || undefined,
        tutorialSlug: tutorialInfo.slug,
        type: tutorialInfo.type,
        url: path,
        searchKey: `${article.title} ${article.subtitle || ''} ${tutorialInfo.slug}`.toLowerCase(),
      }
    })

    return {
      articles: articlesWithTutorial,
      hasMore: count > startIndex + CHUNK_SIZE,
      total: count,
      nextIndex: count > startIndex + CHUNK_SIZE ? startIndex + CHUNK_SIZE : null,
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
