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
  return (
    <Card className="w-full border-dashed border-border">
      <CardContent>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Courses coming soon
        </CardTitle>
        <CardDescription>
          Our training courses will be available very soon. Stay tuned!
        </CardDescription>
      </CardContent>
    </Card>
  )
}
