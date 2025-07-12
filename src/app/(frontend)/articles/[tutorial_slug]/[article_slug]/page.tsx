import { HeaderPlaceholder } from '@/components/layout/header-placeholder'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getArticleOutline } from '@/core/articles'
import { ChatActivationButton } from '@/core/articles/components/chat-activation-button'
import {
  getArticleBySlug,
  getTutorialBySlug,
  getTutorialsArticles,
  getTutorialArticles,
} from '@/core/articles/index-v2'
import { getPersonalizedArticles, getPopularArticles } from '@/core/articles/recommandations-v2'
import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react'
import { ArticleContent, ArticleSkeleton } from '../components/article-content'
import { ArticleSidebar } from '../components/article-sidebar'
import { ArticleOutline } from './components/article-outline'
import { isFailure } from '@/lib/result'
import { notFound } from 'next/navigation'
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
    // Get the tutorial and article data (Payload structure)
    const payloadTutorial = await getTutorialBySlug(tutorial_slug)
    const payloadArticle = await getArticleBySlug(tutorial_slug, article_slug)

    if (isFailure(payloadArticle)) {
      throw payloadArticle.error
    }

    const article = payloadArticle.value

    // Get the parent metadata
    const previousImages = (await parent).openGraph?.images || []

    // Prepare SEO title - use SEO title if available, otherwise use article title
    const title = article.seo?.title || article.title
    const fullTitle = `${title} | ${article.title}`

    // Prepare SEO description
    const description =
      article.seo?.description ||
      article.subtitle ||
      `Learn about ${article.title} in our ${article.title} tutorial.`

    // Prepare keywords
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

  const [tutorial, article] = await Promise.all([
    getTutorialBySlug(tutorial_slug, {
      slug: true,
      title: true,
      sections: {
        title: true,
        articles: {
          id: true,
          title: true,
          slug: true,
        },
        id: true,
      },
    }),
    getArticleBySlug(tutorial_slug, article_slug, {
      content: true,
      title: true,
      subtitle: true,
    }),
  ])

  if (isFailure(tutorial) || isFailure(article)) {
    return notFound()
  }

  const outline = getArticleOutline(article.value.content)

  const [popularArticles, personalizedArticles] = await Promise.all([
    getPopularArticles(tutorial_slug, article.value.id, 1),
    getPersonalizedArticles(tutorial_slug, article.value.id, 3),
  ])

  return (
    <SidebarProvider>
      <ArticleSidebar
        tutorial={{
          slug: tutorial.value.slug,
          title: tutorial.value.title,
          sections: tutorial.value.sections.map((section) => ({
            ...section,
            articles: Array.isArray(section.articles)
              ? [...section.articles].filter(
                  (a: any): a is { id: number; title: string; slug: string } =>
                    typeof a === 'object' && a !== null && 'id' in a && 'title' in a && 'slug' in a,
                )
              : [],
          })),
        }}
        currentArticleSlug={article_slug}
        articleType="tutorial"
      />
      <SidebarInset>
        <Suspense fallback={<HeaderPlaceholder />}>
          <HomeHeader />
        </Suspense>
        <div className="flex flex-1">
          <Suspense fallback={<ArticleSkeleton />}>
            <ArticleContent
              article={article.value}
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
        tutorialTitle={tutorial.value.title}
        articleTitle={article.value.title}
        articleFullContent={article.value.content}
      />
    </SidebarProvider>
  )
}
