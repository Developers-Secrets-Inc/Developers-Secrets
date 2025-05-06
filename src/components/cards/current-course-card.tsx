'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PlayCircle, BookOpen } from 'lucide-react'

/**
 * Affiche une carte permettant à l'utilisateur de reprendre le dernier cours visité,
 * en se basant sur les informations stockées dans localStorage.
 */
export const CurrentCourseCard = () => {
  const [lastUrl, setLastUrl] = useState<string | null>(null)
  const [lastCourseSlug, setLastCourseSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Exécuté uniquement côté client après le montage
    const storedUrl = localStorage.getItem('lastVisitedPartUrl')
    const storedSlug = localStorage.getItem('lastVisitedCourseSlug')

    setLastUrl(storedUrl)
    setLastCourseSlug(storedSlug)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
        <CardContent className="pt-4">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!lastUrl) {
    // Si aucune URL n'est stockée, afficher une carte invitant à commencer un cours.
    return (
      <Card className="w-full max-w-lg border-dashed border-border">
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

  // Extraire un nom de cours plus lisible (simpliste)
  const courseName = lastCourseSlug
    ? lastCourseSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Last Visited Course'

  return (
    <Card className="w-full max-w-lg hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Pick up where you left off
        </CardTitle>
        <CardDescription>Continue course: {courseName}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Button asChild className="w-full group">
          <Link href={lastUrl}>
            <PlayCircle className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
            Continue
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
