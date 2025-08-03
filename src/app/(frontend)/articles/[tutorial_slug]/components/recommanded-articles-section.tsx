


import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, BookOpen } from 'lucide-react'

export const RecommandedArticles = ({ tutorialSlug, articles, type = '' }: { tutorialSlug: string, articles: { name: string, slug: string }[], type?: string }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {articles.map((article, index) => (
          <Link key={article.slug} href={`/articles/${tutorialSlug}${type ? `/${type}` : ''}/${article.slug}`} className="block">
            <Card className="border hover:border-primary/50 transition-colors h-full flex flex-col p-4">
              <CardContent className="flex-1 px-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
                    {index < 2 ? <Sparkles className="size-5" /> : <BookOpen className="size-5" />}
                  </div>
                  {index < 2 && (
                    <Badge className="bg-amber-500/10 border border-amber-500/20 text-amber-500" >
                      Most Popular
                    </Badge>
                  )}
                  {index >= 2 && (
                    <Badge className="bg-primary/10 border border-primary/20 text-primary">
                      Recommended
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-left">{article.name}</h3>
              </CardContent>
              <CardFooter className='px-0'>
                <Button className="w-full">
                  Read Article
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}