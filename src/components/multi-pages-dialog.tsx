'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

export type DialogPage = {
  title: string
  cta: string
  content: React.ReactNode
}

export const MultiPageDialog = ({
  pages,
  ...props
}: React.ComponentProps<typeof Dialog> & { pages: DialogPage[] }) => {
  const [page, setPage] = useState(1)
  const TOTAL_PAGES = pages.length

  const handleNext = () => {
    if (page < TOTAL_PAGES) setPage(page + 1)
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <DialogHeader>
            <DialogTitle>{pages[page - 1].title}</DialogTitle>
          </DialogHeader>
          {pages[page - 1].content}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Button className="w-full" type="button" onClick={handleNext}>
              {pages[page - 1].cta}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
