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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { SearchForm } from '../(article)/[article_slug]/components/search-form'
import { ArticleSidebarFooter } from './article-sidebar-footer'
import { ArticlesSwitcher } from './articles-switcher'
import { Eclipse } from 'lucide-react'

type FormattedArticle = {
  id: number
  title: string
  slug: string
}

type Section = {
  id?: string | null
  title: string
  description?: string | null
  articles: FormattedArticle[]
}

type Tutorial = {
  slug: string
  title: string
  sections: Section[]
}

type ArticleType = 'tutorial' | 'examples' | 'references'

interface ArticleSidebarProps {
  tutorial: Tutorial
  // currentArticleSlug: string
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

export const ArticleSidebar = ({ tutorial, articleType }: ArticleSidebarProps) => {
  const tutorialOutline = createTutorialOutline(tutorial.sections)

  return (
    <Sidebar className="z-50">
      <SidebarHeader>
        <ArticlesSwitcher tutorialSlug={tutorial.slug} tutorialTitle={tutorial.title} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-4 pt-2">
        {tutorialOutline.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-sm text-sidebar-foreground">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-muted-foreground truncate">
                      <Link
                        href={`/articles/${tutorial.slug}/${articleType !== 'tutorial' ? `${articleType}/` : ''}${item.url}`}
                        // prefetch={true}
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
      <SidebarRail />
    </Sidebar>
  )
}
