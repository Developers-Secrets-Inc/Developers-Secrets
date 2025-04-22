'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Award, Clock } from 'lucide-react'

export const ProfileCoursesCard = () => {
  const courses = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      completion: 100,
      duration: '8 hours',
      achievements: 5,
      date: '2024-02-10',
    },
    {
      id: 2,
      title: 'React Basics',
      completion: 100,
      duration: '12 hours',
      achievements: 7,
      date: '2024-02-15',
    },
    {
      id: 3,
      title: 'Node.js Backend',
      completion: 85,
      duration: '15 hours',
      achievements: 4,
      date: '2024-02-20',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-xl bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            Completed Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{course.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        <span>{course.achievements} achievements</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Completed on {new Date(course.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      course.completion === 100
                        ? 'bg-green-500/20 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                  >
                    {course.completion}%
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
