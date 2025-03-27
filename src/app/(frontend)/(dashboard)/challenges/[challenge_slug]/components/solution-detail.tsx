'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Copy,
  CheckCheck,
  ThumbsUp,
  ThumbsDown,
  Eye,
  MessageSquare,
  Pencil,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { UserSolution } from '@/payload-types'
import { getUser } from '@/core/user'
import { addViews } from '@/core/challenges/users-solutions'
import { Markdown } from '@/components/markdown'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  solution: UserSolution
  challengeSlug: string
}

function UserCard({ authorId, date }: { authorId: string; date: Date }) {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getUser>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
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

function SolutionStats({ solution }: { solution: UserSolution }) {
  const upvotes = solution.votes?.filter((vote) => vote.status === 'upvote').length || 0
  const downvotes = solution.votes?.filter((vote) => vote.status === 'downvote').length || 0

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <ThumbsUp className="h-4 w-4" />
        <span>{upvotes}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ThumbsDown className="h-4 w-4" />
        <span>{downvotes}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Eye className="h-4 w-4" />
        <span>{solution.views || 0}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4" />
        <span>{solution.comments?.length || 0}</span>
      </div>
    </div>
  )
}

export function SolutionDetail({ solution, challengeSlug }: Props) {
  const [currentUser, setCurrentUser] = useState<Awaited<ReturnType<typeof getUser>> | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()
        setCurrentUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const incrementViews = async () => {
      await addViews(solution.id.toString())
    }
    incrementViews()
  }, [solution.id])

  const isCreator = currentUser?.id === solution.authorId

  return (
    <div className="space-y-6 -mt-6">
      <div className="flex items-center justify-between py-2 border-b -mx-6 px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5" asChild>
            <Link href={`/challenges/${challengeSlug}/solutions`} prefetch={true}>
              <ArrowLeft className="h-4 w-4" />
              Back to solutions
            </Link>
          </Button>
          {isCreator && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary hover:text-primary"
              asChild
            >
              <Link
                href={`/challenges/create-solution?challenge_id=${
                  typeof solution.challenge === 'number'
                    ? solution.challenge
                    : solution.challenge.id
                }`}
                prefetch={true}
              >
                <Pencil className="h-4 w-4" />
                Edit solution
              </Link>
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-muted-foreground"
        >
          Report solution
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{solution.title}</h2>
          <UserCard authorId={solution.authorId} date={new Date(solution.createdAt)} />
        </div>

        <div className="space-y-2">
          <SolutionStats solution={solution} />
          <Markdown className="text-sm text-muted-foreground prose-sm prose-slate max-w-none">
            {solution.description}
          </Markdown>
        </div>

        <Separator className="my-6" />

        <Markdown className="p-4">{solution.content}</Markdown>
      </div>
    </div>
  )
}
