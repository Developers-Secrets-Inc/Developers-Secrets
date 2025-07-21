'use client'

// import React, { forwardRef, useRef } from 'react'

import { cn } from '@/lib/utils'
// import { AnimatedBeam } from '@/components/animated-beam'
import { User } from 'lucide-react'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { PostgreSqlLogoIcon } from '@/components/icons/postgresql-logo-icon'
import { FastApiLogoIcon } from '@/components/icons/fastapi-logo-icon'
import { DjangoLogoIcon } from '@/components/icons/django-logo-icon'
import { JsLogoIcon } from '@/components/icons/js-logo-icon'
import { TypescriptLogoIcon } from '@/components/icons/typescript-logo-icon'
import { ReactLogoIcon } from '@/components/icons/react-logo-icon'
import { NextjsLogoIcon } from '@/components/icons/nextjs-logo-icon'
import { GridPattern } from '@/components/grid-pattern'

export const WhatYouReallyWant = () => {
  // Refs for each node
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)
  const div8Ref = useRef<HTMLDivElement>(null)
  const div9Ref = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className="border-t border-border">
        <div className="w-full p-8 flex flex-col items-start gap-2">
          <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-2 inline-block">
            Learning Path Example
          </span>
          <h2 className="text-3xl font-bold md:text-4xl mt-1">A Fullstack Developer Journey</h2>
          <p className="mt-4 text-muted-foreground">
            Visualize your learning journey: from the basics to advanced frameworks, all paths lead
            to project mastery.
          </p>
        </div>
      </div>
      <section className="border-t border-border">
        <div
          className={cn(
            'relative flex w-full items-center justify-center overflow-hidden py-10',
            // className,
          )}
          ref={containerRef}
        >
          {/* Grid background pattern */}
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={'4 2'}
            className={cn('opacity-10')}
          />
          {/* Main diagram content */}
          <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
            <div className="flex flex-col justify-center">
              <Circle ref={div1Ref}>
                <Icons.user />
              </Circle>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <Circle ref={div2Ref}>
                <Icons.user />
              </Circle>
              <Circle ref={div3Ref}>
                <Icons.user />
              </Circle>
            </div>
            <div className="flex flex-col justify-center">
              <Circle ref={div4Ref}>
                <Icons.user />
              </Circle>
            </div>
            <div className="flex flex-col justify-center">
              <Circle ref={div5Ref}>
                <Icons.user />
              </Circle>
            </div>
          </div>

          <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div2Ref} />
          <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div3Ref} />
          <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
          <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div5Ref} />
        </div>
      </section>
    </>
  )
}

import React, { forwardRef, useRef } from 'react'

// import { cn } from "@/lib/utils";
import { AnimatedBeam } from '@/components/animated-beam'

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-10 flex size-12 items-center justify-center rounded-full border border-border bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

Circle.displayName = 'Circle'

const Icons = {
  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}
