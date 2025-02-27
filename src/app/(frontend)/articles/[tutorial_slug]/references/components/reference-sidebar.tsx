import * as React from 'react'

import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { ArticlesSidebar } from '@/components/articles-sidebar'
import { ArticlesSwitcher } from '../../components/articles-switcher'
import { SearchForm } from '../[references_slug]/components/search-form'
import { Tutorial } from '@/types/tutorial'
import { Article } from '@/types/article'

interface ReferenceSidebarProps {
  tutorial: Tutorial
  articles: Article[]
  currentArticleSlug: string
}

export const ReferenceSidebar = ({
  tutorial,
  articles,
  currentArticleSlug,
}: ReferenceSidebarProps) => {
  return (
    <Sidebar style={{ '--sidebar-width': '270px' } as React.CSSProperties}>
      <SidebarHeader>
        <ArticlesSwitcher
          tutorialSlug={tutorial.slug}
          currentArticleType="references"
          tutorialTitle={tutorial.title}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <ArticlesSidebar
          tutorial={tutorial}
          articles={articles}
          currentArticleSlug={currentArticleSlug}
          type="references"
        />
      </SidebarContent>
    </Sidebar>
  )
}
