import Link from 'next/link'
import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { SearchForm } from '../[article_slug]/components/search-form'
import { ArticleSidebarFooter } from './article-sidebar-footer'
import { ArticlesSwitcher } from './articles-switcher'


type Article = {
  id: number
  title: string
  slug: string
}

type Section = {
  title: string
  articles: Article[]
  id?: string | null
}

type Tutorial = {
  slug: string
  title: string
  sections: Section[]
}

type ArticleType = 'tutorial' | 'examples' | 'references'

interface ArticleSidebarProps {
  tutorial: Tutorial
  currentArticleSlug: string
  articleType: ArticleType
}

// Wrapped in cache() to avoid recalculating on each render
const createTutorialOutline = (sections: ArticleSidebarProps['tutorial']['sections']) => {
  return sections.map((section) => ({
    title: section.title,
    items: section.articles.map((article) => ({
      title: article.title,
      url: article.slug,
    })),
  }))
}

export const ArticleSidebar = ({
  tutorial,
  currentArticleSlug,
  articleType,
}: ArticleSidebarProps) => {
  // Use cached functions
  const tutorialOutline = createTutorialOutline(tutorial.sections)

  return (
    <Sidebar style={{ '--sidebar-width': '270px' } as React.CSSProperties} className="z-50">
      <SidebarHeader>
        <ArticlesSwitcher tutorialSlug={tutorial.slug} tutorialTitle={tutorial.title} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-4">
        {tutorialOutline.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-sm text-sidebar-foreground">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === currentArticleSlug}
                      className={`text-muted-foreground truncate ${
                        item.url === currentArticleSlug ? 'text-primary' : ''
                      }`}
                    >
                      <Link
                        href={`/articles/${tutorial.slug}/${articleType !== 'tutorial' ? `${articleType}/` : ''}${item.url}`}
                        prefetch={true}
                      >
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <ArticleSidebarFooter />
    </Sidebar>
  )
}
