'use client'

import { Markdown } from '@/components/markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { addReportToUserSolution, addViews } from '@/core/challenges/users-solutions'
import { getUser } from '@/core/users'
import { UserSolution } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  MessageSquare,
  Pencil,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { isFailure } from '@/lib/result'
import { redirect } from 'next/navigation'
import { User } from '@/core/users/types'

type Props = {
  solution: UserSolution
  challengeSlug: string
}

function UserCard({ authorId, date }: { authorId: string; date: Date }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()

        if (isFailure(userData)) {
          return redirect('/auth/login')
        }

        setUser(userData.value)
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

function ReportDialog({ solutionId }: { solutionId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for the report')
      return
    }

    setIsSubmitting(true)
    try {
      const user = await getUser()
      if (!user) throw new Error('User not found')

      await addReportToUserSolution(solutionId, {
        userId: user.id,
        reason: reason.trim(),
        details: details.trim(),
        createdAt: new Date().toISOString(),
      })

      toast.success('Report submitted successfully')
      setIsOpen(false)
      setReason('')
      setDetails('')
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to submit report')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-muted-foreground gap-1.5"
        >
          <AlertTriangle className="h-4 w-4" />
          Report solution
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Solution</DialogTitle>
          <DialogDescription>
            Please provide details about why you are reporting this solution.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter the main reason for reporting..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide any additional context..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
        <ReportDialog solutionId={solution.id.toString()} />
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
