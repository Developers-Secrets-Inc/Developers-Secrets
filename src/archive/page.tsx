'use client'

import * as React from 'react'
import Link from 'next/link'
import { Text } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TutorialSidebar } from './components/sidebar/tutorial-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { TutorialNavigation } from './components/navigation-menu'

interface PageProps {
  params: Promise<{
    tutorial_slug: string
    article_slug: string
  }>
}

export default function Page({ params }: PageProps) {
  // Use React.use to unwrap the Promise in a client component
  const { tutorial_slug, article_slug } = React.use(params)

  return (
    <SidebarProvider>
      <TutorialSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 bg-[#FFFFFF] flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <Separator orientation="vertical" className="mr-2 h-4" />
            <TutorialNavigation />
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="secondary_gray">Log in</Button>
            <Button variant="primary">Sign up</Button>
          </div>
        </header>
        <div className="flex flex-1">
          {/* Article Content */}
          <main className="flex w-full min-w-0 flex-col">
            <div className="flex w-full flex-1 flex-col gap-6 px-4 pt-8 md:px-6 md:pt-12 xl:px-12 xl:mx-auto max-w-[860px] max-sm:pb-16">
              <article className="prose prose-slate max-w-none">
                <h1>Data Fetching</h1>
                <p className="lead">
                  Learn how to fetch, cache, and manage data effectively in your Next.js
                  application.
                </p>
                {/* Placeholder content */}
                <div className="space-y-4">
                  <div className="h-24 rounded-xl bg-muted/50" />
                  <div className="h-48 rounded-xl bg-muted/50" />
                  <div className="h-32 rounded-xl bg-muted/50" />
                </div>
              </article>
            </div>
          </main>

          {/* Article Outline */}
          <aside
            className="w-64 shrink-0 sticky top-[calc(var(--fd-banner-height)+var(--fd-nav-height))] h-[var(--fd-toc-height)] pb-2 pt-12 max-xl:hidden"
            style={
              {
                '--fd-toc-height': 'calc(100dvh - var(--fd-banner-height) - var(--fd-nav-height))',
              } as React.CSSProperties
            }
          >
            <nav className="h-full overflow-y-auto px-4 flex w-(--fd-toc-width) max-w-full flex-col gap-3 pe-4">
              <h3 className="inline-flex items-center gap-1.5 text-sm text-[#414651]">
                <Text className="size-4" />
                On this page
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#overview" className="text-fd-primary hover:text-[#181D27]">
                  Overview
                </a>

                <a href="#server-components" className="text-fd-primary hover:text-[#181D27]">
                  Server Components
                </a>
                <div className="flex flex-col gap-1.5 pl-3">
                  <a href="#fetch-data" className="text-[#414651] hover:text-[#181D27]">
                    Fetching Data
                  </a>
                  <a href="#streaming" className="text-[#414651] hover:text-[#181D27]">
                    Streaming with Suspense
                  </a>
                </div>

                <a href="#client-components" className="text-fd-primary hover:text-[#181D27]">
                  Client Components
                </a>
                <div className="flex flex-col gap-1.5 pl-3">
                  <a href="#use-effect" className="text-[#414651] hover:text-[#181D27]">
                    useEffect and Fetching
                  </a>
                  <a href="#swr" className="text-[#414651] hover:text-[#181D27]">
                    SWR for Client Data
                  </a>
                </div>

                <a href="#caching" className="text-fd-primary hover:text-[#181D27]">
                  Caching Strategies
                </a>
                <div className="flex flex-col gap-1.5 pl-3">
                  <a href="#request-memoization" className="text-[#414651] hover:text-[#181D27]">
                    Request Memoization
                  </a>
                  <a href="#data-cache" className="text-[#414651] hover:text-[#181D27]">
                    Data Cache
                  </a>
                  <a href="#full-route-cache" className="text-[#414651] hover:text-[#181D27]">
                    Full Route Cache
                  </a>
                </div>

                <a href="#error-handling" className="text-fd-primary hover:text-[#181D27]">
                  Error Handling
                </a>
                <div className="flex flex-col gap-1.5 pl-3">
                  <a href="#error-boundaries" className="text-[#414651] hover:text-[#181D27]">
                    Error Boundaries
                  </a>
                  <a href="#loading-states" className="text-[#414651] hover:text-[#181D27]">
                    Loading States
                  </a>
                </div>

                <a href="#best-practices" className="text-fd-primary hover:text-[#181D27]">
                  Best Practices
                </a>
              </div>
            </nav>
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
