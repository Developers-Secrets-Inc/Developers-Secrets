import Link from 'next/link'
import * as React from 'react'
import { cache } from 'react'

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
import { Article as PayloadArticle, Tutorial as PayloadTutorial } from '@/payload-types'
import { SearchForm } from '../[article_slug]/components/search-form'
import { ArticleSidebarFooter } from './article-sidebar-footer'
import { ArticlesSwitcher } from './articles-switcher'

interface ArticleSidebarProps {
  tutorial: PayloadTutorial
  currentArticleSlug: string
  articles: PayloadArticle[]
  articleType: 'tutorial' | 'examples' | 'references'
}

// Function to create tutorial outline from tutorial sections and articles
// Wrapped in cache() to avoid recalculating on each render
const createTutorialOutline = cache(
  (
    tutorial: PayloadTutorial,
    articles: PayloadArticle[],
    articleType: 'tutorial' | 'examples' | 'references',
  ) => {
    let sections
    if (articleType === 'tutorial') {
      sections = tutorial.sections
    } else if (articleType === 'examples') {
      sections = tutorial.exampleSections
    } else {
      sections = tutorial.referenceSections
    }

    if (!sections) return []

    return sections.map((section) => ({
      title: section.title,
      items: articles
        .filter((article) =>
          Array.isArray(section.articles)
            ? section.articles.some(
                (a) =>
                  typeof a === 'object' &&
                  a !== null &&
                  'id' in a &&
                  String(a.id) === String(article.id),
              )
            : false,
        )
        .map((article) => ({
          title: article.title,
          url: article.slug,
        })),
    }))
  },
)

export const ArticleSidebar = ({
  tutorial,
  currentArticleSlug,
  articles,
  articleType,
}: ArticleSidebarProps) => {
  // Use cached functions
  const tutorialOutline = createTutorialOutline(tutorial, articles, articleType)

  return (
    <Sidebar style={{ '--sidebar-width': '270px' } as React.CSSProperties} className="z-50">
      <SidebarHeader>
        <ArticlesSwitcher
          tutorialSlug={tutorial.slug}
          tutorialTitle={tutorial.title}
        />
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
                      className={`text-muted-foreground ${
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
