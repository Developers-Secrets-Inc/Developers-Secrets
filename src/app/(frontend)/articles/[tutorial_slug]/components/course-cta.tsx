import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export const CourseCTA = () => {
  return (
    <section className="border-t border-border mt-12">
      <div className="flex flex-col lg:flex-row overflow-hidden">
        <div className="grow px-8 py-8 lg:px-16">
          <Badge
            variant="default"
            className="w-fit bg-yellow-100 border border-yellow-300 text-yellow-800"
          >
            Python Training
          </Badge>
          <div className="mt-4 max-w-xl">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Master Python with our comprehensive course (EN)
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Learn Python from scratch or boost your skills with hands-on projects, expert guidance, and a supportive community. Perfect for beginners and advanced learners alike.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild>
              <Link href="https://www.python.org/about/gettingstarted/" target="_blank" rel="noopener noreferrer">
                Go to Python Course
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex grow basis-5/12 flex-col justify-center border-t lg:border-t-0 lg:border-l">
          <div className="flex h-full items-center px-9 py-6 transition-colors lg:justify-center">
            <div className="flex gap-4">
              <BookOpen className="size-8 shrink-0 md:size-10 text-yellow-700" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold md:text-xl">Why Learn Python?</h3>
                <p className="max-w-lg text-muted-foreground md:text-md">
                  Python is one of the most popular programming languages for web, data science, automation, and more. Unlock new opportunities by mastering Python today!
                </p>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="flex h-full items-center px-9 py-6 transition-colors lg:justify-center">
            <div className="flex gap-4">
              <BookOpen className="size-8 shrink-0 md:size-10 text-yellow-700" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold md:text-xl">Start Your Python Journey</h3>
                <p className="max-w-lg text-muted-foreground md:text-md">
                  Access interactive lessons, real-world projects, and join a vibrant community of learners and mentors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}