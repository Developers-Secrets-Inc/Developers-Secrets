'use server'

import { getArticle } from '@/core/articles'

/**
 * Server Action to fetch the content of an article for the AI chat.
 */
export async function getArticleContentForChat(
  tutorialSlug: string,
  articleSlug: string,
): Promise<string> {
  try {
    const article = await getArticle(tutorialSlug, articleSlug)
    // Ensure content is not null or undefined, though PayloadArticle type suggests content is string
    if (typeof article.content !== 'string') {
      throw new Error('Article content is missing or not in the expected format.')
    }
    return article.content
  } catch (error) {
    console.error(`Error in getArticleContentForChat for ${tutorialSlug}/${articleSlug}:`, error)
    // Re-throw a generic error or a more specific one if possible
    // The client-side .catch() will handle this
    throw new Error('Failed to fetch article content for the chat. Please try again later.')
  }
}
