'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export type DialogPage = {
  title: string
  cta: string | React.ReactNode
  content: React.ReactNode
}

export const MultiPageDialog = ({
  pages,
  ...props
}: React.ComponentProps<typeof Dialog> & { pages: DialogPage[] }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const TOTAL_PAGES = pages.length

  const handleNext = () => {
    if (currentPageIndex < TOTAL_PAGES - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const page = pages[currentPageIndex]

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md">
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-3.5 right-14 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentPageIndex === 0}
              className="h-6 w-6"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentPageIndex === TOTAL_PAGES - 1}
              className="h-6 w-6"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="space-y-6">
          <DialogHeader>
            <DialogTitle>{page.title}</DialogTitle>
          </DialogHeader>
          {page.content}
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            {typeof page.cta === 'string' ? <Button className="w-full" type="button" onClick={handleNext}>
              {page.cta}
            </Button> : page.cta}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
