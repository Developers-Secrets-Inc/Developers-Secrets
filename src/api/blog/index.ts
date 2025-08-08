'use server'

import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

// Internal cached function for fetching a single blog article by slug
const getCachedBlogArticleBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })

      try {
        const { docs } = await payload.find({
          collection: 'blog-articles',
          where: {
            slug: {
              equals: slug,
            },
          },
          limit: 1,
        })

        if (docs.length === 0) {
          return { success: false, error: 'Article not found' }
        }

        return { success: true, value: docs[0] }
      } catch (error) {
        console.error('Error fetching blog article by slug:', error)
        return { success: false, error: 'Failed to fetch article' }
      }
    },
    [`blog-article-by-slug-${slug}`], // Unique key for this specific article's slug
    { revalidate: 5 }, // Revalidate every hour
  )

// Public function to get a blog article by slug
export const getBlogArticleBySlug = async (slug: string) => {
  return await getCachedBlogArticleBySlug(slug)()
}

// Internal cached function for fetching all blog articles
const getCachedAllBlogArticles = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    try {
      const { docs } = await payload.find({
        collection: 'blog-articles',
        sort: '-publishedAt', // Sort by most recent
      })

      return { success: true, value: docs }
    } catch (error) {
      console.error('Error fetching all blog articles:', error)
      return { success: false, error: 'Failed to fetch articles' }
    }
  },
  ['all-blog-articles'], // Key for caching all articles
  { revalidate: 3600 }, // Revalidate every hour
)

// Public function to get all blog articles
export const getAllBlogArticles = async () => {
  return await getCachedAllBlogArticles()
}
