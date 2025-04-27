import { getUserPartReaction } from '@/core/courses/engagement/reactions'
import { ReactionController } from '@/components/common/reactions/reaction-controller'
import { getSessionUser } from '@/core/user'

type ReactionStatus = 'liked' | 'disliked' | 'none'

interface CoursePartReactionsProps {
  partId: number
}

export async function CoursePartReactions({ partId }: CoursePartReactionsProps) {
  const userId = await getSessionUser().then((user) => {
    if (user.success) {
      return user.value.id
    }
    return null
  })

  let initialUserReaction: ReactionStatus = 'none' // Default

  if (userId) {
    initialUserReaction = await getUserPartReaction(userId, partId)
  }

  return (
    <ReactionController
      itemId={partId}
      itemType="coursePart"
      userId={userId}
      initialUserReaction={initialUserReaction}
    />
  )
}
