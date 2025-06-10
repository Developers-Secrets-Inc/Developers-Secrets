import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface ArticlesGridProps {
  articles: {
    id: string
    title: string
    slug: string
    category: string
    description: string
    publishedAt: string
  }[]
}

export function ArticlesGrid({ articles }: ArticlesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Card key={article.id} className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary uppercase">{article.category}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <Link href={`/blog/${article.slug}`}>
              <h2 className="text-xl font-semibold text-foreground hover:underline">
                {article.title}
              </h2>
            </Link>
            <p className="mt-2 text-muted-foreground line-clamp-3">{article.description}</p>
          </div>
          <Link
            href={`/blog/${article.slug}`}
            className="text-primary hover:underline mt-4 inline-block"
          >
            Read More
          </Link>
        </Card>
      ))}
    </div>
  )
}

