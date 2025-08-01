import { useQuery } from '@tanstack/react-query'
import { getCoursesWithStartUrl } from '@/core/courses'
import type { CourseWithStartUrl } from '@/core/courses'
import { getCourseGridInformations, GridCourseInformations } from '../actions'

export function useCourseGrid({
  search,
  difficulty,
  showLocked,
  page,
  pageSize,
}: {
  search: string
  difficulty: string
  showLocked: boolean
  page: number
  pageSize: number
}) {
  const { data: allCourses, isLoading } = useQuery<GridCourseInformations[]>({
    queryKey: ['courses'],
    queryFn: getCourseGridInformations,
    staleTime: 1000 * 60 * 10, // 10 min
  })

  const filtered = (allCourses ?? []).filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      (course.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesDifficulty =
      difficulty === 'all' ||
      (typeof course.difficulty === 'string' && course.difficulty.toLowerCase() === difficulty)
    const isLocked = course.isLocked
    const matchesLocked = showLocked ? true : !isLocked
    return matchesSearch && matchesDifficulty && matchesLocked
  })

  const totalCourses = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCourses / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return {
    data: paginated,
    isLoading,
    totalCourses,
    totalPages,
  }
}
