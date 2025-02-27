import React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  getExampleArticle,
  getTutorial,
  getTutorialExampleArticles,
  getArticleOutline,
  getPopularArticles,
  getPersonalizedArticleRecommendations,
  convertPayloadArticleToArticle,
  convertPayloadTutorialToTutorial,
} from '@/core/articles'
import { TutorialHeader } from '@/components/tutorial-header'
import { TutorialContent } from '@/components/tutorial-content'
import { Markdown } from '@/components/markdown'
import { ArticleOutline } from '@/components/article-outline'
import { RecommendedArticles } from '@/components/recommended-articles'
import { ArticleRating } from '@/components/article-rating'
import { Article } from '@/types/article'
import { Tutorial } from '@/types/tutorial'
import { ExampleSidebar } from '../components/example-sidebar'

export default async function ExampleArticlePage({
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
      <ExampleSidebar tutorial={tutorial} articles={articles} currentArticleSlug={example_slug} />
      <SidebarInset>
        <TutorialHeader tutorial={tutorial} currentTab="examples" />
        <TutorialContent>
          <div>
            <article className="prose prose-slate max-w-none">
              <h1>{article.title}</h1>
              {article.subtitle && <p className="lead">{article.subtitle}</p>}
              <Markdown>{article.content}</Markdown>
              <ArticleRating articleId={String(article.id)} />
            </article>
            <RecommendedArticles
              popularArticles={popularArticles.map(convertPayloadArticleToArticle)}
              personalizedArticles={personalizedArticles.map(convertPayloadArticleToArticle)}
              tutorialSlug={tutorial_slug}
            />
          </div>
          <ArticleOutline outline={outline} />
        </TutorialContent>
      </SidebarInset>
    </SidebarProvider>
  )
}
