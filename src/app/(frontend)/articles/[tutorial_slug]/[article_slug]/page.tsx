import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  convertPayloadArticleToArticle,
  convertPayloadTutorialToTutorial,
  getArticle,
  getArticleOutline,
  getPersonalizedArticleRecommendations,
  getPopularArticles,
  getTutorial,
  getTutorialArticles,
  getTutorials,
} from '@/core/articles'
import { ArticleNotFoundError, TutorialNotFoundError } from '@/core/articles/errors'
import { slugify } from '@/core/format'
import { notFound } from 'next/navigation'
import { ArticleContent } from '../components/article-content'
import { ArticleHeader } from '../components/article-header'
import { ArticleSidebar } from '../components/article-sidebar'
import { ArticleOutline } from './components/article-outline'
import { Metadata, ResolvingMetadata } from 'next'

// Revalidate content every hour
export const revalidate = 3600

// Allow dynamic params for articles not in generateStaticParams
export const dynamicParams = true

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ tutorial_slug: string; article_slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { tutorial_slug, article_slug } = await params

  try {
    // Get the tutorial and article data
    const payloadTutorial = await getTutorial(tutorial_slug)
    const payloadArticle = await getArticle(tutorial_slug, article_slug)

    // Convert to our custom types
    const tutorial = convertPayloadTutorialToTutorial(payloadTutorial)
    const article = convertPayloadArticleToArticle(payloadArticle)

    // Get the parent metadata
    const previousImages = (await parent).openGraph?.images || []

    // Prepare SEO title - use SEO title if available, otherwise use article title
    const title = article.seo?.title || article.title
    const fullTitle = `${title} | ${tutorial.title}`

    // Prepare SEO description
    const description =
      article.seo?.description ||
      article.subtitle ||
      `Learn about ${article.title} in our ${tutorial.title} tutorial.`

    // Prepare keywords
    const keywords = article.seo?.keywords?.map((k) => k.keyword) || []

    return {
      title: fullTitle,
      description: description,
      keywords: keywords,
      openGraph: {
        title: fullTitle,
        description: description,
        type: 'article',
        publishedTime: article.metadata.publishedAt,
        modifiedTime: article.metadata.updatedAt,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${tutorial_slug}/${article_slug}`,
        images: previousImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: description,
      },
    }
  } catch (_error) {
    // Return basic metadata if there's an error
    return {
      title: 'Article',
      description: 'Learn with our comprehensive tutorials',
    }
  }
}

// Pre-generate static params for all known tutorial/article combinations
export async function generateStaticParams() {
  // Get all tutorials
  const tutorials = await getTutorials()

  // For each tutorial, get all its articles
  const params = await Promise.all(
    tutorials.map(async (tutorial) => {
      const tutorialSlug = tutorial.slug
      const articles = await getTutorialArticles(tutorialSlug)

      // Map each article to its params
      return articles.map((article) => ({
        tutorial_slug: tutorialSlug,
        article_slug: slugify(article.title),
      }))
    }),
  )

  // Flatten the array of arrays
  return params.flat()
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; article_slug: string }>
}) {
  const { tutorial_slug, article_slug } = await params

  try {
    // Get the tutorial, article, and related data with cache tags
    const payloadTutorial = await getTutorial(tutorial_slug, {
      next: { tags: [`tutorial-${tutorial_slug}`] },
    })

    const payloadArticle = await getArticle(tutorial_slug, article_slug, {
      next: { tags: [`article-${tutorial_slug}-${article_slug}`] },
    })

    const payloadArticles = await getTutorialArticles(tutorial_slug, {
      next: { tags: [`tutorial-articles-${tutorial_slug}`] },
    })

    // Convert to our custom types using the utility functions
    const tutorial = convertPayloadTutorialToTutorial(payloadTutorial)
    const article = convertPayloadArticleToArticle(payloadArticle)

    // Get the article outline
    const outline = getArticleOutline(article.content)

    // Get recommended articles with cache tags
    const popularArticles = await getPopularArticles(
      tutorial_slug,
      article.id,
      {
        next: { tags: [`popular-articles-${tutorial_slug}`] },
      },
      1,
    )

    const personalizedArticles = await getPersonalizedArticleRecommendations(
      tutorial_slug,
      article.id,
      {
        next: { tags: [`personalized-articles-${tutorial_slug}`] },
      },
      3,
    )

    return (
      <SidebarProvider>
        <ArticleSidebar
          tutorial={tutorial}
          currentArticleSlug={article_slug}
          articles={payloadArticles}
          articleType="tutorial"
        />
        <SidebarInset>
          <ArticleHeader />
          <div className="flex flex-1">
            <ArticleContent
              article={article}
              popularArticles={popularArticles.map(convertPayloadArticleToArticle)}
              personalizedArticles={personalizedArticles.map(convertPayloadArticleToArticle)}
              tutorial_slug={tutorial_slug}
            />

            <ArticleOutline outline={outline} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  } catch (error) {
    if (error instanceof ArticleNotFoundError || error instanceof TutorialNotFoundError) {
      notFound()
    }
    throw error
  }
}
