'use client'

import { Search } from 'lucide-react'
import * as React from 'react'
import { useRouter } from 'next/navigation'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/ui/sidebar'
import { fetchArticlesChunk, type ArticleWithTutorial } from '@/actions/articles'
import { Label } from '@/components/ui/label'

export function SearchForm() {
  const [open, setOpen] = React.useState(false)
  const [articles, setArticles] = React.useState<ArticleWithTutorial[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(false)
  const [nextIndex, setNextIndex] = React.useState<number | null>(0)
  const router = useRouter()

  // Load articles when dialog opens
  React.useEffect(() => {
    if (open && nextIndex !== null) {
      setIsLoading(true)
      fetchArticlesChunk(nextIndex)
        .then((result) => {
          setArticles((prev) => [...prev, ...result.articles])
          setHasMore(result.hasMore)
          setNextIndex(result.nextIndex)
        })
        .catch((error) => {
          console.error('Error loading articles:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [open, nextIndex])

  const handleSelect = React.useCallback(
    (article: ArticleWithTutorial) => {
      router.push(article.url)
      setOpen(false)
    },
    [router],
  )

  // Add keyboard shortcut to open search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search the docs..."
            className="pl-8 cursor-pointer"
            onClick={() => setOpen(true)}
            readOnly
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type to search all articles..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {articles.length === 0 && isLoading ? (
                <div className="flex items-center justify-center py-6 gap-2">
                  <div className="size-4 border-2 border-primary/50 border-t-primary animate-spin rounded-full" />
                  <p className="text-sm text-muted-foreground">Loading articles...</p>
                </div>
              ) : (
                articles.map((article) => (
                  <CommandItem
                    key={article.id}
                    value={article.searchKey}
                    onSelect={() => handleSelect(article)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{article.title}</span>
                      {article.subtitle && (
                        <span className="text-sm text-muted-foreground">{article.subtitle}</span>
                      )}
                    </div>
                  </CommandItem>
                ))
              )}
              {isLoading && articles.length > 0 && (
                <div className="flex items-center justify-center py-2 gap-2">
                  <div className="size-3 border-2 border-primary/50 border-t-primary animate-spin rounded-full" />
                  <p className="text-xs text-muted-foreground">Loading more...</p>
                </div>
              )}
              {!isLoading && hasMore && (
                <div
                  className="flex items-center justify-center py-2 cursor-pointer hover:bg-accent"
                  onClick={() => setNextIndex((prev) => (prev !== null ? prev : 0))}
                >
                  <p className="text-xs text-muted-foreground">Load more articles...</p>
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
