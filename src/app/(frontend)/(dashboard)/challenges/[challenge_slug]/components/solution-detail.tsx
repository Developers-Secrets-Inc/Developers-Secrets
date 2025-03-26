'use client'

// import { useState, memo, useCallback } from 'react'
// import { Button } from '@/components/ui/button'
// import { ArrowLeft, Copy, CheckCheck, ThumbsUp, ThumbsDown, Eye, MessageSquare } from 'lucide-react'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Badge } from '@/components/ui/badge'
// import { formatDistanceToNow } from 'date-fns'
// import { Separator } from '@/components/ui/separator'
// import { CommentsSection } from './comments-section'
// import Link from 'next/link'
// import dynamic from 'next/dynamic'

// Type de solution à afficher
export type SolutionDetailProps = {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  title: string
  description: string
  language: string
  upvotes: number
  downvotes: number
  views: number
  comments: number
  date: Date
  code: string
}

type Props = {
  solution: SolutionDetailProps
  challengeSlug: string
}

// Chargement dynamique de la section des commentaires pour accélérer le chargement initial


export function SolutionDetail({ solution, challengeSlug }: Props) {
  // const [copied, setCopied] = useState(false)

  // const handleCopyCode = useCallback(() => {
  //   navigator.clipboard.writeText(solution.code)
  //   setCopied(true)
  //   setTimeout(() => setCopied(false), 2000)
  // }, [solution.code])

  return (
    <div className="space-y-4 -mt-6">
      {/* <div className="flex items-center justify-between py-2 border-b -mx-6 px-6">
        <Button variant="ghost" size="sm" className="gap-1.5" asChild>
          <Link href={`/challenges/${challengeSlug}/solutions`} prefetch={true}>
            <ArrowLeft className="h-4 w-4" />
            Back to solutions
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-muted-foreground"
        >
          Report solution
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">{solution.title}</h2>
        <UserCard user={solution.user} date={solution.date} />
        <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>
      </div>

      <StatisticsGrid solution={solution} />

      <Separator />

      <div>
        <div className="relative bg-muted p-4 rounded-md min-h-[200px] overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="bg-muted">
              {solution.language}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={handleCopyCode}
            >
              {copied ? (
                <>
                  <CheckCheck className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <pre className="text-sm font-mono">{solution.code}</pre>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <DynamicCommentsSection />
      </div> */}
    </div>
  )
}
