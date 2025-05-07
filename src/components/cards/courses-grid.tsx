'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, Users, MoreVertical, Target, LockIcon } from 'lucide-react'
import Link from 'next/link'
import type { CourseWithStartUrl } from '@/core/courses'
import { NoCoursesCard } from './no-courses-card'
import { cn } from '@/lib/utils'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { Gauge } from '@/components/ui/gauge'
import { getCourseCompletedPartsCount } from '@/core/courses/progression/completion-status'

interface CoursesGridProps {
  courses: CourseWithStartUrl[]
  userId: string | null
}

interface CourseLinkWrapperProps {
  courseSlug: string
  defaultHref: string
  children: React.ReactNode
}

// Helper function to format timestamp to "time ago" string
const formatTimeAgo = (timestamp: number | null): string => {
  if (timestamp === null) {
    return 'Not visited yet'
  }
  const now = Date.now()
  const seconds = Math.round((now - timestamp) / 1000)

  if (seconds < 60) return 'Visited just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `Visited ${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Visited ${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `Visited ${days}d ago`
  const weeks = Math.round(days / 7)
  if (weeks < 4) return `Visited ${weeks}w ago`
  const months = Math.round(days / 30) // Approximation
  if (months < 12) return `Visited ${months}mo ago`
  const years = Math.round(days / 365) // Approximation
  return `Visited ${years}y ago`
}

const CourseLinkWrapper: React.FC<CourseLinkWrapperProps> = ({
  courseSlug,
  defaultHref,
  children,
}) => {
  const [effectiveHref, setEffectiveHref] = useState(defaultHref)

  useEffect(() => {
    const lastVisitedUrl = localStorage.getItem('lastVisitedPartUrl')
    const lastVisitedCourseSlug = localStorage.getItem('lastVisitedCourseSlug')

    if (lastVisitedUrl && lastVisitedCourseSlug === courseSlug) {
      setEffectiveHref(lastVisitedUrl)
    }
    // On ne veut exécuter ceci qu'au montage côté client
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // courseSlug et defaultHref ne changeront pas après le rendu initial du serveur

  return <Link href={effectiveHref}>{children}</Link>
}

export const CoursesGrid = ({ courses, userId }: CoursesGridProps) => {
  if (!courses || courses.length === 0) {
    return <NoCoursesCard />
  }

  // Trier les cours : non verrouillés d'abord, puis verrouillés
  const sortedCourses = [...courses].sort((a, b) => {
    const isLockedA = !a.orderedChapters || a.orderedChapters.length === 0
    const isLockedB = !b.orderedChapters || b.orderedChapters.length === 0
    // Convertir les booléens en nombres (false=0, true=1) pour le tri
    return Number(isLockedA) - Number(isLockedB)
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedCourses.map((course) => {
        // Vérifier si le cours est verrouillé (pas de chapitres)
        // Assurez-vous que `orderedChapters` est bien inclus dans `CourseWithStartUrl`
        const isLocked = !course.orderedChapters || course.orderedChapters.length === 0

        // State for last visited text
        const [lastVisitedText, setLastVisitedText] = useState<string>('Loading...')
        // State for gauge
        const [gaugeValue, setGaugeValue] = useState(0)
        const [isLoadingGauge, setIsLoadingGauge] = useState(true)

        useEffect(() => {
          if (typeof window !== 'undefined' && course.slug) {
            const storedTimestamp = localStorage.getItem(`lastVisitedTimestamp_${course.slug}`)
            const timestamp = storedTimestamp ? parseInt(storedTimestamp, 10) : null
            setLastVisitedText(formatTimeAgo(timestamp))
          } else {
            setLastVisitedText(formatTimeAgo(null))
          }
        }, [course.slug]) // Rerun if course.slug changes

        useEffect(() => {
          const fetchCompletedParts = async () => {
            if (
              userId &&
              course.allPartIds &&
              course.allPartIds.length > 0 &&
              course.totalPartsCount
            ) {
              setIsLoadingGauge(true)
              try {
                const completedCount = await getCourseCompletedPartsCount(userId, course.allPartIds)
                const percentage =
                  course.totalPartsCount > 0
                    ? Math.round((completedCount / course.totalPartsCount) * 100)
                    : 0
                setGaugeValue(percentage)
              } catch (error) {
                console.error('Error fetching completed parts count:', error)
                setGaugeValue(0) // Default to 0 on error
              }
              setIsLoadingGauge(false)
            } else {
              setGaugeValue(0)
              setIsLoadingGauge(false)
            }
          }
          fetchCompletedParts()
        }, [userId, course.allPartIds, course.totalPartsCount])

        const cardInnerContent = (
          <Card className="w-full h-full hover:shadow-lg transition-shadow flex flex-col p-1 pb-0 relative gap-0">
            <CardContent className="space-y-3 flex-grow flex flex-col justify-between pt-3 px-3">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-muted/50 rounded-md flex items-center justify-center w-10 h-10">
                  <PythonLogoIcon className="w-7 h-7" />
                </div>
                {/* Container pour Badge et LockIcon */}
                <div className="flex items-center gap-2">
                  {isLocked && <LockIcon className="h-4 w-4 text-muted-foreground" />}
                  {typeof course.difficulty === 'string' ? (
                    (() => {
                      const difficulty = course.difficulty.toLowerCase()
                      const styles = {
                        beginner: 'bg-emerald-500/10 text-emerald-500',
                        intermediate: 'bg-amber-500/10 text-amber-500',
                        advanced: 'bg-red-500/10 text-red-500',
                        expert: 'bg-purple-500/10 text-purple-500',
                        default: 'bg-gray-500/10 text-gray-500',
                      }
                      const badgeStyle = styles[difficulty as keyof typeof styles] || styles.default

                      return (
                        <Badge className={cn(badgeStyle, 'text-xs')} variant="secondary">
                          {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                        </Badge>
                      )
                    })()
                  ) : (
                    <Badge variant="outline" className="text-xs capitalize">
                      N/A
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg font-medium mb-1">{course.name}</CardTitle>
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description || 'No description provided.'}
                </p>
                {/* Section pour les tags de compétences */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="secondary">Python Basics</Badge>
                  <Badge variant="secondary">Loops</Badge>
                  <Badge variant="secondary">Functions</Badge>
                  <Badge variant="secondary">...</Badge>
                </div>

                {/* Ajouter la bordure pointillée */}
                <div className="border-b border-dashed border-border my-3"></div>
              </div>
            </CardContent>
            {/* Nouveau conteneur pour les infos et le bouton en bas */}
            <div className="flex justify-between items-center px-3 pb-3 mt-auto">
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{lastVisitedText}</span>
                <span className="mx-1">·</span>
                <Target className="h-3 w-3 mr-1" />
                <span>{course.totalPartsCount ?? 0} challenges</span>
              </div>
              {/* Gauge component replaces the Button */}
              <div className="transform scale-75">
                {isLoadingGauge ? (
                  <div className="h-[27px] w-[27px] flex items-center justify-center">
                    {' '}
                    {/* Adjust size to match scaled gauge */}
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>{' '}
                    {/* Changed to border-primary */}
                  </div>
                ) : (
                  <Gauge value={gaugeValue} size="small" showValue={true} />
                )}
              </div>
            </div>
            {/* Overlay seulement si verrouillé et PAS à l'intérieur de la Card */}
          </Card>
        )

        return (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(isLocked && 'relative')} // Nécessaire pour positionner l'overlay
          >
            {isLocked ? (
              <div
                className={cn(
                  'w-full h-full cursor-not-allowed opacity-75',
                  // 'relative' // Déplacé vers motion.div pour que l'overlay fonctionne
                )}
              >
                {cardInnerContent}
                {/* Overlay appliqué ici, à l'extérieur de la Card mais à l'intérieur du wrapper */}
                <div className="absolute inset-0 bg-background/10 rounded-lg" />
              </div>
            ) : (
              <CourseLinkWrapper
                courseSlug={course.slug}
                defaultHref={course.startUrl ?? `/courses/${course.slug}`}
              >
                {cardInnerContent}
              </CourseLinkWrapper>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
