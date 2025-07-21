'use client'

import { Markdown } from '@/components/markdown'
import { useUpdateDescriptionAdmin } from '@/core/challenges/hooks/use-update-description-admin'
import { string } from 'zod'

/**
 * ChallengeDescriptionContent component
 *
 * This component is responsible for rendering the description of a challenge
 * using Markdown formatting. It takes a single prop, `descriptionStatement`,
 * which is a string containing the challenge's description content.
 *
 */
export const ChallengeDescriptionContent = ({
  slug,
  initialDescription,
}: {
  slug: string
  initialDescription: string
}) => {
  const { description } = useUpdateDescriptionAdmin({ slug, initialDescription })

  return (
    <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
      {description}
    </Markdown>
  )
}


