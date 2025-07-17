import React, { useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, BookOpen, LogIn } from 'lucide-react'

export type RecommendedArticleCard = {
  id: number
  title: string
  subtitle: string | null | undefined
  slug: string
}

interface RecommendedArticlesProps {
  popularArticles?: RecommendedArticleCard[]
  personalizedArticles?: RecommendedArticleCard[]
  tutorialSlug: string
}

const LoginPrompt = React.memo(() => (
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
))

LoginPrompt.displayName = 'LoginPrompt'

interface ArticleCardProps {
  article: RecommendedArticleCard
  tutorialSlug: string
  isPopular?: boolean
}

// Fonction utilitaire pour retirer les balises Markdown du texte
function stripMarkdown(markdown: string): string {
  return (
    markdown
      // Enlève les titres ##, ###, etc.
      .replace(/^#{1,6}\s+/gm, '')
      // Enlève les listes
      .replace(/^\s*[-*+]\s+/gm, '')
      // Enlève les liens [texte](url)
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Enlève les images ![alt](url)
      .replace(/!\[[^\]]*\]\([^\)]+\)/g, '')
      // Enlève le gras **texte** ou __texte__
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      // Enlève l'italique *texte* ou _texte_
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Enlève le code `inline`
      .replace(/`([^`]+)`/g, '$1')
      // Enlève les blocs de code ```...```
      .replace(/```[\s\S]*?```/g, '')
      // Enlève les blockquotes
      .replace(/^>\s?/gm, '')
      // Enlève les retours multiples
      .replace(/\n{2,}/g, '\n')
      .trim()
  )
}

const ArticleCard = React.memo(function ArticleCard({
  article,
  tutorialSlug,
  isPopular = false,
}: ArticleCardProps) {
  return (
    <div className="p-4 flex flex-col gap-4 bg-background border rounded-md h-full">
      <div className="flex flex-col gap-3 flex-1">
        <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
          {isPopular ? <Sparkles className="size-5" /> : <BookOpen className="size-5" />}
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center justify-between gap-[6px] min-w-0">
            <p className="text-sm font-medium truncate max-w-[140px]">{article.title}</p>
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
          <p className="text-sm text-muted-foreground line-clamp-2">{article.subtitle || ''}</p>
        </div>
      </div>
      <Link href={`/articles/${tutorialSlug}/${article.slug}`} className="mt-auto">
        <Button className="w-full flex items-center justify-center gap-2 cursor-pointer">
          Read Article
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  )
})

const EmptyPlaceholder = React.memo(() => (
  <div className="p-4 flex flex-col gap-4 bg-background border rounded-md">
    <div className="flex flex-col gap-3">
      <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
        <BookOpen className="size-5" />
      </div>
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center justify-between gap-[6px]">
          <p className="text-sm font-medium">More content coming soon</p>
        </div>
        <p className="text-sm text-muted-foreground">We&apos;re working on more articles for you</p>
      </div>
    </div>
  </div>
))

EmptyPlaceholder.displayName = 'EmptyPlaceholder'

/**
 * Displays recommended articles at the end of an article
 * Shows popular articles based on statistics and personalized recommendations
 */
export function RecommendedArticles({
  popularArticles = [],
  personalizedArticles = [],
  tutorialSlug,
}: RecommendedArticlesProps) {
  // Utiliser useMemo pour éviter des calculs inutiles lors des re-renders
  const allRecommendations = useMemo(() => {
    // Prendre exactement un article populaire (le premier)
    const topPopularArticle = popularArticles.length > 0 ? [popularArticles[0]] : []

    // Créer un Set des IDs d'articles populaires pour une recherche O(1)
    const popularIds = new Set(topPopularArticle.map((article) => article.id))

    // Filtrer et limiter les articles personnalisés
    const filteredPersonalizedArticles = personalizedArticles
      .filter((article) => !popularIds.has(article.id))
      .slice(0, 2)

    // Retourner la combinaison des deux types d'articles
    return [...topPopularArticle, ...filteredPersonalizedArticles]
  }, [popularArticles, personalizedArticles])

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRecommendations.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            tutorialSlug={tutorialSlug}
            isPopular={popularArticles.length > 0 && popularArticles[0].id === article.id}
          />
        ))}

        {/* Placeholder card if we don't have enough recommendations */}
        {allRecommendations.length === 0 && <EmptyPlaceholder />}
      </div>

      {/* Invite à se connecter pour de meilleures recommandations */}
      <LoginPrompt />
    </div>
  )
}
