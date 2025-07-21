import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, BookOpen } from 'lucide-react'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { LinkButton } from '@/components/common/link-button'

export default function TutorialNotFound() {
  return (
    <>
      <HomeHeader />
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tutorial Not Found</h1>
            <p className="text-muted-foreground">
              The tutorial you&apos;re looking for doesn&apos;t exist or has been moved to a
              different location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <HomeButton />
            <BrowseAllTutorialsButton />
          </div>
        </div>
      </div>
    </>
  )
}



const HomeButton = () => {
  return (
     <LinkButton href="/" className="flex items-center gap-2">
      <Home className="h-4 w-4" />
      Return Home
    </LinkButton>
  )
}

const BrowseAllTutorialsButton = () => {
  return (
    <LinkButton href="/articles" className="flex items-center gap-2" variant="outline">
      <ArrowLeft className="h-4 w-4" />
      Browse All Tutorials
    </LinkButton>
  )
}
