export const experimental_ppr = true
import { HeaderPlaceholder } from '@/components/layout/header-placeholder'
import { getArticleOutline } from '@/core/articles'
import { ChatActivationButton } from '@/core/articles/components/chat-activation-button'
import { getReferenceArticleBySlug } from '@/core/articles/index-v2'
import { getPersonalizedArticles, getPopularArticles } from '@/core/articles/recommandations-v2'
import { isFailure } from '@/lib/result'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArticleOutline } from '../../(article)/[article_slug]/components/article-outline'
import { ArticleContent, ArticleSkeleton } from '../../components/article-content'
import { ArticleHeader } from '../../components/article-header'

export async function generateMetadata(
  { params }: { params: Promise<{ tutorial_slug: string; reference_slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { tutorial_slug, reference_slug } = await params

  const payloadArticle = await getReferenceArticleBySlug(tutorial_slug, reference_slug, {
    seo: true,
    title: true,
    subtitle: true,
    createdAt: true,
    updatedAt: true,
  })

  if (isFailure(payloadArticle)) {
    throw payloadArticle.error
  }

  const article = payloadArticle.value

  // Get the parent metadata
  const previousImages = (await parent).openGraph?.images || []

  // Prepare SEO title - use SEO title if available, otherwise use article title
  const title = article.seo?.title || article.title
  const fullTitle = `${title} | Reference`

  // Prepare SEO description
  const description =
    article.seo?.description ||
    article.subtitle ||
    `Reference guide for ${article.title} in our tutorial.`

  const keywords =
    article.seo?.keywords?.map((k) => k.keyword).filter((k): k is string => !!k) || []

  return {
    title: fullTitle,
    description: description,
    keywords: keywords,
    openGraph: {
      title: fullTitle,
      description: description,
      type: 'article',
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${tutorial_slug}/references/${reference_slug}`,
      images: previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
    },
  }
}

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; reference_slug: string }>
}) {
  const { tutorial_slug, reference_slug } = await params

  const article = await getReferenceArticleBySlug(tutorial_slug, reference_slug, {
    content: true,
    title: true,
    subtitle: true,
  })
  if (isFailure(article)) {
    return notFound()
  }
  const outline = getArticleOutline(article.value.content)

  const [popularArticles, personalizedArticles] = await Promise.all([
    getPopularArticles(tutorial_slug, article.value.id, 1, {
      id: true,
      title: true,
      subtitle: true,
      slug: true,
    }),
    getPersonalizedArticles(tutorial_slug, article.value.id, 3, {
      id: true,
      title: true,
      subtitle: true,
      slug: true,
    }),
  ])

  if (isFailure(popularArticles) || isFailure(personalizedArticles)) {
    throw new Error(
      `An error occured trying to load popular articles : ${popularArticles} and personalized articles ${personalizedArticles}`,
    )
  }

  return (
    <>
      <Suspense fallback={<HeaderPlaceholder />}>
        <ArticleHeader />
      </Suspense>
      <div className="flex flex-1">
        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleContent
            article={article.value}
            popularArticles={popularArticles.value}
            personalizedArticles={personalizedArticles.value}
            tutorial_slug={tutorial_slug}
          />
        </Suspense>
        <ArticleOutline outline={outline} />
      </div>
      <ChatActivationButton
        tutorialSlug={tutorial_slug}
        articleSlug={reference_slug}
        tutorialTitle={tutorial_slug}
        articleTitle={article.value.title}
        articleFullContent={article.value.content}
      />
    </>
  )
}
