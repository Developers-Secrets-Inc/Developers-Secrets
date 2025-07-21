import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { Card } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { getSessionUser } from '@/core/user'
import { Button } from '@/components/ui/button'
import { getAllBlogArticles } from '@/core/blog'
import { ArticlesGrid } from '@/core/blog/components/articles-grid'

export default async function BlogPage() {
  const userResult = await getSessionUser()
  const isAuthenticated = userResult.success

  const { success, value: blogArticles } = await getAllBlogArticles()
  const articles = success ? blogArticles : []

  return (
    <div>
      <HomeHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Blog</h1>

        {articles.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center justify-center border-dashed p-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <PlusIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No Blog Posts Available</h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-md">
              {isAuthenticated
                ? 'Blog posts will be added soon. Check back later for exciting content!'
                : 'Sign in to access exclusive blog content and stay updated with our latest articles.'}
            </p>
            {!isAuthenticated && (
              <div className="mt-6 flex gap-4">
                <Button asChild variant="default">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <ArticlesGrid articles={articles} />
        )}
      </div>
    </div>
  )
}
