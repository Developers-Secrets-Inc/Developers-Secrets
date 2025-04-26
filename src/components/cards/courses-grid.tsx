'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { CourseWithStartUrl } from '@/core/courses'
import { NoCoursesCard } from './no-courses-card'

interface CoursesGridProps {
  courses: CourseWithStartUrl[]
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
          className="w-[360px]"
        >
          <Card className="w-full h-full hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <Badge variant="outline" className="text-xs capitalize">
                  {typeof course.difficulty === 'string' ? course.difficulty : 'N/A'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
              <div>
                {' '}
                {/* Group top content */}
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description || 'No description provided.'}
                </p>
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
              <Button className="w-full group mt-auto" asChild>
                <Link href={course.startUrl ?? `/courses/${course.slug}`}>
                  {' '}
                  View Course
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
