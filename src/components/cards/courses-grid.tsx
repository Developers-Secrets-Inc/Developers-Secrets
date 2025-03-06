'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronRight, Clock, Target } from 'lucide-react'
import Link from 'next/link'

const coursesData = [
  {
    id: 1,
    title: 'Advanced Web Development',
    description: 'Master modern web development with React, Next.js, and TypeScript',
    level: 'Intermediate',
    duration: '8 weeks',
    progress: 0,
    totalModules: 12,
    completedModules: 0,
  },
  {
    id: 2,
    title: 'Backend Development with Node.js',
    description: 'Build scalable backend services with Node.js and Express',
    level: 'Advanced',
    duration: '10 weeks',
    progress: 0,
    totalModules: 15,
    completedModules: 0,
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and experience design',
    level: 'Beginner',
    duration: '6 weeks',
    progress: 0,
    totalModules: 8,
    completedModules: 0,
  },
  {
    id: 4,
    title: 'Mobile App Development',
    description: 'Create cross-platform mobile apps with React Native',
    level: 'Intermediate',
    duration: '12 weeks',
    progress: 0,
    totalModules: 18,
    completedModules: 0,
  },
  {
    id: 5,
    title: 'Cloud Computing & DevOps',
    description: 'Master cloud platforms and DevOps practices with AWS and Docker',
    level: 'Advanced',
    duration: '10 weeks',
    progress: 0,
    totalModules: 14,
    completedModules: 0,
  },
  {
    id: 6,
    title: 'Data Science Fundamentals',
    description: 'Introduction to data analysis and machine learning basics',
    level: 'Intermediate',
    duration: '8 weeks',
    progress: 0,
    totalModules: 10,
    completedModules: 0,
  },
]

export const CoursesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coursesData.map((course) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[360px]"
        >
          <Card className="w-full h-full hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {course.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
              </div>
              <Progress value={course.progress} className="h-2" />
              <Button className="w-full group" asChild>
                <Link href={`/courses/${course.id}`}>
                  Start Course
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
