import { ChallengeHeader } from '../components/challenge-header'
import { Markdown } from '@/components/markdown'
import { CommentsSection } from '../components/comments-section'

export default function DescriptionPage({ params }: { params: { challenge_slug: string } }) {
  // Dans une application réelle, on récupérerait les données depuis une API
  // en utilisant le challenge_slug
  const markdownContent = `
Given an integer array nums, find the number of subsets whose bitwise OR equals the maximum possible bitwise OR of any subset.

### Examples

#### Example 1:

**Input:** nums = [3,1,2,5]
**Output:** 6
**Explanation:** 
The maximum possible bitwise OR of any subset is 7. The subsets with a bitwise OR of 7 are:
- [3,5]
- [3,1,5]
- [3,2,5]
- [3,1,2,5]
- [1,2,5]
- [1,2,3,5]

#### Example 2:

**Input:** nums = [2,2,2]
**Output:** 7
**Explanation:** 
All non-empty subsets of [2,2,2] have a bitwise OR of 2. There are 7 subsets.

### Example 3:

**Input:** nums = [3,2,1,5]
**Output:** 6
**Explanation:** 
The maximum possible bitwise OR of any subset is 7. The subsets with a bitwise OR of 7 are:
- [3,5]
- [3,1,5]
- [3,2,5]
- [3,1,2,5]
- [1,2,5]
- [2,1,5]

## Constraints:

- 1 <= nums.length <= 16
- 1 <= nums[i] <= 10^5
`

  return (
    <div>
      <ChallengeHeader />
      <Markdown>{markdownContent}</Markdown>
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <CommentsSection />
      </div>
    </div>
  )
}
