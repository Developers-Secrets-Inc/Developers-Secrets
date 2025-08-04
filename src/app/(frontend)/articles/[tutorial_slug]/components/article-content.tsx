// import { Markdown } from './markdown'
import { RecommendedArticleCard, RecommendedArticles } from '@/components/recommended-articles'
import { TypographyH1, TypographyP } from '@/components/typography'
import { Markdown } from './markdown'

interface ArticleContentProps {
  article: {
    title: string
    subtitle: string | null | undefined
    content: string
  }
  popularArticles: RecommendedArticleCard[]
  personalizedArticles: RecommendedArticleCard[]
  tutorial_slug: string
}

export const ArticleContent = ({
  article,
  popularArticles,
  personalizedArticles,
  tutorial_slug,
}: ArticleContentProps) => {
  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="flex w-full flex-1 flex-col gap-6 px-4 pt-8 pb-12 md:px-6 md:pt-12 xl:px-12 xl:mx-auto max-w-[860px]">
        <article className="prose prose-slate max-w-none">
          <TypographyH1>{article.title}</TypographyH1>
          {article.subtitle && <TypographyP>{article.subtitle}</TypographyP>}
          <Markdown content={article.content} />
        </article>
        <RecommendedArticles
          popularArticles={popularArticles}
          personalizedArticles={personalizedArticles}
          tutorialSlug={tutorial_slug}
        />
      </div>
    </main>
  )
}

export const ArticleSkeleton = () => {
  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="flex w-full flex-1 flex-col gap-6 px-4 pt-8 pb-12 md:px-6 md:pt-12 xl:px-12 xl:mx-auto max-w-[860px]">
        <div className="prose prose-slate max-w-none animate-pulse">
          <div className="h-10 w-2/3 bg-muted rounded mb-4" />
          <div className="h-5 w-1/2 bg-muted rounded mb-6" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      </div>
    </main>
  )
}
