import { ChallengeHeader } from '../components/challenge-header'
import { Markdown } from '@/components/markdown'
import { CommentsSection } from '../components/comments-section'
import { getChallengeBySlug } from '@/core/challenges'
// This function enables ISR with a 10-minute revalidation period
export const revalidate = 600 // 10 minutes in seconds

export default async function DescriptionPage({ params }: { params: Promise<{ challenge_slug: string }> }) {
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug } = await params

  // Dans une application réelle, on récupérerait les données depuis une API
  // en utilisant le challenge_slug
  const challenge = await getChallengeBySlug(challenge_slug)

  return (
    <div>
      <ChallengeHeader />
      <Markdown>{challenge.statement}</Markdown>
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <CommentsSection />
      </div>
    </div>
  )
}
