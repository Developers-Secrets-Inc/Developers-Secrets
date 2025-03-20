import { getChallengeBySlug } from '@/core/challenges'
import { getPayloadChallenge } from '@/core/challenges'
import { ChallengeHeader } from '../components/challenge-header'
import { getUser } from '@/core/user'
import { CommentsSection } from '../components/comments-section'
import { Markdown } from '@/components/markdown'
// This function enables ISR with a 10-minute revalidation period
export const revalidate = 600 // 10 minutes in seconds

export default async function ChallengeDescriptionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params
  const challenge = await getPayloadChallenge(challenge_slug)

  // Extract concepts from challenge data
  const conceptsList =
    challenge.concepts
      ?.map((concept: any) => (typeof concept === 'object' ? concept.concept : concept))
      .filter(Boolean) || []

  const user = await getUser()

  console.log(challenge)

  return (
    <div>
      <ChallengeHeader
        title={challenge.title}
        difficulty={challenge.difficulty as 'easy' | 'medium' | 'hard' | 'horrible'}
        concepts={conceptsList}
        baseExperience={challenge.baseExperience || 0}
        status="Not Attempted" // This could be dynamic based on user progress
      />
      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {challenge.description?.statement || 'No description available.'}
      </Markdown>
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <CommentsSection challengeId={challenge.id} />
      </div>
    </div>
  )
}
