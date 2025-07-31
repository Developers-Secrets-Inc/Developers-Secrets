import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getRandomCourses } from '@/api/courses/navigation'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { LockIcon } from 'lucide-react'

function getDifficultyBadgeStyle(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'intermediate':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'advanced':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'expert':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

interface RecommendedCourse {
  id: number
  name: string
  slug: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  description?: string | null
  ogImage?: number | null
  hasChapters: boolean
  status?: 'draft' | 'published'
}

export async function RecommendedCourses() {
  const courses = await getRandomCourses({ count: 3 })

  if (courses.length === 0) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="flex items-center mb-4">
            <CardTitle className="text-lg font-semibold">Recommended Courses</CardTitle>
          </div>
          <div className="text-center text-muted-foreground py-8">
            Our training courses will be available very soon. Stay tuned!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold">Recommended Courses</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/courses">Browse all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="relative flex flex-col items-stretch p-0 h-full">
              <CardContent className="flex flex-col justify-between h-full p-3 pb-4">
                <div>
                  <div className="flex items-start justify-between w-full mb-2 relative">
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                      <PythonLogoIcon className="w-6 h-6" />
                    </div>
                    <Badge 
                      className={`absolute top-0 right-0 mt-1 mr-1 ${getDifficultyBadgeStyle(course.difficulty)}`}
                    >
                      {capitalizeFirstLetter(course.difficulty)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  {(course.hasChapters && course.status === 'published') ? (
                    <Button 
                      size="sm" 
                      className="w-full" 
                      asChild
                    >
                      <Link href={`/courses/${course.slug}`}>
                        Start Course
                      </Link>
                    </Button>
                  ) : (
                    <div className="relative">
                      <Button 
                        size="sm" 
                        className="w-full" 
                        disabled
                      >
                        Coming Soon
                      </Button>
                      <div className="absolute inset-0 bg-background/20 rounded-md" />
                    </div>
                  )}
                </div>
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
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="relative flex flex-col items-stretch p-0 h-full">
              <CardContent className="flex flex-col justify-between h-full p-3 pb-4">
                <div>
                  <div className="flex items-start justify-between w-full mb-2 relative">
                    <div className="w-10 h-10 bg-muted animate-pulse rounded-md" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded absolute top-0 right-0 mt-1 mr-1" />
                  </div>
                  <div className="h-5 w-3/4 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3 w-full bg-muted animate-pulse rounded mt-1" />
                </div>
                <div className="h-8 w-full bg-muted animate-pulse rounded mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
