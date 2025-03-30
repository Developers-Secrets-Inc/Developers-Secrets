'use client'

import { submitUserSolution } from '@/core/challenges/users-solutions/actions'
import { Challenge, Tag as PayloadTag, UserSolution } from '@/payload-types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useRef } from 'react'
import SolutionEditor from '.'
import { useUserSolution } from '../hooks/use-user-solution'
import SolutionMetadata from './SolutionMetadata'

interface CreateSolutionFormProps {
  challenge: Challenge
  userId: string
  existingSolution: (Omit<UserSolution, 'tags'> & { tags: PayloadTag[] }) | null
}



const SubmitButton = ({
  isLoading,
  hasSolution,
  onClick,
}: {
  isLoading: boolean
  hasSolution: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ${
      isLoading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {isLoading ? (hasSolution ? 'Updating...' : 'Creating...') : hasSolution ? 'Update' : 'Create'}
  </button>
)

export const SolutionFormHeader = ({
  challenge,
  isLoading,
  hasSolution,
  handleSubmit,
}: {
  challenge: Challenge
  isLoading: boolean
  hasSolution: boolean
  handleSubmit: () => void
}) => {
  return (
    <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-7xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link
            href={`/challenges/${challenge.slug}`}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Challenge
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate">{challenge.title}</span>
        </div>
        <SubmitButton isLoading={isLoading} hasSolution={hasSolution} onClick={handleSubmit} />
      </div>
    </div>
  )
}

const getCurrentContent = async (
  editorRef: React.RefObject<{ getCurrentContent: () => Promise<string> }>,
) => {
  return editorRef.current ? await editorRef.current.getCurrentContent() : ''
}

export default function CreateSolutionForm({
  challenge,
  userId,
  existingSolution,
}: CreateSolutionFormProps) {
  const editorRef = useRef<{ getCurrentContent: () => Promise<string> }>(null)
  const { metadata, content, isLoading, setIsLoading, setMetadata, setContent } = useUserSolution(
    challenge,
    userId,
  )

  const handleSubmit = async () => {
    setIsLoading(true)

    const currentContent = await getCurrentContent(editorRef)

    const response = await submitUserSolution({
      content: currentContent,
      metadata,
      challengeId: challenge.id,
      userId,
      existingSolutionId: existingSolution?.id?.toString(),
    })

    if (!response.success) {
      throw new Error(response.error || 'Failed to submit solution')
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full">
      {/* Main Header */}
      <SolutionFormHeader
        challenge={challenge}
        isLoading={isLoading}
        hasSolution={!!existingSolution}
        handleSubmit={handleSubmit}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <SolutionMetadata
              userId={userId}
              onMetadataChange={setMetadata}
              initialData={metadata}
            />
            <div className="h-[600px] border border-border rounded-lg overflow-hidden">
              <SolutionEditor
                ref={editorRef}
                onSaveContent={() => setContent(content)}
                initialContent={content}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
