import React from 'react'
import Link from 'next/link'
import { Tutorial } from '@/types/tutorial'
import { cn } from '@/lib/utils'

interface TutorialHeaderProps {
  tutorial: Tutorial
  currentTab: 'articles' | 'examples' | 'references'
}

/**
 * Header component for tutorial pages
 * Displays the tutorial title and navigation tabs
 */
export function TutorialHeader({ tutorial, currentTab }: TutorialHeaderProps) {
  return (
    <div className="border-b pb-4 mb-8">
      <h1 className="text-3xl font-bold mb-2">{tutorial.title}</h1>
      {tutorial.description && <p className="text-muted-foreground mb-6">{tutorial.description}</p>}

      <div className="flex border-b">
        <TabLink href={`/articles/${tutorial.slug}`} isActive={currentTab === 'articles'}>
          Articles
        </TabLink>

        {tutorial.exampleSections && tutorial.exampleSections.length > 0 && (
          <TabLink
            href={`/articles/${tutorial.slug}/examples`}
            isActive={currentTab === 'examples'}
          >
            Examples
          </TabLink>
        )}

        {tutorial.referenceSections && tutorial.referenceSections.length > 0 && (
          <TabLink
            href={`/articles/${tutorial.slug}/references`}
            isActive={currentTab === 'references'}
          >
            References
          </TabLink>
        )}
      </div>
    </div>
  )
}

interface TabLinkProps {
  href: string
  isActive: boolean
  children: React.ReactNode
}

function TabLink({ href, isActive, children }: TabLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
        isActive
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted',
      )}
    >
      {children}
    </Link>
  )
}
