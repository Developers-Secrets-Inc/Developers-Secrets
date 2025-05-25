import { HeaderPlaceholder } from '@/components/layout/header-placeholder'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getArticleOutline, getTutorialArticles } from '@/core/articles'
import { ChatActivationButton } from '@/core/articles/components/chat-activation-button'
import {
  getArticleBySlug as getArticleBySlugV2,
  getTutorialBySlug,
  getTutorialsArticles,
} from '@/core/articles/index-v2'
import { getPersonalizedArticles, getPopularArticles } from '@/core/articles/recommandations-v2'
import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react'
import { ArticleContent, ArticleSkeleton } from '../components/article-content'
import { ArticleSidebar } from '../components/article-sidebar'
import { ArticleOutline } from './components/article-outline'
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
    // Get the tutorial and article data (Payload structure)
    const payloadTutorial = await getTutorialBySlug(tutorial_slug)
    const payloadArticle = await getArticleBySlugV2(tutorial_slug, article_slug)

    // Get the parent metadata
    const previousImages = (await parent).openGraph?.images || []

    // Prepare SEO title - use SEO title if available, otherwise use article title
    const title = payloadArticle.seo?.title || payloadArticle.title
    const fullTitle = `${title} | ${payloadTutorial.title}`

    // Prepare SEO description
    const description =
      payloadArticle.seo?.description ||
      payloadArticle.subtitle ||
      `Learn about ${payloadArticle.title} in our ${payloadTutorial.title} tutorial.`

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

export const generateStaticParams = async (): Promise<
  { tutorial_slug: string; article_slug: string }[]
> => {
  const tutorialsArticles = await getTutorialsArticles()

  return tutorialsArticles.flatMap(({ tutorial, articles }) =>
    articles.map((article) => ({
      tutorial_slug: tutorial.slug,
      article_slug: article.slug,
    })),
  )
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; article_slug: string }>
}) {
  const { tutorial_slug, article_slug } = await params

  // Utilise les fonctions v2 pour charger le tutoriel et les articles complets
  const [tutorial, articles, article] = await Promise.all([
    getTutorialBySlug(tutorial_slug),
    getTutorialArticles(tutorial_slug),
    getArticleBySlugV2(tutorial_slug, article_slug),
  ])

  // Convert to our custom types using the utility functions

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
        currentArticleSlug={article_slug}
        articles={articles}
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
        articleSlug={article_slug}
        tutorialTitle={tutorial.title}
        articleTitle={article.title}
        articleFullContent={article.content}
      />
    </SidebarProvider>
  )
}
