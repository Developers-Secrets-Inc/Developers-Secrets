import { Markdown } from './markdown'
import { RecommendedArticles } from '@/components/recommended-articles'
import { TypographyH1, TypographyP } from '@/components/typography'
import { Article } from '@/types/article'

interface ArticleContentProps {
  article: Article
  popularArticles: Article[]
  personalizedArticles: Article[]
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
          {/* Article content */}
          <Markdown>{article.content}</Markdown>
          <RecommendedArticles
            popularArticles={popularArticles}
            personalizedArticles={personalizedArticles}
            tutorialSlug={tutorial_slug}
          />
        </article>
      </div>
    </main>
  )
}
