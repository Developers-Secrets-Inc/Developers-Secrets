import React from 'react'
import { Article } from '@/types/article'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, BookOpen, LogIn } from 'lucide-react'

interface RecommendedArticlesProps {
  popularArticles?: Article[]
  personalizedArticles?: Article[]
  tutorialSlug: string
}

const LoginPrompt = () => (
  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border flex items-center gap-4">
    <div className="p-2 bg-primary/10 rounded-full">
      <LogIn className="size-5 text-primary" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium">Personalized Recommendations</h4>
      <p className="text-sm text-muted-foreground">
        Log in to get more relevant recommendations based on your reading history.
      </p>
    </div>
    <Button variant="outline" size="sm" className="whitespace-nowrap">
      Log In
      <ArrowRight className="ml-2 size-4" />
    </Button>
  </div>
);

/**
 * Displays recommended articles at the end of an article
 * Shows popular articles based on statistics and personalized recommendations
 */
export function RecommendedArticles({
  popularArticles = [],
  personalizedArticles = [],
  tutorialSlug,
}: RecommendedArticlesProps) {
  // Prendre exactement un article populaire (le premier)
  const topPopularArticle = popularArticles.length > 0 ? [popularArticles[0]] : []

  // Prendre jusqu'à deux articles personnalisés
  // Filtrer pour s'assurer qu'ils ne sont pas déjà dans les articles populaires
  const filteredPersonalizedArticles = personalizedArticles
    .filter((article) => !topPopularArticle.some((a) => a.id === article.id))
    .slice(0, 2)

  // Combiner les deux types d'articles
  const allRecommendations = [...topPopularArticle, ...filteredPersonalizedArticles]

  // Pour le débogage - afficher les articles reçus


  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRecommendations.map((article, index) => (
          <ArticleCard
            key={`${article.id}-${index}`}
            article={article}
            tutorialSlug={tutorialSlug}
            isPopular={topPopularArticle.some((a) => a.id === article.id)}
          />
        ))}

        {/* Placeholder card if we don't have enough recommendations */}
        {allRecommendations.length === 0 && (
          <div className="p-4 flex flex-col gap-4 bg-background border rounded-md">
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

      {/* Invite à se connecter pour de meilleures recommandations */}
      <LoginPrompt />
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
    <div className="p-4 flex flex-col gap-4 bg-background border rounded-md h-full">
      <div className="flex flex-col gap-3 flex-1">
        <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
          {isPopular ? <Sparkles className="size-5" /> : <BookOpen className="size-5" />}
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center justify-between gap-[6px]">
            <p className="text-sm font-medium line-clamp-1">{article.title}</p>
            {isPopular ? (
              <div className="rounded-[6px] py-[2px] px-[6px] border bg-primary/10">
                <p className="text-xs font-medium">Popular</p>
              </div>
            ) : (
              <div className="rounded-[6px] py-[2px] px-[6px] border bg-secondary/10">
                <p className="text-xs font-medium">For You</p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.subtitle || article.content.substring(0, 100)}
          </p>
        </div>
      </div>
      <Link href={`/articles/${tutorialSlug}/${article.slug}`} className="mt-auto">
        <Button className="w-full flex items-center justify-center gap-2">
          Read Article
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  )
}
