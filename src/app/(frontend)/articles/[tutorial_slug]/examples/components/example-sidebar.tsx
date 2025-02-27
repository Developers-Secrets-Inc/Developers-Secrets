import * as React from 'react'

import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { ArticlesSidebar } from '@/components/articles-sidebar'
import { ArticlesSwitcher } from '../../components/articles-switcher'
import { SearchForm } from '../../[article_slug]/components/search-form'
import { Tutorial } from '@/types/tutorial'
import { Article } from '@/types/article'

interface ExampleSidebarProps {
  tutorial: Tutorial
  articles: Article[]
  currentArticleSlug: string
}

export const ExampleSidebar = ({ tutorial, articles, currentArticleSlug }: ExampleSidebarProps) => {
  return (
    <Sidebar style={{ '--sidebar-width': '270px' } as React.CSSProperties}>
      <SidebarHeader>
        <ArticlesSwitcher
          tutorialSlug={tutorial.slug}
          currentArticleType="examples"
          tutorialTitle={tutorial.title}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <ArticlesSidebar
          tutorial={tutorial}
          articles={articles}
          currentArticleSlug={currentArticleSlug}
          type="examples"
        />
      </SidebarContent>
    </Sidebar>
  )
}
