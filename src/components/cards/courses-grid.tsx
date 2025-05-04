'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, Users, MoreVertical, Target } from 'lucide-react'
import Link from 'next/link'
import type { CourseWithStartUrl } from '@/core/courses'
import { NoCoursesCard } from './no-courses-card'
import { cn } from '@/lib/utils'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'

interface CoursesGridProps {
  courses: CourseWithStartUrl[]
}

interface CourseLinkWrapperProps {
  courseSlug: string
  defaultHref: string
  children: React.ReactNode
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

export const CoursesGrid = ({ courses }: CoursesGridProps) => {
  if (!courses || courses.length === 0) {
    return <NoCoursesCard />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CourseLinkWrapper
            courseSlug={course.slug}
            defaultHref={course.startUrl ?? `/courses/${course.slug}`}
          >
            <Card className="w-full h-full hover:shadow-lg transition-shadow flex flex-col p-1 pb-0 cursor-pointer relative gap-2">
              <CardContent className="space-y-3 flex-grow flex flex-col justify-between pt-3 px-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-muted/50 rounded-md flex items-center justify-center w-10 h-10">
                    <PythonLogoIcon className="w-7 h-7" />
                  </div>
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

                  {/* Placeholder for duration/modules - remove or adapt later */}
                  {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      <span>
                        {course.completedModules}/{course.totalModules} modules
                      </span>
                    </div>
                  </div> */}
                  {/* <Progress value={course.progress} className="h-2" /> */}
                </div>
              </CardContent>
              {/* Nouveau conteneur pour les infos et le bouton en bas */}
              <div className="flex justify-between items-center px-3 pb-3 mt-auto">
                {' '}
                {/* Utiliser mt-auto pour pousser vers le bas */}
                {/* Informations déplacées ici */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Visited 5d ago</span>
                  <span className="mx-1">·</span>
                  <Target className="h-3 w-3 mr-1" />
                  <span>35 challenges</span>
                </div>
                {/* Bouton d'options déplacé ici */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-8 h-8 border"
                  onClick={(e) => {
                    e.preventDefault() // Empêcher la navigation du lien parent
                    e.stopPropagation() // Arrêter la propagation pour éviter les clics multiples
                    console.log('Options clicked for course:', course.id)
                    // TODO: Implémenter la logique du menu d'options
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </CourseLinkWrapper>
        </motion.div>
      ))}
    </div>
  )
}
