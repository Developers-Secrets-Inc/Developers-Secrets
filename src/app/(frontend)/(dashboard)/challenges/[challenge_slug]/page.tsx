import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import {
  Eclipse,
  CheckCircle,
  FileText,
  Award,
  Users,
  ListChecks,
  MessageSquareText,
  Bot,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import Link from 'next/link'
import { ChallengesNavigationButtons } from './components/challenges-navigation-buttons'
import { CodeEditor } from '@/components/code-editor'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/markdown'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function Page({ params }: { params: Promise<{ challenge_slug: string }> }) {
  const { challenge_slug } = await params

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b py-3 px-4 bg-background">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Eclipse size={23} />
            </Link>
            <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
              <ChallengesNavigationButtons />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="h-9 px-3 py-1.5 text-sm"
              aria-label="Back to dashboard"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-full">
            <Tabs defaultValue="description" className="flex-1 flex flex-col min-h-0">
              <div className="border-b">
                <TabsList className="bg-background h-auto p-0 w-full justify-start rounded-none">
                  <TabsTrigger
                    value="description"
                    className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 flex-1"
                  >
                    <FileText className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="official-solution"
                    className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 flex-1"
                  >
                    <Award className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                    Official Solution
                  </TabsTrigger>
                  <TabsTrigger
                    value="solutions"
                    className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 flex-1"
                  >
                    <Users className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                    Solutions
                  </TabsTrigger>
                  <TabsTrigger
                    value="submissions"
                    className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 flex-1"
                  >
                    <ListChecks
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Submissions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="description"
                className="flex-1 overflow-y-auto scrollbar-hide mt-0 p-6 min-h-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Count Number of Maximum Bitwise-OR Subsets
                  </h2>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Attempted</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 rounded-sm"
                  >
                    Medium
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 rounded-sm"
                  >
                    +50 XP
                  </Badge>
                  <Badge variant="outline" className="rounded-sm">
                    Bit Manipulation
                  </Badge>
                  <Badge variant="outline" className="rounded-sm">
                    Dynamic Programming
                  </Badge>
                  <Badge variant="outline" className="rounded-sm">
                    Recursion
                  </Badge>
                </div>
                <Markdown>
                  {`

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
- 1 <= nums[i] <= 10^5`}
                </Markdown>
              </TabsContent>

              <TabsContent
                value="official-solution"
                className="flex-1 overflow-y-auto scrollbar-hide mt-0 p-6 min-h-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Count Number of Maximum Bitwise-OR Subsets
                  </h2>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Attempted</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 rounded-sm"
                  >
                    Medium
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 rounded-sm"
                  >
                    +50 XP
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Official Solution</h3>
                  <p className="text-muted-foreground">
                    The official solution uses dynamic programming to count subsets with maximum
                    bitwise OR.
                  </p>
                  <pre className="bg-muted p-4 rounded-md mt-4 overflow-x-auto">
                    <code>{`function countMaxOrSubsets(nums: number[]): number {
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
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent
                value="solutions"
                className="flex-1 overflow-y-auto scrollbar-hide mt-0 p-6 min-h-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Count Number of Maximum Bitwise-OR Subsets
                  </h2>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Attempted</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 rounded-sm"
                  >
                    Medium
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Community Solutions</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse solutions submitted by other users.
                  </p>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="https://github.com/user1.png" alt="User" />
                            <AvatarFallback>U1</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">user123</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          TypeScript
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Iterative approach using bit manipulation
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="https://github.com/user2.png" alt="User" />
                            <AvatarFallback>U2</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">coder456</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          JavaScript
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Optimized solution with memoization
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="submissions"
                className="flex-1 overflow-y-auto scrollbar-hide mt-0 p-6 min-h-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Count Number of Maximum Bitwise-OR Subsets
                  </h2>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Attempted</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 rounded-sm"
                  >
                    Medium
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Submissions</h3>
                  <div className="space-y-3">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Submission #1</span>
                        <Badge
                          variant="outline"
                          className="bg-red-500/10 text-red-500 border-red-500/20 rounded-sm"
                        >
                          Failed
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted on May 15, 2023 - 14:32
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Submission #2</span>
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-sm"
                        >
                          Partial
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted on May 15, 2023 - 15:47
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-green-500 flex items-center gap-1.5"
                    >
                      <ThumbsUp size={16} />
                      <span className="text-sm">Like</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-red-500 flex items-center gap-1.5"
                    >
                      <ThumbsDown size={16} />
                      <span className="text-sm">Dislike</span>
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">Rate this challenge</div>
                </div>
              </div>
              <Button variant="outline" className="w-full flex items-center gap-2 h-10">
                <Bot size={18} />
                <span>Ask AI Assistant</span>
                <MessageSquareText className="ml-auto" size={16} />
              </Button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <CodeEditor initialCode={''} language={''} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
