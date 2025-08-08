import { notFound } from 'next/navigation'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { Markdown } from '@/components/markdown'
import { getBlogArticleBySlug } from '@/api/blog' // Import the specific action

interface BlogArticlePageProps {
  params: Promise<{
    article_slug: string
  }>
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { article_slug } = await params

  const { success, value: article } = await getBlogArticleBySlug(article_slug)

  if (!success || !article) {
    notFound()
  }

  return (
    <div>
      <HomeHeader />
      <div className="container mx-auto border-x border-border py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        {article.category && (
          <p className="text-md text-muted-foreground mb-2">Category: {article.category}</p>
        )}
        {article.description && (
          <p className="text-lg text-muted-foreground mb-4">{article.description}</p>
        )}
        {article.publishedAt && (
          <p className="text-sm text-muted-foreground mb-6">
            Published on:{' '}
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
        <div className="prose dark:prose-invert max-w-3xl mx-auto">
          {' '}
          {/* Add prose for basic styling */}
          <Markdown>{article.content}</Markdown>
        </div>
      </div>
    </div>
  )
}

