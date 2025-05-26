'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PlayCircle, BookOpen, ListChecks } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

// Import necessary items for progress display
import { getUser } from '@/core/user' // Assuming User type is implicitly handled or we use any
import { getCourseProgressSummary, CourseProgressSummary } from '@/core/courses' // Adjusted path
import type { User } from '@/payload-types' // Import User type

/**
 * Affiche une carte permettant à l'utilisateur de reprendre le dernier cours visité,
 * en se basant sur les informations stockées dans localStorage, et affiche sa progression.
 */
export const CurrentCourseCard = () => {
  const [lastUrl, setLastUrl] = useState<string | null>(null)
  const [lastCourseSlug, setLastCourseSlug] = useState<string | null>(null)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [user, setUser] = useState<User | null>(null) // Explicitly type user or use a relevant User type

  const [courseProgress, setCourseProgress] = useState<CourseProgressSummary | null>(null)
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [errorProgress, setErrorProgress] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingInitial(true) // Start initial loading
      try {
        const fetchedUser = await getUser()
        setUser(fetchedUser as User | null) // Added type assertion for safety

        const storedUrl = localStorage.getItem('lastVisitedPartUrl')
        const storedSlug = localStorage.getItem('lastVisitedCourseSlug')
        setLastUrl(storedUrl)
        setLastCourseSlug(storedSlug)
      } catch (error) {
        console.error('Error fetching initial data or user:', error)
        // Optionally set an error state for user fetching if needed
      } finally {
        setIsLoadingInitial(false) // Finish initial loading
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (user && user.id && lastCourseSlug && !courseProgress && !isLoadingProgress) {
      const fetchProgress = async () => {
        setIsLoadingProgress(true)
        setErrorProgress(null)
        try {
          // Ensure user.id is passed as string if your backend expects it (common for Supabase IDs)
          const summary = await getCourseProgressSummary(String(user.id), lastCourseSlug)
          setCourseProgress(summary)
        } catch (error) {
          console.error('Error fetching course progress:', error)
          setErrorProgress('Could not load course progress.')
        } finally {
          setIsLoadingProgress(false)
        }
      }
      fetchProgress()
    }
    // Dependencies: user, lastCourseSlug. Avoid re-fetching if progress already loaded or is loading.
  }, [user, lastCourseSlug, courseProgress, isLoadingProgress])

  if (isLoadingInitial) {
    return (
      <Card className="w-full py-0">
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Start Learning
          </CardTitle>
          <CardDescription>
            You haven&apos;t started any courses yet. Explore our catalog to find your next
            challenge!
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const displayName =
    courseProgress?.courseName ||
    (lastCourseSlug
      ? lastCourseSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Last Visited Course')

  return (
    <Card className="w-full hover:shadow-md transition-shadow py-0">
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
          {isLoadingProgress && (
            <div className="flex items-center gap-2 w-full">
              <ListChecks className="h-4 w-4 animate-pulse" />
              <span>Loading progress...</span>
            </div>
          )}
          {errorProgress && !isLoadingProgress && (
            <div className="text-red-500 w-full text-sm">Error: {errorProgress}</div>
          )}
          {!isLoadingProgress && !errorProgress && courseProgress && (
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
          {!isLoadingProgress && !errorProgress && !courseProgress && lastUrl && (
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
