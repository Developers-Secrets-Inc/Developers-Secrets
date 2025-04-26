'use client' // Assuming client-side interaction might be needed later

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PartFooterProps {
  prevPartUrl: string | null
  nextPartUrl: string | null
}

export const PartFooter = ({ prevPartUrl, nextPartUrl }: PartFooterProps) => {
  return (
    <footer className="flex-none flex items-center justify-between p-3 border-t bg-background shadow-[0_-1px_2px_rgba(0,0,0,0.05)] z-10">
      <div>
        {prevPartUrl ? (
          <Button variant="outline" asChild>
            <Link href={prevPartUrl}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
      </div>
      <div>
        {nextPartUrl ? (
          <Button variant="outline" asChild>
            <Link href={nextPartUrl}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </footer>
  )
}
