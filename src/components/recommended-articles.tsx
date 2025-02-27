import React from 'react'
import { Article } from '@/types/article'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react'

interface RecommendedArticlesProps {
  popularArticles?: Article[]
  personalizedArticles?: Article[]
  tutorialSlug: string
}

/**
 * Displays recommended articles at the end of an article
 * Shows popular articles based on statistics and personalized recommendations
 */
export function RecommendedArticles({
  popularArticles = [],
  personalizedArticles = [],
  tutorialSlug,
}: RecommendedArticlesProps) {
  // Create a deduplicated list of recommendations
  const allRecommendations = [...popularArticles, ...personalizedArticles]
    .filter((article, index, self) => index === self.findIndex((a) => a.id === article.id))
    .slice(0, 4)


  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
      <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4">
        {allRecommendations.map((article, index) => (
          <ArticleCard
            key={`${article.id}-${index}`}
            article={article}
            tutorialSlug={tutorialSlug}
            isPopular={popularArticles.some((a) => a.id === article.id)}
          />
        ))}

        {/* Placeholder card if we don't have enough recommendations */}
        {allRecommendations.length === 0 && (
          <div className="p-4 flex flex-col gap-4 bg-background border rounded-md min-w-[250px]">
            <div className="flex flex-col gap-3">
              <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
                <BookOpen className="size-5" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between gap-[6px]">
                  <p className="text-sm font-medium">More content coming soon</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  We&apos;re working on more articles for you
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ArticleCardProps {
  article: Article
  tutorialSlug: string
  isPopular?: boolean
}

function ArticleCard({ article, tutorialSlug, isPopular = false }: ArticleCardProps) {
  return (
    <div className="p-4 flex flex-col gap-4 bg-background border rounded-md min-w-[250px] max-w-[300px]">
      <div className="flex flex-col gap-3">
        <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
          {isPopular ? <Sparkles className="size-5" /> : <BookOpen className="size-5" />}
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center justify-between gap-[6px]">
            <p className="text-sm font-medium line-clamp-1">{article.title}</p>
            {isPopular && (
              <div className="rounded-[6px] py-[2px] px-[6px] border bg-primary/10">
                <p className="text-xs font-medium">Popular</p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.subtitle || article.content.substring(0, 100)}
          </p>
        </div>
      </div>
      <Link href={`/articles/${tutorialSlug}/${article.slug}`}>
        <Button className="w-full flex items-center justify-center gap-2">
          Read Article
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  )
}
