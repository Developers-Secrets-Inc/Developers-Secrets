import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getTutorialBySlug } from '@/core/articles/index-v2'
import { isFailure } from '@/lib/result'
import { notFound } from 'next/navigation'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { getSectionsArticles, getTutorialForLayout } from '@/api/articles'
import { ArticleSidebar } from '../../components/article-sidebar'

export default async function ReferenceArticlesLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tutorial_slug: string }>
}) {
  const { tutorial_slug } = await params

  const tutorial = await getTutorialForLayout(tutorial_slug)

  if (isFailure(tutorial)) return notFound()

  const sections = await getSectionsArticles(tutorial.value.exampleSections ?? [])

  return (
    <SidebarProvider>
      <ArticleSidebar
        tutorial={{
          slug: tutorial.value.slug,
          title: tutorial.value.title,
          sections: sections,
        }}
        articleType="examples"
      />
      <SidebarInset>
        <HomeHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}