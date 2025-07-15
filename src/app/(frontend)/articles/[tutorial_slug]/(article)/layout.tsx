import { find } from '@/api'
import { getSectionsArticles, getTutorialForLayout } from '@/api/articles'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ArticleSidebar } from '../components/article-sidebar'
import { isFailure } from '@/lib/result'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

export default async function TutorialArticlesLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tutorial_slug: string }>
}) {
  const { tutorial_slug } = await params

  const tutorial = await getTutorialForLayout(tutorial_slug)

  if (isFailure(tutorial)) return notFound()

  const sections = await getSectionsArticles(tutorial.value.sections)

  return (
    <SidebarProvider>
      <ArticleSidebar
        tutorial={{
          slug: tutorial.value.slug,
          title: tutorial.value.title,
          sections: sections,
        }}
        articleType="tutorial"
      />
      <SidebarInset>
        <HomeHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
