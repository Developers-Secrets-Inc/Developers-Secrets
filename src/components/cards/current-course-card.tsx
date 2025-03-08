'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion, useAnimation } from 'framer-motion'
import {
  Award,
  ChevronRight,
  Clock,
  Target,
  List,
  MoreVertical,
  Code,
  BookOpen,
  Unlock,
  PlayCircle,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const CurrentCourseCard = () => {
  const controls = useAnimation()
  const completion = 40

  const courseDetails = {
    description:
      'This comprehensive course covers advanced web development concepts and practices. Students will learn modern React patterns, state management, performance optimization, and best practices for building scalable web applications.',
    skills: [
      'React',
      'TypeScript',
      'OOP',
      'State Management',
      'Performance Optimization',
      'Testing',
    ],
    unlockedCourses: [
      'Backend Development with Node.js',
      'Advanced State Management',
      'Web Security Fundamentals',
    ],
    currentModule: {
      name: 'React Hooks',
      objective: 'Master the fundamentals of React Hooks and build dynamic components',
      nextMilestone: 'Custom Hooks Creation',
    },
    chapters: [
      { name: 'Introduction à React', duration: '1h', status: 'completed' },
      { name: 'Components & Props', duration: '2h', status: 'completed' },
      { name: 'State & Lifecycle', duration: '2h30', status: 'completed' },
      { name: 'Event Handling', duration: '1h30', status: 'completed' },
      { name: 'React Hooks', duration: '2h', status: 'current' },
      { name: 'Custom Hooks', duration: '2h', status: 'locked' },
      { name: 'Context API', duration: '1h30', status: 'locked' },
      { name: 'Redux Basics', duration: '2h', status: 'locked' },
      { name: 'Redux Middleware', duration: '2h', status: 'locked' },
      { name: 'Testing React Apps', duration: '3h', status: 'locked' },
      { name: 'Performance', duration: '2h', status: 'locked' },
      { name: 'Deployment', duration: '1h', status: 'locked' },
    ],
  }

  const [activeChapterIndex, setActiveChapterIndex] = React.useState(
    courseDetails.chapters.findIndex((chapter) => chapter.status === 'current'),
  )

  const currentChapter = courseDetails.chapters[activeChapterIndex]
  const previousChapter =
    activeChapterIndex > 0 ? courseDetails.chapters[activeChapterIndex - 1] : null
  const nextChapter =
    activeChapterIndex < courseDetails.chapters.length - 1
      ? courseDetails.chapters[activeChapterIndex + 1]
      : null

  const showPreviousChapter = () => {
    if (previousChapter) {
      setActiveChapterIndex(activeChapterIndex - 1)
    }
  }

  const showNextChapter = () => {
    if (nextChapter) {
      setActiveChapterIndex(activeChapterIndex + 1)
    }
  }

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
        <CardContent className="p-4 pb-0 sm:p-6 md:p-6 sm:pb-0 md:pb-0">
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
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="ml-2">
                    Intermediate
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 transition-transform duration-200 hover:rotate-90"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Course Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Description
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {courseDetails.description}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {courseDetails.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Unlock className="h-4 w-4" />
                            Unlocked Courses
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {courseDetails.unlockedCourses.map((course) => (
                              <li key={course} className="flex items-center gap-2">
                                <ChevronRight className="h-3 w-3" />
                                {course}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Chapter Progress Overview */}
              <div className="bg-background rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-semibold">4/12 Chapitres complétés</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {courseDetails.chapters.map((chapter, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                              chapter.status === 'completed'
                                ? 'bg-primary'
                                : chapter.status === 'current'
                                  ? 'bg-primary/50'
                                  : 'bg-muted'
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="flex flex-col gap-1 p-2 border border-border bg-transparent backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs">{chapter.name}</span>
                            <Badge
                              variant={
                                chapter.status === 'completed'
                                  ? 'outline'
                                  : chapter.status === 'current'
                                    ? 'outline'
                                    : ('outline' as const)
                              }
                              className={`text-[10px] ${
                                chapter.status === 'completed'
                                  ? 'border-primary text-primary'
                                  : chapter.status === 'current'
                                    ? 'border-primary/50 text-primary/50'
                                    : ''
                              }`}
                            >
                              {chapter.status === 'completed'
                                ? 'Terminé'
                                : chapter.status === 'current'
                                  ? 'En cours'
                                  : 'À venir'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground border-t border-border/50 pt-1 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{chapter.duration}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              {/* Chapters Navigation */}
              <div className="relative h-[86px]">
                {/* Next Chapter Preview */}
                {nextChapter && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-3 left-6 right-2 p-3 border border-border/50 rounded-lg bg-background/80 backdrop-blur-sm pointer-events-none"
                  >
                    <div className="flex items-center gap-4 ml-[29px]">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{nextChapter.name}</span>
                          <Badge variant="outline" className="text-[10px]">
                            À venir
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Prochain chapitre - {nextChapter.duration}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Current Chapter Card */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 p-3 border border-border/50 rounded-lg bg-background"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="flex flex-col justify-between h-[52px]">
                        <button
                          onClick={showPreviousChapter}
                          className={`p-1.5 rounded-md transition-colors hover:bg-muted ${
                            !previousChapter ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          disabled={!previousChapter}
                        >
                          <ChevronRight className="h-4 w-4 -rotate-90" />
                        </button>
                        <button
                          onClick={showNextChapter}
                          className={`p-1.5 rounded-md transition-colors hover:bg-muted ${
                            !nextChapter ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          disabled={!nextChapter}
                        >
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </button>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{currentChapter.name}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              currentChapter.status === 'completed'
                                ? 'border-primary text-primary'
                                : currentChapter.status === 'current'
                                  ? 'border-primary/50 text-primary/50'
                                  : ''
                            }`}
                          >
                            {currentChapter.status === 'completed'
                              ? 'Terminé'
                              : currentChapter.status === 'current'
                                ? 'En cours'
                                : 'À venir'}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {currentChapter.status === 'current' ? 'Chapitre actuel' : 'Chapitre'} -{' '}
                          {currentChapter.duration}
                        </span>
                      </div>
                    </div>

                    <motion.div
                      animate={{
                        opacity: currentChapter.status === 'current' ? 1 : 0.5,
                      }}
                      className="flex items-center"
                    >
                      <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                        <Link href="/course">
                          Continuer
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
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
