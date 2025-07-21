import React from 'react'

interface TutorialContentProps {
  children: React.ReactNode
}

/**
 * Container component for tutorial content
 * Provides layout structure for the main content area
 */
export function TutorialContent({ children }: TutorialContentProps) {
  return (
    <div className="flex w-full flex-1">
      <main className="flex w-full min-w-0 flex-col">
        <div className="flex w-full flex-1 flex-col gap-6 px-4 pt-8 md:px-6 md:pt-12 xl:px-12 xl:mx-auto max-w-[860px] max-sm:pb-16">
          {children}
        </div>
      </main>
    </div>
  )
}
