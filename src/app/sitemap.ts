import { MetadataRoute } from 'next'
import { getAllArticles, getTutorials, getSlugFromTitle } from '@/core/articles'

// Base URL from environment variable or default to localhost in development
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all tutorials
  const tutorials = await getTutorials()

  // Get all articles with their tutorial mapping
  const { articles, tutorialMapping } = await getAllArticles()

  // Create sitemap entries for static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Add other static pages here
  ]

  // Create sitemap entries for tutorials
  const tutorialPages: MetadataRoute.Sitemap = tutorials.map((tutorial) => ({
    url: `${baseUrl}/articles/${tutorial.slug}`,
    lastModified: new Date(tutorial.metadata.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Create sitemap entries for articles
  const articlePages: MetadataRoute.Sitemap = articles
    .map((article) => {
      const tutorialInfo = tutorialMapping[String(article.id)]
      if (!tutorialInfo) return null

      const { tutorialSlug, type } = tutorialInfo
      const articleSlug = article.slug || getSlugFromTitle(article.title)

      // Build the URL based on article type
      let url = `${baseUrl}/articles/${tutorialSlug}`
      if (type === 'tutorial') {
        url += `/${articleSlug}`
      } else if (type === 'examples') {
        url += `/examples/${articleSlug}`
      } else if (type === 'references') {
        url += `/references/${articleSlug}`
      }

      return {
        url,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  // Combine all sitemap entries
  return [...staticPages, ...tutorialPages, ...articlePages]
}
