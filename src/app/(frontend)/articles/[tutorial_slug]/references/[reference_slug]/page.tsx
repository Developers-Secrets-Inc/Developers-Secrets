export const experimental_ppr = true
import { ArticleOutline } from '../../[article_slug]/components/article-outline'
import { HeaderPlaceholder } from '@/components/layout/header-placeholder'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  convertPayloadArticleToArticle,
  convertPayloadTutorialToTutorial,
  getArticleOutline,
  getReferenceArticle,
  getTutorial,
} from '@/core/articles'
import {
  getReferenceArticleBySlug,
  getTutorialBySlug,
  getTutorialReferenceArticles,
  getTutorialsReferenceArticles,
} from '@/core/articles/index-v2'
import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react'
import { ArticleContent, ArticleSkeleton } from '../../components/article-content'
import { ArticleHeader } from '../../components/article-header'
import { ArticleSidebar } from '../../components/article-sidebar'
import { ChatActivationButton } from '@/core/articles/components/chat-activation-button'
import { getPopularArticles, getPersonalizedArticles } from '@/core/articles/recommandations-v2'

// Revalidate content every hour
export const revalidate = 3600

// Allow dynamic params for references not in generateStaticParams
export const dynamicParams = true

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ tutorial_slug: string; reference_slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { tutorial_slug, reference_slug } = await params

  try {
    // Get the tutorial and article data
    const payloadTutorial = await getTutorial(tutorial_slug)
    const payloadArticle = await getReferenceArticle(tutorial_slug, reference_slug)

    // Convert to our custom types
    const tutorial = convertPayloadTutorialToTutorial(payloadTutorial)
    const article = convertPayloadArticleToArticle(payloadArticle)

    // Get the parent metadata
    const previousImages = (await parent).openGraph?.images || []

    // Prepare SEO title - use SEO title if available, otherwise use article title
    const title = article.seo?.title || article.title
    const fullTitle = `${title} | Reference | ${tutorial.title}`

    // Prepare SEO description
    const description =
      article.seo?.description ||
      article.subtitle ||
      `Reference guide for ${article.title} in our ${tutorial.title} tutorial.`

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
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${tutorial_slug}/references/${reference_slug}`,
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
      title: 'Reference',
      description: 'Reference guides from our comprehensive tutorials',
    }
  }
}

export const generateStaticParams = async (): Promise<
  { tutorial_slug: string; reference_slug: string }[]
> => {
  const tutorialsReferenceArticles = await getTutorialsReferenceArticles()

  return tutorialsReferenceArticles.flatMap(({ tutorial, referenceArticles }) =>
    referenceArticles.map((article) => ({
      tutorial_slug: tutorial.slug,
      reference_slug: article.slug,
    })),
  )
}

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; reference_slug: string }>
}) {
  const { tutorial_slug, reference_slug } = await params

  const [tutorial, article, articles] = await Promise.all([
    getTutorialBySlug(tutorial_slug),
    getReferenceArticleBySlug(tutorial_slug, reference_slug),
    getTutorialReferenceArticles(tutorial_slug),
  ])

  // Get the article outline
  const outline = getArticleOutline(article.content)

  // Get recommended articles with cache tags

  const [popularArticles, personalizedArticles] = await Promise.all([
    getPopularArticles(tutorial_slug, article.id, 1),
    getPersonalizedArticles(tutorial_slug, article.id, 3),
  ])

  return (
    <SidebarProvider>
      <ArticleSidebar
        tutorial={tutorial}
        articles={articles}
        currentArticleSlug={reference_slug}
        articleType="references"
      />
      <SidebarInset>
        <Suspense fallback={<HeaderPlaceholder />}>
          <ArticleHeader />
        </Suspense>
        <div className="flex flex-1">
          <Suspense fallback={<ArticleSkeleton />}>
            <ArticleContent
              article={article}
              popularArticles={popularArticles}
              personalizedArticles={personalizedArticles}
              tutorial_slug={tutorial_slug}
            />
          </Suspense>
          <ArticleOutline outline={outline} />
        </div>
      </SidebarInset>
      <ChatActivationButton
        tutorialSlug={tutorial_slug}
        articleSlug={reference_slug}
        tutorialTitle={tutorial.title}
        articleTitle={article.title}
        articleFullContent={article.content}
      />
    </SidebarProvider>
  )
}
