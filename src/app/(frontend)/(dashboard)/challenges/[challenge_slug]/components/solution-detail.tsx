'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, CheckCheck, ThumbsUp, ThumbsDown, Eye, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { UserSolution } from '@/payload-types'
import { getUser } from '@/core/user'
import {
  addViews,
  addUpvote,
  addDownvote,
  removeUpvote,
  removeDownvote,
} from '@/core/challenges/users-solutions'

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
  solution: UserSolution
  challengeSlug: string
}

function UserCard({ authorId, date }: { authorId: string; date: Date }) {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getUser>> | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      setUser(userData)
    }
    fetchUser()
  }, [])

  return (
    <div className="flex items-center gap-2 mb-3">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user?.informations.avatar} />
        <AvatarFallback>
          {user?.informations.initials || authorId.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{user?.informations.name || authorId}</span>
        <span>•</span>
        <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
      </div>
    </div>
  )
}

function StatisticsGrid({
  solution,
  onVoteChange,
}: {
  solution: UserSolution
  onVoteChange: () => void
}) {
  const [currentUser, setCurrentUser] = useState<Awaited<ReturnType<typeof getUser>> | null>(null)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      setCurrentUser(userData)

      if (userData) {
        const userVote = solution.votes?.find((vote) => vote.authorId === userData.id)
        setIsUpvoted(userVote?.status === 'upvote')
        setIsDownvoted(userVote?.status === 'downvote')
      }
    }
    fetchUser()
  }, [solution.votes])

  const handleUpvote = async () => {
    if (!currentUser) return

    if (isUpvoted) {
      await removeUpvote(solution.id.toString(), currentUser.id)
    } else {
      await addUpvote(solution.id.toString(), currentUser.id)
    }
    onVoteChange()
  }

  const handleDownvote = async () => {
    if (!currentUser) return

    if (isDownvoted) {
      await removeDownvote(solution.id.toString(), currentUser.id)
    } else {
      await addDownvote(solution.id.toString(), currentUser.id)
    }
    onVoteChange()
  }

  const upvotes = solution.votes?.filter((vote) => vote.status === 'upvote').length || 0
  const downvotes = solution.votes?.filter((vote) => vote.status === 'downvote').length || 0

  return (
    <div className="grid grid-cols-4 gap-4 py-4">
      <button
        onClick={handleUpvote}
        className={`flex flex-col items-center p-3 rounded-lg border ${
          isUpvoted ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
        }`}
      >
        <ThumbsUp className={`h-5 w-5 mb-1 ${isUpvoted ? 'text-primary' : ''}`} />
        <span className="text-sm font-medium">{upvotes}</span>
        <span className="text-xs text-muted-foreground">Upvotes</span>
      </button>

      <button
        onClick={handleDownvote}
        className={`flex flex-col items-center p-3 rounded-lg border ${
          isDownvoted ? 'bg-destructive/10 border-destructive' : 'hover:bg-muted'
        }`}
      >
        <ThumbsDown className={`h-5 w-5 mb-1 ${isDownvoted ? 'text-destructive' : ''}`} />
        <span className="text-sm font-medium">{downvotes}</span>
        <span className="text-xs text-muted-foreground">Downvotes</span>
      </button>

      <div className="flex flex-col items-center p-3 rounded-lg border hover:bg-muted">
        <Eye className="h-5 w-5 mb-1" />
        <span className="text-sm font-medium">{solution.views || 0}</span>
        <span className="text-xs text-muted-foreground">Views</span>
      </div>

      <div className="flex flex-col items-center p-3 rounded-lg border hover:bg-muted">
        <MessageSquare className="h-5 w-5 mb-1" />
        <span className="text-sm font-medium">{solution.comments?.length || 0}</span>
        <span className="text-xs text-muted-foreground">Comments</span>
      </div>
    </div>
  )
}

export function SolutionDetail({ solution, challengeSlug }: Props) {
  const [copied, setCopied] = useState(false)
  const [currentSolution, setCurrentSolution] = useState(solution)

  useEffect(() => {
    const incrementViews = async () => {
      await addViews(solution.id.toString())
    }
    incrementViews()
  }, [solution.id])

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(currentSolution.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [currentSolution.content])

  const handleVoteChange = useCallback(async () => {
    const updatedSolution = await getUserSolutionById(solution.id.toString())
    if (updatedSolution) {
      setCurrentSolution(updatedSolution)
    }
  }, [solution.id])

  const firstTag = currentSolution.tags?.[0]
  const language = typeof firstTag === 'number' ? 'Unknown' : firstTag?.name || 'Unknown'

  return (
    <div className="space-y-4 -mt-6">
      <div className="flex items-center justify-between py-2 border-b -mx-6 px-6">
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
        <h2 className="text-xl font-semibold mb-2">{currentSolution.title}</h2>
        <UserCard authorId={currentSolution.authorId} date={new Date(currentSolution.createdAt)} />
        <p className="text-sm text-muted-foreground mb-4">{currentSolution.description}</p>
      </div>

      <StatisticsGrid solution={currentSolution} onVoteChange={handleVoteChange} />

      <Separator />

      <div>
        <div className="relative bg-muted p-4 rounded-md min-h-[200px] overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="bg-muted">
              {language}
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
          <pre className="text-sm font-mono">{currentSolution.content}</pre>
        </div>
      </div>

      <Separator />
    </div>
  )
}
