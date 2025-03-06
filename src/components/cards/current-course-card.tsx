'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { motion, useAnimation } from 'framer-motion'
import { Award, ChevronRight, Clock, Target, List } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const CurrentCourseCard = () => {
  const controls = useAnimation()
  const completion = 40

  useEffect(() => {
    controls.start({ width: `${completion}%` })
  }, [controls, completion])

  const motionInitial = { opacity: 0, y: 20 }
  const motionAnimate = { opacity: 1, y: 0 }
  const motionTransition = { duration: 0.5 }

  return (
    <motion.div
      initial={motionInitial}
      animate={motionAnimate}
      transition={motionTransition}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden shadow-xl bg-background rounded-lg py-0 w-[640px]">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-xl sm:text-2xl font-bold"
                >
                  Advanced Web Development
                </motion.h2>
                <Badge variant="outline" className="ml-2">
                  Intermediate
                </Badge>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-medium">
                      Current Module
                    </Badge>
                    <span className="text-sm font-semibold">React Hooks</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last activity: 2h ago</span>
                  </div>
                </div>
                <span className="text-sm font-bold">{completion}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={controls}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <Progress
                  value={completion}
                  className="h-2 w-full"
                  aria-label={`Course progress: ${completion}%`}
                />
              </motion.div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-background/50 flex flex-col gap-4 border-t border-border pt-4 px-6 pb-6">
          <div className="flex justify-between w-full text-sm text-muted-foreground">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-1" />
              <span>4/10 Challenges</span>
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              <span>3/5 Quizzes</span>
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button className="flex-1 group" asChild>
              <Link href="/course" className="flex items-center justify-center">
                Continue Learning
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1 group" asChild>
              <Link href="/courses" className="flex items-center justify-center">
                <List className="mr-2 h-5 w-5" />
                All Courses
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
