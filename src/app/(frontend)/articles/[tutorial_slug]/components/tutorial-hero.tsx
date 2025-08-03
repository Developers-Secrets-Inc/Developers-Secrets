import Link from 'next/link'
import { BookOpenIcon, GraduationCapIcon, CodeIcon, ExternalLinkIcon, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'

export const TutorialHero = ({ tutorialSlug }: { tutorialSlug: string }) => {
  return (
    <div className="relative h-64 border-b flex flex-col items-center justify-end pb-2">
      <div className="flex flex-col items-center mb-4">
        <div className="border border-border rounded-md p-2 w-20 h-20 flex items-center justify-center shadow-md">
          <PythonLogoIcon size={64} />
        </div>
        <div className="mt-2 text-2xl font-semibold">Python Tutorials</div>
      </div>
      <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
        <Button
          className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          variant="outline"
          aria-label="Tutorials"
          asChild
        >
          <Link href={`/articles/${tutorialSlug}`} className="flex items-center gap-2">
            <BookOpenIcon size={16} aria-hidden="true" />
            Tutorials
          </Link>
        </Button>
        <Button
          className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          variant="outline"
          aria-label="Formation"
          asChild
        >
          <Link href="/courses/python" className="flex items-center gap-2">
            <Badge
              variant="default"
              className="w-fit bg-primary/10 border border-primary/20 text-primary"
            >
              PRO
            </Badge>
            Course
          </Link>
        </Button>
        <Button
          className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          variant="outline"
          aria-label="Examples"
          asChild
        >
          <Link href={`/articles/${tutorialSlug}/examples`} className="flex items-center gap-2">
            <CodeIcon size={16} aria-hidden="true" />
            Examples
          </Link>
        </Button>
        <Button
          className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          variant="outline"
          aria-label="References"
          asChild
        >
          <Link href={`/articles/${tutorialSlug}/references`} className="flex items-center gap-2">
            <List size={16} aria-hidden="true" />
            References
          </Link>
        </Button>
      </div>
    </div>
  )
}
