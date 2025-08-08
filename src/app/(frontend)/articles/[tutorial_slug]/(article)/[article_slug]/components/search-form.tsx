'use client'

import { Search } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/ui/sidebar'

// Animation variants for the articles
const articleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export function SearchForm() {
  // const [open, setOpen] = React.useState(false)
  // const [articles, setArticles] = React.useState<ArticleWithTutorial[]>([])
  // const [isLoading, setIsLoading] = React.useState(false)
  // const [hasMore, setHasMore] = React.useState(false)
  // const [nextIndex, setNextIndex] = React.useState<number | null>(0)
  // const router = useRouter()

  // // Load articles when dialog opens
  // React.useEffect(() => {
  //   if (open && nextIndex !== null) {
  //     setIsLoading(true)
  //     fetchArticlesChunk(nextIndex)
  //       .then((result) => {
  //         setArticles((prev) => [...prev, ...result.articles])
  //         setHasMore(result.hasMore)
  //         setNextIndex(result.nextIndex)
  //       })
  //       .catch((error) => {
  //         console.error('Error loading articles:', error)
  //       })
  //       .finally(() => {
  //         setIsLoading(false)
  //       })
  //   }
  // }, [open, nextIndex])

  // const handleSelect = React.useCallback(
  //   (article: ArticleWithTutorial) => {
  //     router.push(article.url)
  //     setOpen(false)
  //   },
  //   [router],
  // )

  // // Add keyboard shortcut to open search
  // React.useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault()
  //       setOpen((open) => !open)
  //     }
  //   }

  //   document.addEventListener('keydown', down)
  //   return () => document.removeEventListener('keydown', down)
  // }, [])

  // // Get icon based on article type
  // const getArticleIcon = (type: string) => {
  //   switch (type) {
  //     case 'tutorial':
  //       return <BookOpen className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
  //     case 'examples':
  //       return <Code className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
  //     case 'references':
  //       return <FileText className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
  //     default:
  //       return <BookOpen className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
  //   }
  // }

  return (
    <>
      <SidebarGroup className="py-0 px-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Comming Soon
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search the docs..."
            className="pl-8 h-10 cursor-pointer"
            // onClick={() => setOpen(true)}
            readOnly
            disabled
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>

      {/* <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type to search all articles..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {articles.length === 0 && isLoading ? (
                <div className="flex items-center justify-center py-6 gap-2">
                  <div className="size-4 border-2 border-slate-300 border-t-slate-500 animate-spin rounded-full" />
                  <p className="text-sm text-muted-foreground">Loading articles...</p>
                </div>
              ) : (
                <AnimatePresence>
                  {articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={articleVariants}
                      layout
                    >
                      <CommandItem
                        value={article.searchKey}
                        onSelect={() => handleSelect(article)}
                        className="transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          {getArticleIcon(article.type)}
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{article.title}</span>
                            {article.subtitle && (
                              <span className="text-sm text-muted-foreground line-clamp-2">
                                {article.subtitle}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground/70 mt-1">
                              {article.type === 'tutorial'
                                ? 'Tutorial'
                                : article.type === 'examples'
                                  ? 'Example'
                                  : 'Reference'}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              {isLoading && articles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-2 gap-2"
                >
                  <div className="size-3 border-2 border-slate-300 border-t-slate-500 animate-spin rounded-full" />
                  <p className="text-xs text-muted-foreground">Loading more...</p>
                </motion.div>
              )}
              {!isLoading && hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center py-2 cursor-pointer hover:bg-accent"
                  onClick={() => setNextIndex((prev) => (prev !== null ? prev : 0))}
                >
                  <p className="text-xs text-muted-foreground">Load more articles...</p>
                </motion.div>
              )}
            </CommandGroup>
          </CommandList>

          <div className="border-t py-2 px-3">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="border rounded px-1 py-0.5 flex items-center">
                    <ArrowUp className="h-3 w-3" />
                  </div>
                  <div className="border rounded px-1 py-0.5 flex items-center">
                    <ArrowDown className="h-3 w-3" />
                  </div>
                </div>
                <span>to navigate</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="border rounded px-1 py-0.5 flex items-center">
                  <ArrowRight className="h-3 w-3" />
                </div>
                <span>to select</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="border rounded px-1 py-0.5 flex items-center">
                  <span className="text-xs font-medium">esc</span>
                </div>
                <span>to close</span>
              </div>
            </div>
          </div>
        </Command>
      </CommandDialog> */}
    </>
  )
}
