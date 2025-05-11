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
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </div>
          <Skeleton className="h-10 w-28" />
        </CardHeader>
        <CardFooter className="pt-4 pb-4 flex flex-col items-start text-sm text-muted-foreground border-t mt-4">
          <div className="flex items-center justify-around w-full">
            <div className="flex flex-col items-center">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-6 w-px bg-border mx-4" />
            <div className="flex flex-col items-center">
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </CardFooter>
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
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Pick up where you left off
          </CardTitle>
          <CardDescription>Continue course: {displayName}</CardDescription>
        </div>
        <Button asChild className="group">
          <Link href={lastUrl}>
            <PlayCircle className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
            Continue
          </Link>
        </Button>
      </CardHeader>
      <CardFooter className="pt-4 pb-4 flex flex-col items-start text-sm text-muted-foreground border-t mt-4">
        {isLoadingProgress && (
          <div className="flex items-center gap-2 w-full">
            <ListChecks className="h-4 w-4 animate-pulse" />
            <span>Loading progress...</span>
          </div>
        )}
        {errorProgress && !isLoadingProgress && (
          <div className="text-red-500 w-full">Error: {errorProgress}</div>
        )}
        {!isLoadingProgress && !errorProgress && courseProgress && (
          <div className="flex items-center justify-around w-full">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Chapters</span>
              <span className="font-semibold text-foreground">
                {courseProgress.completedChapters} / {courseProgress.totalChapters}
              </span>
            </div>
            <Separator orientation="vertical" className="h-6 mx-4" />
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Parts</span>
              <span className="font-semibold text-foreground">
                {courseProgress.completedParts} / {courseProgress.totalParts}
              </span>
            </div>
          </div>
        )}
        {!isLoadingProgress && !errorProgress && !courseProgress && lastUrl && (
          <div className="flex items-center gap-2 w-full">
            <ListChecks className="h-4 w-4" />
            <span>View progress after continuing.</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
