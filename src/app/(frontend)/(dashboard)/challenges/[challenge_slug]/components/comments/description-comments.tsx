import { createDescriptionComment, getChallengeDescriptionComments } from '@/core/comments'
import { Challenge } from '@/payload-types'
import { CommentsSection } from './comments-section'




export const DescriptionComments = async ({ challenge }: { challenge: Challenge }) => {
  return (
    <CommentsSection
      comments={await getChallengeDescriptionComments(challenge.id)}
      onCreateComment={createDescriptionComment}
      challengeId={challenge.id}
    />
  )
}
