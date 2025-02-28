import { ArticleOutline } from '@/components/article-outline'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  convertPayloadArticleToArticle,
  convertPayloadTutorialToTutorial,
  getArticleOutline,
  getExampleArticle,
  getPersonalizedArticleRecommendations,
  getPopularArticles,
  getTutorial,
  getTutorialExampleArticles,
} from '@/core/articles'
import { ArticleContent } from '../../components/article-content'
import { ArticleSidebar } from '../../components/article-sidebar'
import { ArticleHeader } from '../../components/article-header'

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; example_slug: string }>
}) {
  const { tutorial_slug, example_slug } = await params

  // Get the tutorial, article, and related data
  const payloadTutorial = await getTutorial(tutorial_slug)
  const payloadArticle = await getExampleArticle(tutorial_slug, example_slug)
  const payloadArticles = await getTutorialExampleArticles(tutorial_slug)

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
        articles={payloadArticles}
        currentArticleSlug={example_slug}
        articleType="examples"
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
