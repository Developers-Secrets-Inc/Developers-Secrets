'use client'

import { CommentsSection } from '@/core/comments/components/comments-section'
import { commentContexts } from '@/core/comments/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card' // Import Card components for placeholder

// Updated props to accept solutionId (number or null) and userId
interface SolutionCommentsProps {
  solutionId: number | null // Allow null for new solutions
  userId: string | null
}

export default function SolutionComments({ solutionId, userId }: SolutionCommentsProps) {
  // Display placeholder if no solutionId (new solution) or no userId
  if (solutionId === null || !userId) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-base font-medium text-foreground">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Comments will be available here once the solution is created.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Render the actual comment section using the context for user solutions
  return (
    <div className="space-y-4">
      {/* Pass numeric solutionId to context */}
      <CommentsSection context={commentContexts.userSolution(solutionId)} userId={userId} />
    </div>
  )
}
