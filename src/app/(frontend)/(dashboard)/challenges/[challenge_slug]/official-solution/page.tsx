import { ChallengeHeader } from '../components/challenge-header'
import { CommentsSection } from '../components/comments-section'

export default async function OfficialSolutionPage({ params }: { params: Promise<{ challenge_slug: string }> }) {
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

  return (
    <div>
      <ChallengeHeader />
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
        <CommentsSection />
      </div>
    </div>
  )
}
