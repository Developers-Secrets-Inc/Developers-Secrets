import { Course } from '@/payload-types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { CourseProgressionGauge } from '@/core/courses/components/dashboard/course-progression-gauge'
import { hasUserStartedCourse } from '@/core/courses/progression'
import { CourseButton } from './course-button'
import { Skeleton } from '@/components/ui/skeleton'

type CourseDifficulty = Course['difficulty']
type BadgeStyle = `bg-${string}-500/10 text-${string}-500`

const DifficultyBadge = ({ difficulty }: { difficulty: CourseDifficulty }) => {
  const styles: Record<CourseDifficulty, BadgeStyle> = {
    beginner: 'bg-emerald-500/10 text-emerald-500',
    intermediate: 'bg-amber-500/10 text-amber-500',
    advanced: 'bg-red-500/10 text-red-500',
    expert: 'bg-purple-500/10 text-purple-500',
  }

  return (
    <Badge className={cn(styles[difficulty], 'text-xs')} variant="secondary">
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  )
}

export const LearningPathCourseCard = async ({ course, userId }: { course: Course; userId: string }) => {
  const isStarted = await hasUserStartedCourse(userId, course.id)

  return (
    <Card className="w-full mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <CardHeader>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{course.name}</CardTitle>
                <DifficultyBadge difficulty={course.difficulty} />
              </div>
              <div className="flex items-center gap-2">
                {course.isProCourse && <Badge variant="destructive">PRO</Badge>}
                <div className="transform scale-75">
                  <CourseProgressionGauge course={course} userId={userId} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{course.description}</CardDescription>
          </CardContent>
        </div>
        <CardFooter className="flex items-center justify-end md:border-l">
          <CourseButton course={course} userId={userId} isStarted={isStarted} />
        </CardFooter>
      </div>
    </Card>
  )
}

export const LearningPathCourseCardSkeleton = () => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-full h-4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-full h-4" />
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
