'use client'

import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { BookOpen, PlayCircle, Clock, ChevronRight } from 'lucide-react'
import { useLastVisitedCourse } from '@/api/courses/last-visited/hooks/use-last-visited-course'
import { useUser } from '@/core/users/hooks/use-user'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Affiche une carte permettant à l'utilisateur de reprendre le dernier cours visité,
 * en se basant sur les informations stockées dans la base de données.
 */

const CurrentCourseCardSkeleton = () => {
  return (
    <CurrentCourseCardRoot>
      <CurrentCourseCardLeft>
        <CurrentCourseCardHeaderTitle>
          <Skeleton className="h-4 w-3/4" />
        </CurrentCourseCardHeaderTitle>
        <CurrentCourseCardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-16" />
        </CurrentCourseCardHeader>
        <CurrentCourseCardDescription>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CurrentCourseCardDescription>
      </CurrentCourseCardLeft>
      <CurrentCourseCardRight>
        <Skeleton className="h-10 w-32" />
      </CurrentCourseCardRight>
    </CurrentCourseCardRoot>
  )
}

const CurrentCourseCardRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="w-full py-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
        {children}
      </div>
    </Card>
  )
}

const CurrentCourseCardLeft = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 mr-6">{children}</div>
}

const CurrentCourseCardRight = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-end gap-3 flex-shrink-0 mt-4 md:mt-0">{children}</div>
}

const CurrentCourseCardHeaderTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-2 text-sm font-medium text-primary">{children}</div>
}

const CurrentCourseCardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2 mb-1.5 flex-wrap">{children}</div>
}

const CurrentCourseCardDescription = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-1">{children}</div>
}

const CourseDifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const styleMap = {
    beginner: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    intermediate: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    advanced: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    expert: 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  
  const styles = styleMap[difficulty as keyof typeof styleMap] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'

  return (
    <Badge className={cn(styles, 'text-xs capitalize')} variant="secondary">
      {difficulty}
    </Badge>
  )
}

export const CurrentCourseCard = () => {
  const { user } = useUser()
  const { data: lastVisited, isLoading } = useLastVisitedCourse(user?.id)

  if (isLoading) {
    return <CurrentCourseCardSkeleton />
  }

  if (!lastVisited || typeof lastVisited.course === 'number') {
    return (
      <CurrentCourseCardRoot>
        <CurrentCourseCardLeft>
          <CurrentCourseCardHeaderTitle>
            Start your learning journey
          </CurrentCourseCardHeaderTitle>
          <CurrentCourseCardHeader>
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">No course started yet</CardTitle>
          </CurrentCourseCardHeader>
          <CurrentCourseCardDescription>
            <CardDescription>
              Start exploring our courses to see your progress here!
            </CardDescription>
          </CurrentCourseCardDescription>
        </CurrentCourseCardLeft>
        <CurrentCourseCardRight>
          <Button variant="outline" asChild>
            <Link href="/courses">
              Browse Courses
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CurrentCourseCardRight>
      </CurrentCourseCardRoot>
    )
  }

  const course = lastVisited.course
  const courseSlug = course.slug || 'unknown'
  const chapterSlug = lastVisited.lastChapterSlug || 'chapter-1'
  const partSlug = lastVisited.lastPartSlug || 'part-1'

  return (
    <CurrentCourseCardRoot>
      <CurrentCourseCardLeft>
        <CurrentCourseCardHeaderTitle>
          Continue your course
        </CurrentCourseCardHeaderTitle>
        <CurrentCourseCardHeader>
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{course.name}</CardTitle>
            {course.difficulty && (
              <CourseDifficultyBadge difficulty={course.difficulty} />
            )}
          </CurrentCourseCardHeader>
        <CurrentCourseCardDescription>
          <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last visited: {new Date(lastVisited.lastVisitedAt).toLocaleDateString()}
          </CardDescription>
        </CurrentCourseCardDescription>
      </CurrentCourseCardLeft>
      <CurrentCourseCardRight>
        <Button asChild>
          <Link href={`/courses/${courseSlug}/${chapterSlug}/${partSlug}/description`}>
            Resume Course
          </Link>
        </Button>
      </CurrentCourseCardRight>
    </CurrentCourseCardRoot>
  )
}

CurrentCourseCard.Root = CurrentCourseCardRoot
CurrentCourseCard.Left = CurrentCourseCardLeft
CurrentCourseCard.Right = CurrentCourseCardRight
CurrentCourseCard.HeaderTitle = CurrentCourseCardHeaderTitle
CurrentCourseCard.Header = CurrentCourseCardHeader
CurrentCourseCard.Description = CurrentCourseCardDescription
