import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Article, Tutorial } from '@/payload-types'

interface ArticlesSidebarProps {
  tutorial: Tutorial
  articles: Article[]
  currentArticleSlug?: string
  type?: 'regular' | 'examples' | 'references'
}

/**
 * Sidebar component that displays a list of articles in a tutorial
 */
export function ArticlesSidebar({
  tutorial,
  articles,
  currentArticleSlug,
  type = 'regular',
}: ArticlesSidebarProps) {
  // Group articles by section
  const sections =
    type === 'regular'
      ? tutorial.sections
      : type === 'examples'
        ? tutorial.exampleSections || []
        : tutorial.referenceSections || []

  return (
    <div className="w-full h-full overflow-auto py-6">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-semibold">{tutorial.title}</h2>
        <p className="text-sm text-muted-foreground">{tutorial.description}</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <SidebarSection
            key={section.id}
            section={section}
            articles={articles}
            currentArticleSlug={currentArticleSlug}
            tutorialSlug={tutorial.slug}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}

interface SidebarSectionProps {
  section: Tutorial['sections'] | any // Using any to accommodate different section types
  articles: Article[]
  currentArticleSlug?: string
  tutorialSlug: string
  type: 'regular' | 'examples' | 'references'
}

function SidebarSection({
  section,
  articles,
  currentArticleSlug,
  tutorialSlug,
  type,
}: SidebarSectionProps) {
  // Find articles that belong to this section
  const sectionArticles = articles.filter(
    (article) => section.articles.includes(article.id) || section.articles.includes(article.slug),
  )

  const basePath =
    type === 'regular'
      ? `/articles/${tutorialSlug}`
      : type === 'examples'
        ? `/articles/${tutorialSlug}/examples`
        : `/articles/${tutorialSlug}/references`

  return (
    <div className="px-4">
      <h3 className="text-sm font-medium mb-2">{section.title}</h3>
      {section.description && (
        <p className="text-xs text-muted-foreground mb-2">{section.description}</p>
      )}
      <ul className="space-y-1">
        {sectionArticles.map((article) => (
          <li key={article.id}>
            <Link
              href={`${basePath}/${article.slug}`}
              className={cn(
                'block text-sm py-1 px-2 rounded-md hover:bg-muted transition-colors',
                currentArticleSlug === article.slug && 'bg-muted font-medium',
              )}
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
