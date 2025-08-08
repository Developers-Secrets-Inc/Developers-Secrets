import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { isFailure } from '@/lib/result'
import { notFound } from 'next/navigation'
import { ArticleSidebar } from '../../components/article-sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { find } from '@/api'
import { getSectionsArticles, getTutorialForLayout } from '@/api/articles'

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

  const sections = await getSectionsArticles(tutorial.value.referenceSections ?? [])

  return (
    <SidebarProvider>
      <ArticleSidebar
        tutorial={{
          slug: tutorial.value.slug,
          title: tutorial.value.title,
          sections: sections,
        }}
        articleType="references"
      />
      <SidebarInset>
        <HomeHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
