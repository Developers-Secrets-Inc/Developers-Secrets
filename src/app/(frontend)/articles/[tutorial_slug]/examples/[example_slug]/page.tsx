export const experimental_ppr = true
import { ArticleOutline } from '../../[article_slug]/components/article-outline'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  getExampleArticleBySlug,
  getFirstExampleArticle,
  getTutorialBySlug,
  getTutorialExamplesArticles,
  getTutorials,
} from '@/core/articles/index-v2'
import { getArticleOutline } from '@/core/articles'
import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react'
import { ArticleContent, ArticleSkeleton } from '../../components/article-content'
import { ArticleSidebar } from '../../components/article-sidebar'
import { ArticleHeader } from '../../components/article-header'
import { HeaderPlaceholder } from '@/components/layout/header-placeholder'
import { ChatActivationButton } from '@/core/articles/components/chat-activation-button'
import { getPopularArticles, getPersonalizedArticles } from '@/core/articles/recommandations-v2'
import { notFound } from 'next/navigation'

// Revalidate content every hour
export const revalidate = 3600

// Allow dynamic params for examples not in generateStaticParams
export const dynamicParams = true

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ tutorial_slug: string; example_slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { tutorial_slug, example_slug } = await params

  try {
    // Get the tutorial and article data (Payload structure)
    const payloadTutorial = await getTutorialBySlug(tutorial_slug)
    const payloadArticle = await getExampleArticleBySlug(tutorial_slug, example_slug)

    // Get the parent metadata
    const previousImages = (await parent).openGraph?.images || []

    // Prepare SEO title - use SEO title if available, otherwise use article title
    const title = payloadArticle.seo?.title || payloadArticle.title
    const fullTitle = `${title} | Examples | ${payloadTutorial.title}`

    // Prepare SEO description
    const description =
      payloadArticle.seo?.description ||
      payloadArticle.subtitle ||
      `Practical examples of ${payloadArticle.title} in our ${payloadTutorial.title} tutorial.`

    // Prepare keywords
    const keywords =
      payloadArticle.seo?.keywords?.map((k) => k.keyword).filter((k): k is string => !!k) || []

    return {
      title: fullTitle,
      description: description,
      keywords: keywords,
      openGraph: {
        title: fullTitle,
        description: description,
        type: 'article',
        publishedTime: payloadArticle.createdAt,
        modifiedTime: payloadArticle.updatedAt,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${tutorial_slug}/examples/${example_slug}`,
        images: previousImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: description,
      },
    }
  } catch (error) {
    // Return basic metadata if there's an error
    return {
      title: 'Example',
      description: 'Practical examples from our comprehensive tutorials',
    }
  }
}

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; example_slug: string }>
}) {
  const { tutorial_slug, example_slug } = await params

  try {
    // Get the tutorial, article, and related data
    const [tutorial, article, articles] = await Promise.all([
      getTutorialBySlug(tutorial_slug),
      getExampleArticleBySlug(tutorial_slug, example_slug),
      getTutorialExamplesArticles(tutorial_slug),
    ])

    // Get the article outline
    const outline = getArticleOutline(article.content)

    // Get recommended articles
    const [popularArticles, personalizedArticles] = await Promise.all([
      getPopularArticles(tutorial_slug, article.id, 2),
      getPersonalizedArticles(tutorial_slug, article.id, 2),
    ])

    return (
      <SidebarProvider>
        <ArticleSidebar
          tutorial={tutorial}
          articles={articles}
          currentArticleSlug={example_slug}
          articleType="examples"
        />
        <SidebarInset>
          <Suspense fallback={<HeaderPlaceholder />}>
            <ArticleHeader />
          </Suspense>
          <div className="flex flex-1">
            <ArticleContent
              article={article}
              popularArticles={popularArticles}
              personalizedArticles={personalizedArticles}
              tutorial_slug={tutorial_slug}
            />
            <ArticleOutline outline={outline} />
          </div>
        </SidebarInset>
        <ChatActivationButton
          tutorialSlug={tutorial_slug}
          articleSlug={example_slug}
          tutorialTitle={tutorial.title}
          articleTitle={article.title}
          articleFullContent={article.content}
        />
      </SidebarProvider>
    )
  } catch (error) {
    notFound()
  }
}
