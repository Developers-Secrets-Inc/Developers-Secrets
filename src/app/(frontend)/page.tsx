import { HomeHeader } from './components/home-header'
import Link from 'next/link'
import { MoveRight, BookOpen, Code, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Developer Documentation Platform',
  description: 'Comprehensive tutorials and documentation for developers',
  openGraph: {
    title: 'Developer Documentation Platform',
    description: 'Comprehensive tutorials and documentation for developers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Documentation Platform',
    description: 'Comprehensive tutorials and documentation for developers',
  },
}

export default async function HomePage() {
  return (
    <>
      <HomeHeader />

      <section className="py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <span className="mb-3 text-sm tracking-widest text-muted-foreground md:text-base">
              DOCUMENTATION
            </span>
            <h1 className="mt-4 text-balance text-4xl font-semibold lg:text-6xl">
              Comprehensive tutorials and guides for developers
            </h1>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="default">
                <Link href="/articles">
                  Browse tutorials
                  <MoveRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="default">
                <Link href="/articles/getting-started">
                  Getting started
                  <MoveRight className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 lg:mt-8">
              <ul className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground lg:text-base">
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <BookOpen className="size-4" />
                  In-depth tutorials
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <Code className="size-4" />
                  Code examples
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <Sparkles className="size-4" />
                  Best practices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
