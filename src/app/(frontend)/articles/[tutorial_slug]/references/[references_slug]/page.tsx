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
import { TutorialHeader } from '@/components/tutorial-header'
import { TutorialContent } from '@/components/tutorial-content'
import { Markdown } from '@/components/markdown'
import { ArticleOutline } from '@/components/article-outline'
import { RecommendedArticles } from '@/components/recommended-articles'
import { ArticleRating } from '@/components/article-rating'
import { Article } from '@/types/article'
import { Tutorial } from '@/types/tutorial'
import { ReferenceSidebar } from '../components/reference-sidebar'
import { ReferenceHeader } from './components/reference-header'
import { ArticleContent } from '../../components/article-content'

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
      <ReferenceSidebar
        tutorial={tutorial}
        articles={articles}
        currentArticleSlug={references_slug}
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
