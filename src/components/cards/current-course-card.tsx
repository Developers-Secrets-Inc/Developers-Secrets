'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PlayCircle, BookOpen, ListChecks } from 'lucide-react'
import { useCurrentCourse } from '@/core/courses/hooks/use-current-course'

/**
 * Affiche une carte permettant à l'utilisateur de reprendre le dernier cours visité,
 * en se basant sur les informations stockées dans localStorage, et affiche sa progression.
 */
export const CurrentCourseCard = () => {
  const {
    lastCourseSlug,
    lastUrl,
    courseProgress,
    isLoading,
    error: errorProgress,
  } = useCurrentCourse()

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Colonne gauche skeleton */}
          <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
            <div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
          {/* Colonne droite skeleton */}
          <div className="flex flex-col justify-center items-center min-w-[140px] md:border-l md:pl-6">
            <div className="flex flex-col items-center mb-2 w-full">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex flex-col items-center w-full">
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!lastUrl) {
    return (
      <Card className="w-full border-dashed border-border">
        <CardContent>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Start Learning
          </CardTitle>
          <CardDescription>
            You haven&apos;t started any courses yet. Explore our catalog to find your next
            challenge!
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  const displayName =
    courseProgress?.courseName ||
    (lastCourseSlug
      ? lastCourseSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Last Visited Course')

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Colonne gauche */}
        <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Pick up where you left off
            </CardTitle>
            <CardDescription className="mt-1 truncate">
              Continue course: {displayName}
            </CardDescription>
          </div>
          <Button asChild className="mt-4 w-fit">
            <Link href={lastUrl}>
              <PlayCircle className="h-5 w-5 mr-2" />
              Continue
            </Link>
          </Button>
        </div>
        {/* Colonne droite */}
        <div className="flex flex-col justify-center items-center min-w-[140px] md:border-l md:pl-6">
          {isLoading && (
            <div className="flex items-center gap-2 w-full">
              <ListChecks className="h-4 w-4 animate-pulse" />
              <span>Loading progress...</span>
            </div>
          )}
          {errorProgress && !isLoading && (
            <div className="text-red-500 w-full text-sm">Error: {String(errorProgress)}</div>
          )}
          {!isLoading && !errorProgress && courseProgress && (
            <>
              <div className="flex flex-col items-center mb-2">
                <span className="text-xs text-muted-foreground">Chapters</span>
                <span className="font-semibold text-foreground">
                  {courseProgress.completedChapters} / {courseProgress.totalChapters}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Parts</span>
                <span className="font-semibold text-foreground">
                  {courseProgress.completedParts} / {courseProgress.totalParts}
                </span>
              </div>
            </>
          )}
          {!isLoading && !errorProgress && !courseProgress && lastUrl && (
            <div className="flex items-center gap-2 w-full">
              <ListChecks className="h-4 w-4" />
              <span>View progress after continuing.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
