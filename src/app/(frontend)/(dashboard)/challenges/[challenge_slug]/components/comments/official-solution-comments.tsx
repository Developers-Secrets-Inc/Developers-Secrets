import { Challenge } from '@/payload-types'
import { CommentsSection } from '@/core/comments/components/comments-section'
import { commentContexts } from '@/core/comments/types'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result'
import { redirect } from 'next/navigation'

export const OfficialSolutionComments = async ({ challenge }: { challenge: Challenge }) => {
  let userId = ''

  try {
    const user = await getUser()
    if (isFailure(user)) {
      return redirect('/auth/login')
    }
    userId = user.value.id
  } catch (error) {
    console.error('Error fetching user for comments:', error)
  }

  return (
    <CommentsSection context={commentContexts.challengeSolution(challenge.id)} userId={userId} />
  )
}
