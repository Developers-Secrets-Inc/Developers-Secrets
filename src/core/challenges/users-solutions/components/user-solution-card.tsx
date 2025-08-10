import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User } from '@/core/users/types'
import { UserSolution } from '@/payload-types'
import { ExternalLink, Eye, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'



const SolutionAuthorAvatar = ({ user }: { user: User }) => {
  return (
    <Avatar className="h-6 w-6">
      <AvatarImage src={user.informations.avatar} alt={user.informations.name} />
      <AvatarFallback>{user.informations.initials}</AvatarFallback>
    </Avatar>
  )
}


const SolutionStatistics = ({ solution }: { solution: UserSolution }) => {

  const upvotes = solution.votes?.filter((vote) => vote.status === 'upvote').length || 0
  const downvotes = solution.votes?.filter((vote) => vote.status === 'downvote').length || 0

  return (
    <div className="flex items-center text-xs text-muted-foreground gap-3">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>{downvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{solution.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{solution.comments?.length || 0} comments</span>
      </div>
    </div>
  )
}


export const CommunitySolutionCard = ({
  solution,
  user,
  url,
}: {
  solution: UserSolution
  user: User
  url: string
}) => {

  /*  

  const user: User = getUserById(solution.authorId).onError(() => {
    return null
  })

  */

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SolutionAuthorAvatar user={user} />
            <span className="font-medium">{user.informations.name}</span>
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
          {new Date(solution.createdAt).toLocaleDateString('en-US', {
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
          <Link href={url}>
            View Solution
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
