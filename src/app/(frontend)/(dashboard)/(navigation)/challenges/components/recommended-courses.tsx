import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getCoursesWithStartUrl, getRecommendedCourses } from '@/core/courses'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { Skeleton } from '@/components/ui/skeleton'

function getDifficultyBadgeStyle(difficulty?: string) {
  if (!difficulty) return 'bg-gray-500/10 text-gray-500'
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-500/10 text-emerald-500'
    case 'intermediate':
      return 'bg-amber-500/10 text-amber-500'
    case 'advanced':
      return 'bg-red-500/10 text-red-500'
    case 'expert':
      return 'bg-purple-500/10 text-purple-500'
    default:
      return 'bg-gray-500/10 text-gray-500'
  }
}

export async function RecommendedCourses() {
  const recommendedCourses = await getRecommendedCourses()

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center mb-4">
          <CardTitle className="text-lg font-semibold">Recommended Courses</CardTitle>
          <Button asChild variant="outline" size="sm" className="ml-auto">
            <Link href="/courses">See all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {recommendedCourses.map((course) => (
            <Card key={course.id} className="relative flex flex-col items-stretch p-0 h-full">
              <CardContent className="flex flex-col justify-between h-full p-3 pb-4">
                <div className="flex items-start justify-between w-full mb-2 relative">
                  <div className="flex items-center justify-center w-10 h-10">
                    <PythonLogoIcon className="w-7 h-7" />
                  </div>
                  {course.difficulty && (
                    <Badge
                      className={
                        getDifficultyBadgeStyle(course.difficulty) +
                        ' absolute top-0 right-0 mt-1 mr-1'
                      }
                      variant="secondary"
                      style={{ zIndex: 1 }}
                    >
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-start w-full mt-2">
                  <span
                    className="font-medium text-base leading-tight truncate w-full"
                    title={course.name}
                  >
                    {course.name}
                  </span>
                  <CardDescription
                    className="truncate text-xs w-full mt-1"
                    title={course.description || undefined}
                  >
                    {course.description || 'No description provided.'}
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                  <Link href={course.startUrl ?? `/courses/${course.slug}`}>Start</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RecommendedCoursesSkeleton() {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center mb-4">
          <CardTitle className="text-lg font-semibold">Recommended Courses</CardTitle>
          <Button variant="outline" size="sm" className="ml-auto" disabled>
            See all
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="relative flex flex-col items-stretch p-0 h-full">
              <CardContent className="flex flex-col justify-between h-full p-3 pb-4">
                <div className="flex items-start justify-between w-full mb-2 relative">
                  <Skeleton className="w-10 h-10" />
                  <Skeleton className="h-5 w-16 absolute top-0 right-0 mt-1 mr-1" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-1 self-start" />
                <Skeleton className="h-3 w-full mt-1 self-start" />
                <Skeleton className="h-8 w-full mt-3 self-center" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
