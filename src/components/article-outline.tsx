import React from 'react'
import { Text } from 'lucide-react'
import { OutlineItem } from '@/core/markdown/parser'

interface ArticleOutlineProps {
  outline: OutlineItem[]
}

/**
 * Renders the outline of an article
 */
export function ArticleOutline({ outline = [] }: ArticleOutlineProps) {
  return (
    <aside
      className="w-64 shrink-0 sticky top-[calc(var(--fd-banner-height)+var(--fd-nav-height))] h-[var(--fd-toc-height)] pb-2 pt-12 max-xl:hidden"
      style={
        {
          '--fd-toc-height': 'calc(100dvh - var(--fd-banner-height) - var(--fd-nav-height))',
        } as React.CSSProperties
      }
    >
      <nav className="h-full overflow-y-auto px-4 flex w-(--fd-toc-width) max-w-full flex-col gap-3 pe-4">
        <h3 className="inline-flex items-center gap-1.5 text-sm">
          <Text className="size-4" />
          On this page
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          {outline.length > 0 ? (
            renderOutlineItems(outline)
          ) : (
            <div className="text-muted-foreground">No outline available</div>
          )}
        </div>
      </nav>
    </aside>
  )
}

function renderOutlineItems(items: OutlineItem[]) {
  return items.map((item, index) => (
    <React.Fragment key={`item-${item.id}-${index}`}>
      <a href={`#${item.id}`}>{item.text}</a>
      {item.children && item.children.length > 0 && (
        <div className="flex flex-col gap-1.5 pl-3">
          {renderOutlineItemsChildren(item.children, index)}
        </div>
      )}
    </React.Fragment>
  ))
}

function renderOutlineItemsChildren(items: OutlineItem[], parentIndex: number) {
  return items.map((child, childIndex) => (
    <React.Fragment key={`child-${child.id}-${parentIndex}-${childIndex}`}>
      <a href={`#${child.id}`}>{child.text}</a>
      {child.children && child.children.length > 0 && (
        <div className="flex flex-col gap-1.5 pl-3">
          {renderOutlineItemsChildren(child.children, childIndex)}
        </div>
      )}
    </React.Fragment>
  ))
}
