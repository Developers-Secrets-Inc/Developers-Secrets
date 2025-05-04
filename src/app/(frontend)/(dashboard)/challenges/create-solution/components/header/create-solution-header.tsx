'use client'

import { Challenge } from '@/payload-types'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { CreateSolutionButton } from './create-solution-button'
import { SolutionDraftStatus } from './solution-draft-status'
import { useSolutionFormStore } from '../../store/solution-form-store'

export const SolutionFormHeader = () => {
  const challengeSlug = useSolutionFormStore((state) => state.challengeSlug)
  const challengeTitle = useSolutionFormStore((state) => state.challengeTitle)

  if (!challengeSlug || !challengeTitle) {
    return (
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14  items-center justify-between mx-auto px-4 sm:px-6 lg:px-12">
          <div className="h-6 w-32 bg-muted rounded"></div>
          <div className="h-8 w-40 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14  items-center justify-between mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center space-x-4">
          <Link
            href={`/challenges/${challengeSlug}`}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Challenge
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate">{challengeTitle}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CreateSolutionButton />
          <SolutionDraftStatus />
        </div>
      </div>
    </div>
  )
}
