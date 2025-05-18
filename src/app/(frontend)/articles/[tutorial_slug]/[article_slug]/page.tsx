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
import { ArticleSidebar } from '../components/article-sidebar'
import { ArticleOutline } from './components/article-outline'
import { Metadata, ResolvingMetadata } from 'next'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { Suspense } from 'react'
import { HeaderPlaceholder } from '@/components/layout/header-placeholder'
import { ChatActivationButton } from '@/core/articles/components/chat-activation-button'

// Revalidate content every hour
export const revalidate = 3600
export const experimental_ppr = true

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


// Ajout d'un skeleton minimal pour ArticleContent
function ArticleSkeleton() {
  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="flex w-full flex-1 flex-col gap-6 px-4 pt-8 pb-12 md:px-6 md:pt-12 xl:px-12 xl:mx-auto max-w-[860px]">
        <div className="prose prose-slate max-w-none animate-pulse">
          <div className="h-10 w-2/3 bg-muted rounded mb-4" />
          <div className="h-5 w-1/2 bg-muted rounded mb-6" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      </div>
    </main>
  )
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; article_slug: string }>
}) {
  const { tutorial_slug, article_slug } = await params

  try {
    // Get the tutorial, article, and related data with cache tags
    const [payloadTutorial, payloadArticle, payloadArticles] = await Promise.all([
      getTutorial(tutorial_slug, { next: { tags: [`tutorial-${tutorial_slug}`] } }),
      getArticle(tutorial_slug, article_slug, {
        next: { tags: [`article-${tutorial_slug}-${article_slug}`] },
      }),
      getTutorialArticles(tutorial_slug, {
        next: { tags: [`tutorial-articles-${tutorial_slug}`] },
      }),
    ])

    // Convert to our custom types using the utility functions
    const tutorial = convertPayloadTutorialToTutorial(payloadTutorial)
    const article = convertPayloadArticleToArticle(payloadArticle)

    // Get the article outline
    const outline = getArticleOutline(article.content)

    // Get recommended articles with cache tags
    const [popularArticles, personalizedArticles] = await Promise.all([
      getPopularArticles(
        tutorial_slug,
        article.id,
        { next: { tags: [`popular-articles-${tutorial_slug}`] } },
        1,
      ),
      getPersonalizedArticleRecommendations(
        tutorial_slug,
        article.id,
        { next: { tags: [`personalized-articles-${tutorial_slug}`] } },
        3,
      ),
    ])

    return (
      <SidebarProvider>
        <ArticleSidebar
          tutorial={tutorial}
          currentArticleSlug={article_slug}
          articles={payloadArticles}
          articleType="tutorial"
        />
        <SidebarInset>
          <Suspense fallback={<HeaderPlaceholder />}>
            <HomeHeader />
          </Suspense>
          <div className="flex flex-1">
            <Suspense fallback={<ArticleSkeleton />}>
              <ArticleContent
                article={article}
                popularArticles={popularArticles.map(convertPayloadArticleToArticle)}
                personalizedArticles={personalizedArticles.map(convertPayloadArticleToArticle)}
                tutorial_slug={tutorial_slug}
              />
            </Suspense>
            <ArticleOutline outline={outline} />
          </div>
        </SidebarInset>
        <ChatActivationButton
          tutorialSlug={tutorial_slug}
          articleSlug={article_slug}
          tutorialTitle={tutorial.title}
          articleTitle={article.title}
          articleFullContent={article.content}
        />
      </SidebarProvider>
    )
  } catch (error) {
    if (error instanceof ArticleNotFoundError || error instanceof TutorialNotFoundError) {
      notFound()
    }
    throw error
  }
}
