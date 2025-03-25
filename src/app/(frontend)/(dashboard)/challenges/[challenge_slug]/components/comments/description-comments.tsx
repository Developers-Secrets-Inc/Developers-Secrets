import { Challenge } from '@/payload-types'
import { CommentsSection } from '@/core/comments/components/comments-section'
import {
  getChallengeDescriptionComments,
  createDescriptionComment,
} from '@/core/challenges/comments'

export const DescriptionComments = async ({ challenge }: { challenge: Challenge }) => {
  return (
    <CommentsSection
      comments={await getChallengeDescriptionComments(challenge.id)}
      onCreateComment={createDescriptionComment}
      challengeId={challenge.id}
    />
  )
}
