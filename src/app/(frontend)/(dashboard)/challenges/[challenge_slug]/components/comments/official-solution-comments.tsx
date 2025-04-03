import { Challenge } from '@/payload-types'
import { CommentsSection } from '@/core/comments/components/comments-section'
import { commentContexts } from '@/core/comments/types'

export const OfficialSolutionComments = ({ challenge }: { challenge: Challenge }) => {
  return <CommentsSection context={commentContexts.challengeSolution(challenge.id)} />
}
