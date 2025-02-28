import React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  getReferenceArticle,
  getTutorial,
  getTutorialReferenceArticles,
  getArticleOutline,
  getPopularArticles,
  getPersonalizedArticleRecommendations,
  convertPayloadArticleToArticle,
  convertPayloadTutorialToTutorial,
} from '@/core/articles'
import { ArticleOutline } from '@/components/article-outline'
import { ArticleContent } from '../../components/article-content'
import { ReferenceHeader } from './components/reference-header'
import { ArticleSidebar } from '../../components/article-sidebar'

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ tutorial_slug: string; references_slug: string }>
}) {
  const { tutorial_slug, references_slug } = await params

  // Get the tutorial, article, and related data
  const payloadTutorial = await getTutorial(tutorial_slug)
  const payloadArticle = await getReferenceArticle(tutorial_slug, references_slug)
  const payloadArticles = await getTutorialReferenceArticles(tutorial_slug)

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
        currentArticleSlug={references_slug}
        articleType="references"
      />
      <SidebarInset>
        <ReferenceHeader />
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
