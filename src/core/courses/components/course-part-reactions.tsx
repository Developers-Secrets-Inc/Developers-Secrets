import { ReactionController } from '@/components/common/reactions/reaction-controller'

type ReactionStatus = 'liked' | 'disliked' | 'none'

interface CoursePartReactionsProps {
  partId: number
  userId: string | null
  initialUserReaction: ReactionStatus
}

export function CoursePartReactions({
  partId,
  userId,
  initialUserReaction,
}: CoursePartReactionsProps) {
  return (
    <ReactionController
      itemId={partId}
      itemType="coursePart"
      userId={userId}
      initialUserReaction={initialUserReaction}
    />
  )
}
