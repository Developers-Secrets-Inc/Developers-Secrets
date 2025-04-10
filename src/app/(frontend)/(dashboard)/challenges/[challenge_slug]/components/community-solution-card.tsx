import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Eye, MessageSquare, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export interface CommunitySolutionProps {
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
}

export function CommunitySolutionCard({
  solution,
  onViewSolution,
}: {
  solution: CommunitySolutionProps
  onViewSolution?: (id: string) => void
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={solution.user.avatar} alt={solution.user.name} />
              <AvatarFallback>{solution.user.initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{solution.user.name}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {solution.language}
          </Badge>
        </div>

        <h4 className="font-medium mb-1">{solution.title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>

        <div className="flex items-center text-xs text-muted-foreground gap-3">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{solution.upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>{solution.downvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{solution.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{solution.comments} comments</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 px-4 py-2 flex justify-between items-center border-t">
        <span className="text-xs text-muted-foreground">
          {solution.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => onViewSolution && onViewSolution(solution.id)}
        >
          View Solution
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
