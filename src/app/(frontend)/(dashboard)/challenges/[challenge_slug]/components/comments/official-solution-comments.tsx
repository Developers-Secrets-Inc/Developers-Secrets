import { Challenge } from '@/payload-types'
import { CommentsSection } from '@/core/comments/components/comments-section'
import { commentContexts } from '@/core/comments/types'
import { getUser } from '@/core/user'

export const OfficialSolutionComments = async ({ challenge }: { challenge: Challenge }) => {
  let userId = ''

  try {
    const user = await getUser()
    userId = user.id
  } catch (error) {
    console.error('Error fetching user for comments:', error)
  }

  return (
    <CommentsSection context={commentContexts.challengeSolution(challenge.id)} userId={userId} />
  )
}
