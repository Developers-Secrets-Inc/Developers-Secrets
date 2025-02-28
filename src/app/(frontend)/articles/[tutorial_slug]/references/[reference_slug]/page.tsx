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
import { slugify } from '@/core/format'
import { ArticleContent } from '../../components/article-content'
import { ArticleSidebar } from '../../components/article-sidebar'
import { ArticleHeader } from '../../components/article-header'

// Revalidate content every hour
export const revalidate = 3600

// Allow dynamic params for references not in generateStaticParams
export const dynamicParams = true

// Pre-generate static params for all known tutorial/reference combinations
export async function generateStaticParams() {
  // Get all tutorials
  const tutorials = await getTutorials()

  // For each tutorial, get all its reference articles
  const params = await Promise.all(
    tutorials.map(async (tutorial) => {
      const tutorialSlug = tutorial.slug
      const articles = await getTutorialReferenceArticles(tutorialSlug)

      // Map each article to its params
      return articles.map((article) => ({
        tutorial_slug: tutorialSlug,
        reference_slug: slugify(article.title),
      }))
    }),
  )

  // Flatten the array of arrays
  return params.flat()
}

export default async function ReferencePage({
  params,
}: {
  params: { tutorial_slug: string; reference_slug: string }
}) {
  const { tutorial_slug, reference_slug } = params

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
