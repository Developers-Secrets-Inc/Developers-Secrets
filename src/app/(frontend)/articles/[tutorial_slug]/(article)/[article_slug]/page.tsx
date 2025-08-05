import { getArticleOutline } from '@/core/articles'
import { ChatActivationButton } from '@/core/articles/components/chat-activation-button'
import { getPersonalizedArticles, getPopularArticles } from '@/core/articles/recommandations-v2'
import { isFailure } from '@/lib/result'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArticleOutline } from './components/article-outline'
import { ArticleContent, ArticleSkeleton } from '../../components/article-content'
import { getArticleBySlug } from '@/api/articles'
import { isNone } from '@/lib/maybe'
import { ArticleSidebarTrigger } from '../../components/sidebar-trigger'

// export async function generateMetadata(
//   { params }: { params: Promise<{ tutorial_slug: string; article_slug: string }> },
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   const { tutorial_slug, article_slug } = await params

//   const payloadArticle = await getArticleBySlug(tutorial_slug, article_slug, {
//     seo: true,
//     title: true,
//     subtitle: true,
//     createdAt: true,
//     updatedAt: true,
//   })

//   if (isFailure(payloadArticle)) {
//     throw payloadArticle.error
//   }

//   const article = payloadArticle.value

//   const previousImages = (await parent).openGraph?.images || []

//   const title = article.seo?.title || article.title
//   const fullTitle = `${title} | ${article.title}`

//   const description =
//     article.seo?.description ||
//     article.subtitle ||
//     `Learn about ${article.title} in our ${article.title} tutorial.`

//   const keywords =
//     article.seo?.keywords?.map((k) => k.keyword).filter((k): k is string => !!k) || []

//   return {
//     title: fullTitle,
//     description: description,
//     keywords: keywords,
//     openGraph: {
//       title: fullTitle,
//       description: description,
//       type: 'article',
//       publishedTime: article.createdAt,
//       modifiedTime: article.updatedAt,
//       url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${tutorial_slug}/${article_slug}`,
//       images: previousImages,
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: fullTitle,
//       description: description,
//     },
//   }
// }

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; article_slug: string }>
}) {
  const { tutorial_slug, article_slug } = await params

  const article = await getArticleBySlug({ tutorialSlug: tutorial_slug, articleSlug: article_slug })
  if (isNone(article)) {
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
      <div className="relative flex flex-1">
        <ArticleSidebarTrigger />

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
        articleSlug={article_slug}
        tutorialTitle={tutorial_slug}
        articleTitle={article.value.title}
        articleFullContent={article.value.content}
      />
    </>
  )
}
