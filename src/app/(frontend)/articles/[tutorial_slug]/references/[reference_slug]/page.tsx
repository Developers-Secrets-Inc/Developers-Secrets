export const experimental_ppr = true
import { ArticleOutline } from '@/components/article-outline'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  convertPayloadArticleToArticle,
  convertPayloadTutorialToTutorial,
  getArticleOutline,
  getReferenceArticle,
  getPersonalizedArticleRecommendations,
  getPopularArticles,
  getTutorial,
  getTutorialReferenceArticles,
  getTutorials,
} from '@/core/articles'
import { ArticleNotFoundError, TutorialNotFoundError } from '@/core/articles/errors'
import { slugify } from '@/core/format'
import { notFound } from 'next/navigation'
import { ArticleContent } from '../../components/article-content'
import { ArticleSidebar } from '../../components/article-sidebar'
import { ArticleHeader } from '../../components/article-header'
import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react'
import { HeaderPlaceholder } from '@/components/layout/header-placeholder'

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


export default async function ReferencePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; reference_slug: string }>
}) {
  const { tutorial_slug, reference_slug } = await params

  try {
    // Get the tutorial, article, and related data with cache tags
    const payloadTutorial = await getTutorial(tutorial_slug, {
      next: { tags: [`tutorial-${tutorial_slug}`] },
    })

    const payloadArticle = await getReferenceArticle(tutorial_slug, reference_slug, {
      next: { tags: [`reference-article-${tutorial_slug}-${reference_slug}`] },
    })

    const payloadArticles = await getTutorialReferenceArticles(tutorial_slug, {
      next: { tags: [`tutorial-references-${tutorial_slug}`] },
    })

    // Convert to our custom types using the utility functions
    const tutorial = convertPayloadTutorialToTutorial(payloadTutorial)
    const article = convertPayloadArticleToArticle(payloadArticle)
    const articles = payloadArticles.map(convertPayloadArticleToArticle)

    // Get the article outline
    const outline = getArticleOutline(article.content)

    // Get recommended articles with cache tags
    const popularArticles = await getPopularArticles(
      tutorial_slug,
      article.id,
      {
        next: { tags: [`popular-articles-${tutorial_slug}`] },
      },
      2,
    )

    const personalizedArticles = await getPersonalizedArticleRecommendations(
      tutorial_slug,
      article.id,
      {
        next: { tags: [`personalized-articles-${tutorial_slug}`] },
      },
      2,
    )

    return (
      <SidebarProvider>
        <ArticleSidebar
          tutorial={tutorial}
          articles={payloadArticles}
          currentArticleSlug={reference_slug}
          articleType="references"
        />
        <SidebarInset>
          <Suspense fallback={<HeaderPlaceholder />}>
            <ArticleHeader />
          </Suspense>
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
