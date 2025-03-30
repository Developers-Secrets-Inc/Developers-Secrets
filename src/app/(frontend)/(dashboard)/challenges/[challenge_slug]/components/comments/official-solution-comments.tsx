import { Challenge } from '@/payload-types'
import { CommentsSection } from '@/core/comments/components/comments-section'
import {
  getChallengeOfficialSolutionComments,
  createOfficialSolutionComment,
} from '@/core/challenges/comments'

export const OfficialSolutionComments = async ({ challenge }: { challenge: Challenge }) => {
  return (
    <CommentsSection
      comments={await getChallengeOfficialSolutionComments(challenge.id)}
      onCreateComment={createOfficialSolutionComment}
      parentId={challenge.id}
    />
  )
}
