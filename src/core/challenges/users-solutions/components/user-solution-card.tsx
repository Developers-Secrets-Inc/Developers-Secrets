import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Eye, MessageSquare, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { CommunitySolution, UserSolutionUser } from '../types'




const SolutionAuthorAvatar = ({ user }: { user: UserSolutionUser }) => {
  return (
    <Avatar className="h-6 w-6">
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}


const SolutionStatistics = ({ solution }: { solution: CommunitySolution }) => {
  return (
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
  )
}


export function CommunitySolutionCard({
  solution,
}: {
  solution: CommunitySolution
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SolutionAuthorAvatar user={solution.user} />
            <span className="font-medium">{solution.user.name}</span>
          </div>
        </div>

        <h4 className="font-medium mb-1">{solution.title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>

        <div className="flex items-center text-xs text-muted-foreground gap-3">
          <SolutionStatistics solution={solution} />
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
          asChild
        >
          <Link href={solution.url}>
            View Solution
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
