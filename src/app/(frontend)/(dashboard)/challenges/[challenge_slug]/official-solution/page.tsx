import { getChallengeBySlug } from '@/core/challenges'
import { ChallengeHeader } from '../components/challenge-header'
import { OfficialSolutionComments } from '../components/comments/official-solution-comments'

export default async function OfficialSolutionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug } = await params

  // Dans une application réelle, on récupérerait les données depuis une API
  // en utilisant le challenge_slug
  const code = `function countMaxOrSubsets(nums: number[]): number {
  // Find the maximum OR value possible
  let maxOr = 0;
  for (const num of nums) {
    maxOr |= num;
  }
  
  // Count subsets with this max OR value
  return countSubsets(nums, 0, 0, maxOr);
}

function countSubsets(nums: number[], index: number, currentOr: number, maxOr: number): number {
  // Base case: reached the end of array
  if (index === nums.length) {
    return currentOr === maxOr ? 1 : 0;
  }
  
  // Include current element
  const include = countSubsets(nums, index + 1, currentOr | nums[index], maxOr);
  
  // Exclude current element
  const exclude = countSubsets(nums, index + 1, currentOr, maxOr);
  
  return include + exclude;
}`

  const challenge = await getChallengeBySlug(challenge_slug)

  const conceptsList =
    challenge.concepts
      ?.map((concept: any) => (typeof concept === 'object' ? concept.concept : concept))
      .filter(Boolean) || []

  return (
    <div className="p-6">
      <ChallengeHeader
        title={challenge.title}
        difficulty={challenge.difficulty as 'easy' | 'medium' | 'hard' | 'horrible'}
        concepts={conceptsList}
        baseExperience={challenge.baseExperience || 0}
        status="Not Attempted" // This could be dynamic based on user progress
      />
      <div>
        <h3 className="text-lg font-semibold mb-3">Official Solution</h3>
        <p className="text-muted-foreground mb-4">
          The official solution uses dynamic programming to count subsets with maximum bitwise OR.
        </p>
        <pre className="bg-muted p-4 rounded-md mt-4 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <OfficialSolutionComments challenge={challenge} />
      </div>
    </div>
  )
}
