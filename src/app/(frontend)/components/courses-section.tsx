'use client'

import React, { useState } from 'react'
import { Code } from 'lucide-react'
import { ReactLogoIcon } from '@/components/icons/react-logo-icon'
import { DjangoLogoIcon } from '@/components/icons/django-logo-icon'
import { GraphQLLogoIcon } from '@/components/icons/graphql-logo-icon'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { COURSES, TABS, Course, TabKey } from './courses'
import { JsLogoIcon } from '@/components/icons/js-logo-icon'
import { TypescriptLogoIcon } from '@/components/icons/typescript-logo-icon'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { GoLogoIcon } from '@/components/icons/go-logo-icon'
import { NextjsLogoIcon } from '@/components/icons/nextjs-logo-icon'
import { FastApiLogoIcon } from '@/components/icons/fastapi-logo-icon'
import Link from 'next/link'

const TAB_ICONS: Record<TabKey, React.ReactNode> = {
  python: <PythonLogoIcon width={26} height={26} />,
  frontend: <ReactLogoIcon size={26} />,
  backend: <DjangoLogoIcon width={26} height={26} />,
  javascript: <JsLogoIcon width={26} height={26} />,
  typescript: <TypescriptLogoIcon width={26} height={26} />,
  go: <GoLogoIcon width={26} height={26} />,
  nextjs: <NextjsLogoIcon width={26} height={26} />,
  fastapi: <FastApiLogoIcon width={26} height={26} />,
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 border',
  intermediate: 'bg-amber-500/10 text-amber-500 border-amber-500/20 border',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/20 border',
  horrible: 'bg-purple-500/10 text-purple-500 border-purple-500/20 border',
}

function DifficultyBadge({ level }: { level: string }) {
  const color =
    DIFFICULTY_COLORS[level.toLowerCase()] ?? 'bg-muted text-muted-foreground border border-border'
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{level}</span>
}

export const CoursesSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('python')
  const courses = COURSES[activeTab]
  const useCarousel = courses.length > 3

  return (
    <>
      <div
        className="w-full h-4 border-t border-border"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cg stroke-width='3.5' stroke='hsla(0, 0%25, 100%25, 1.00)' fill='none'%3E%3Cline x1='0' y1='0' x2='400' y2='400'%3E%3C/line%3E%3Cline x1='400' y1='0' x2='800' y2='400'%3E%3C/line%3E%3Cline x1='800' y1='0' x2='1200' y2='400'%3E%3C/line%3E%3Cline x1='0' y1='400' x2='400' y2='800'%3E%3C/line%3E%3Cline x1='400' y1='400' x2='800' y2='800'%3E%3C/line%3E%3Cline x1='800' y1='400' x2='1200' y2='800'%3E%3C/line%3E%3Cline x1='0' y1='800' x2='400' y2='1200'%3E%3C/line%3E%3Cline x1='400' y1='800' x2='800' y2='1200'%3E%3C/line%3E%3Cline x1='800' y1='800' x2='1200' y2='1200'%3E%3C/line%3E%3C/g%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />
      <section className="border-t border-border">
        {/* Mini section décorative avec le pattern de lignes */}

        <div className="flex justify-center gap-2 px-4 pt-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={
                `rounded-md font-medium transition-colors border flex items-center justify-center min-w-[56px] min-h-[56px] w-14 h-14 aspect-square text-[1.4rem] shadow-sm ` +
                (activeTab === tab.key
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-background border-border text-foreground hover:bg-muted')
              }
              onClick={() => setActiveTab(tab.key as TabKey)}
              type="button"
              aria-label={tab.aria}
            >
              {TAB_ICONS[tab.key as TabKey]}
            </button>
          ))}
        </div>
        <div className="px-4 py-8">
          {useCarousel ? (
            <div className="relative max-w-6xl mx-auto">
              <Carousel>
                <CarouselContent>
                  {courses.map((course: Course) => (
                    <CarouselItem
                      key={course.title}
                      className="basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="bg-card border rounded-lg p-6 flex flex-col gap-3 shadow-sm h-full">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold">{course.title}</h4>
                          <DifficultyBadge level={course.difficulty} />
                        </div>
                        <p className="text-muted-foreground text-sm flex-1">{course.description}</p>
                        <Button asChild className="mt-2 w-full" disabled={course.isLocked}>
                          {course.isLocked ? (
                            <span>Coming Soon</span>
                          ) : (
                            <Link href={course.link}>See More</Link>
                          )}
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: Course) => (
                <div
                  key={course.title}
                  className="bg-card border rounded-lg p-6 flex flex-col gap-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{course.title}</h4>
                    <DifficultyBadge level={course.difficulty} />
                  </div>
                  <p className="text-muted-foreground text-sm flex-1">{course.description}</p>
                  <Button asChild className="mt-2 w-full" disabled={course.isLocked}>
                    {course.isLocked ? (
                      <span>Coming Soon</span>
                    ) : (
                      <Link href={course.link}>See More</Link>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
