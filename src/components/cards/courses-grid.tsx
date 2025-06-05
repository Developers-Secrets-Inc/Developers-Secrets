'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useCourseGrid } from '@/core/courses/hooks/use-course-grid'
import { CourseCard } from '@/core/courses/components/dashboard/course-card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'
import { NoCoursesCard } from './no-courses-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useQueryState } from 'nuqs'

export function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-56 w-full" />
      ))}
    </div>
  )
}

interface CoursesGridProps {
  userId: string | null
}

interface CourseLinkWrapperProps {
  courseSlug: string
  defaultHref: string
  children: React.ReactNode
}

const difficulties = [
  { value: 'all', label: 'All difficulties' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
]

const CourseLinkWrapper: React.FC<CourseLinkWrapperProps> = ({
  courseSlug,
  defaultHref,
  children,
}) => {
  const [effectiveHref, setEffectiveHref] = useState(defaultHref)

  React.useEffect(() => {
    const lastVisitedUrl = localStorage.getItem('lastVisitedPartUrl')
    const lastVisitedCourseSlug = localStorage.getItem('lastVisitedCourseSlug')

    if (lastVisitedUrl && lastVisitedCourseSlug === courseSlug) {
      setEffectiveHref(lastVisitedUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Link href={effectiveHref}>{children}</Link>
}

export const CoursesGrid = ({ userId }: CoursesGridProps) => {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [difficultyFilter, setDifficultyFilter] = useQueryState('difficulty', {
    defaultValue: 'all',
  })
  const [showLocked, setShowLocked] = useQueryState('locked', {
    defaultValue: true,
    parse: (v) => v === 'true',
    serialize: (v) => String(v),
  })
  const [page, setPage] = useQueryState('page', {
    defaultValue: 1,
    parse: Number,
    serialize: String,
  })
  const [pageSize, setPageSize] = useQueryState('pageSize', {
    defaultValue: 9,
    parse: Number,
    serialize: String,
  })

  const {
    data: paginatedCoursesRaw,
    isLoading,
    totalPages,
  } = useCourseGrid({
    search,
    difficulty: difficultyFilter,
    showLocked,
    page,
    pageSize,
  })

  // Trier les cours : non verrouillés d'abord, puis verrouillés (avant pagination)
  const sortedCourses = React.useMemo(() => {
    if (!paginatedCoursesRaw) return []
    return [...paginatedCoursesRaw].sort((a, b) => {
      const isLockedA = !a.orderedChapters || a.orderedChapters.length === 0
      const isLockedB = !b.orderedChapters || b.orderedChapters.length === 0
      return Number(isLockedA) - Number(isLockedB)
    })
  }, [paginatedCoursesRaw])

  // Reset page à 1 si filtres changent (hors page/pageSize)
  React.useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, difficultyFilter, showLocked, pageSize])

  const clearFilters = () => {
    setSearch('')
    setDifficultyFilter('all')
    setShowLocked(true)
    setPage(1)
    setPageSize(9)
  }
  const filtersAreDefault =
    search === '' &&
    difficultyFilter === 'all' &&
    showLocked === true &&
    page === 1 &&
    pageSize === 9

  // Afficher les filtres même si aucun cours n'est trouvé
  const filters = (
    <div className="flex flex-wrap items-center gap-2 mb-4 w-full overflow-x-auto">
      <Input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 max-w-[180px]"
      />
      <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
        <SelectTrigger className="w-36 min-w-[120px]">
          {difficulties.find((d) => d.value === difficultyFilter)?.label || 'All difficulties'}
        </SelectTrigger>
        <SelectContent>
          {difficulties.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label className="flex items-center gap-2 text-sm whitespace-nowrap">
        <Checkbox checked={showLocked} onCheckedChange={(checked) => setShowLocked(!!checked)} />
        Show locked
      </label>
      <Button
        variant="ghost"
        size="sm"
        className="ml-2"
        onClick={clearFilters}
        disabled={filtersAreDefault}
      >
        Clear filters
      </Button>
      <div className="flex items-center gap-2 ml-auto flex-nowrap">
        <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
          <SelectTrigger className="w-24 min-w-[110px]">{pageSize} / page</SelectTrigger>
          <SelectContent>
            {[6, 9, 12, 18].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <span className="text-xs min-w-[60px] text-center">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <>
        {filters}
        <CourseGridSkeleton />
      </>
    )
  }

  if (!sortedCourses || sortedCourses.length === 0) {
    return (
      <>
        {filters}
        <NoCoursesCard />
      </>
    )
  }

  return (
    <>
      {filters}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCourses.map((course) => {
          const isLocked = !course.orderedChapters || course.orderedChapters.length === 0
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn(isLocked && 'relative')}
            >
              {isLocked ? (
                <div className="w-full h-full cursor-not-allowed opacity-75">
                  <CourseCard course={course} userId={userId ?? ''} />
                  <div className="absolute inset-0 bg-background/10 rounded-lg" />
                </div>
              ) : (
                <CourseLinkWrapper
                  courseSlug={course.slug}
                  defaultHref={course.startUrl ?? `/courses/${course.slug}`}
                >
                  <CourseCard course={course} userId={userId ?? ''} />
                </CourseLinkWrapper>
              )}
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
