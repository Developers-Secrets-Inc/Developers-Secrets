import { Markdown } from '@/components/markdown'
import { getAllChallengesSlugs, getChallengeBySlug } from '@/core/challenges'
import { ChallengeHeader } from '../components/challenge-header'
import { DescriptionComments } from '../components/comments/description-comments'

export const revalidate = 600 // 10 minutes in seconds

export async function generateStaticParams() {
  const slugs = await getAllChallengesSlugs()
  return slugs.map((slug: string) => ({
    challenge_slug: slug,
  }))
}

export default async function ChallengeDescriptionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params
  const challenge = await getChallengeBySlug(challenge_slug)

  console.log(challenge.codeVersions?.[0]?.initialCode)

  // Extract concepts from challenge data
  const conceptsList =
    challenge.concepts
      ?.map((concept: any) => (typeof concept === 'object' ? concept.concept : concept))
      .filter(Boolean) || []

  return (
    <div className="p-6">
      <ChallengeHeader
        challenge={challenge}
        concepts={conceptsList}
        status="Not Attempted" // This could be dynamic based on user progress
      />
      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {challenge.description?.statement || 'No description available.'}
      </Markdown>
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <DescriptionComments challenge={challenge} />
      </div>
    </div>
  )
}
