import { getUserPartReaction } from '../engagement/reactions'
import { Skeleton } from '@/components/ui/skeleton'
import { CoursePartReactionsClient } from './course-part-reactions.client'

export const PartReactions = async ({
  partId,
  userId,
}: {
  partId: number
  userId: string
}) => {
  const initialUserReaction = await getUserPartReaction(userId, partId)

  return (
    <CoursePartReactionsClient
      partId={partId}
      userId={userId}
      initialUserReaction={initialUserReaction}
    />
  )
}


export const PartReactionsSkeleton = () => {
  return (
    <div className="flex items-center gap-2 h-9">
      <Skeleton className="h-full w-16" />
      <Skeleton className="h-full w-16" />
    </div>
  )
}
