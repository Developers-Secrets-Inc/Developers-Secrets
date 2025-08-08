export const experimental_ppr = true
import { ArticleOutline } from '../../(article)/[article_slug]/components/article-outline'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react'
import { ArticleContent, ArticleSkeleton } from '../../components/article-content'
import { ArticleSidebar } from '../../components/article-sidebar'
import { ArticleHeader } from '../../components/article-header'
import { HeaderPlaceholder } from '@/components/layout/header-placeholder'
import { notFound } from 'next/navigation'
import { isFailure } from '@/lib/result'
import { getExampleArticleBySlug } from '@/api/articles'
import { getArticleOutline } from '@/api/articles/navigation'
import { isNone } from '@/lib/maybe'
import { getPersonalizedArticles, getPopularArticles } from '@/api/articles/recommandations'
import { ChatActivationButton } from '@/api/articles/ai/components/chat-activation-button'

// export async function generateMetadata(
//   { params }: { params: Promise<{ tutorial_slug: string; example_slug: string }> },
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   const { tutorial_slug, example_slug } = await params

//   try {
//     // Get the tutorial and article data (Payload structure)
//     const payloadArticle = await getExampleArticleBySlug(tutorial_slug, example_slug)

//     if (isNone(payloadArticle)) {
//       throw payloadArticle.error
//     }

//     const article = payloadArticle.value

//     // Get the parent metadata
//     const previousImages = (await parent).openGraph?.images || []

//     // Prepare SEO title - use SEO title if available, otherwise use article title
//     const title = article.seo?.title || article.title
//     const fullTitle = `${title} | Examples | ${article.title}`

//     // Prepare SEO description
//     const description =
//       article.seo?.description ||
//       article.subtitle ||
//       `Practical examples of ${article.title} in our tutorial.`

//     // Prepare keywords
//     const keywords =
//       article.seo?.keywords?.map((k) => k.keyword).filter((k): k is string => !!k) || []

//     return {
//       title: fullTitle,
//       description: description,
//       keywords: keywords,
//       openGraph: {
//         title: fullTitle,
//         description: description,
//         type: 'article',
//         publishedTime: article.createdAt,
//         modifiedTime: article.updatedAt,
//         url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${tutorial_slug}/examples/${example_slug}`,
//         images: previousImages,
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: fullTitle,
//         description: description,
//       },
//     }
//   } catch (error) {
//     // Return basic metadata if there's an error
//     return {
//       title: 'Example',
//       description: 'Practical examples from our comprehensive tutorials',
//     }
//   }
// }

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; example_slug: string }>
}) {
  const { tutorial_slug, example_slug } = await params

  // Get the tutorial, article, and related data
  const article = await getExampleArticleBySlug(tutorial_slug, example_slug)

  if (isNone(article)) return notFound()

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
        <ArticleContent
          article={article.value}
          popularArticles={popularArticles.value}
          personalizedArticles={personalizedArticles.value}
          tutorial_slug={tutorial_slug}
        />
        <ArticleOutline outline={outline} />
      </div>
      <ChatActivationButton
        tutorialSlug={tutorial_slug}
        articleSlug={example_slug}
        tutorialTitle={tutorial_slug}
        articleTitle={article.value.title}
        articleFullContent={article.value.content}
      />
    </>
  )
}
