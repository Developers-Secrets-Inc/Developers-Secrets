'use client'

import { Markdown } from '@/components/markdown'
import { useUpdateSolutionAdmin } from '@/core/challenges/hooks/use-update-solution-admin'

/**
 * SolutionContent component
 * Displays the official solution for a challenge.
 * It fetches the solution using React Query to ensure it's always up-to-date.
 */
export const SolutionContent = ({
  slug,
  initialSolution,
}: {
  slug: string
  initialSolution: string
}) => {
  const { solution } = useUpdateSolutionAdmin({ slug, initialSolution })

  return (
    <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
      {solution}
    </Markdown>
  )
}