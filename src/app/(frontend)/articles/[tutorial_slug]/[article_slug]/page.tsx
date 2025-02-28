import { RecommendedArticles } from '@/components/recommended-articles'
import { TypographyH1, TypographyP } from '@/components/typography'
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
} from '@/core/articles'
import { ArticleHeader } from '../components/article-header'
import { ArticleSidebar } from '../components/article-sidebar'
import { ArticleOutline } from './components/article-outline'
import { ArticleContent } from '../components/article-content'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; article_slug: string }>
}) {
  const { tutorial_slug, article_slug } = await params

  // Get the tutorial, article, and related data
  const payloadTutorial = await getTutorial(tutorial_slug)
  const payloadArticle = await getArticle(tutorial_slug, article_slug)
  const payloadArticles = await getTutorialArticles(tutorial_slug)

  // Convert to our custom types using the utility functions
  const tutorial = convertPayloadTutorialToTutorial(payloadTutorial)
  const article = convertPayloadArticleToArticle(payloadArticle)
  const articles = payloadArticles.map(convertPayloadArticleToArticle)

  // Get the article outline
  const outline = getArticleOutline(article.content)

  // Get recommended articles
  const popularArticles = await getPopularArticles(tutorial_slug, article.id)
  const personalizedArticles = await getPersonalizedArticleRecommendations(
    tutorial_slug,
    article.id,
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
}
