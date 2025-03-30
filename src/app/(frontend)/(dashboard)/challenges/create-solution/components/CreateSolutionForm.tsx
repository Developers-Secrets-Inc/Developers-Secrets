'use client'

import { type Option } from '@/components/ui/multiselect'
import { submitUserSolution } from '@/core/challenges/users-solutions/actions'
import { Tag as PayloadTag, UserSolution } from '@/payload-types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState, useRef } from 'react'
import SolutionEditor from '.'
import SolutionMetadata, { type SolutionMetadata as SolutionMetadataType } from './SolutionMetadata'
import { useToast } from '@/components/ui/use-toast'

interface Challenge {
  id: number
  title: string
  slug: string
}

interface CreateSolutionFormProps {
  challenge: Challenge
  userId: string
  existingSolution: (Omit<UserSolution, 'tags'> & { tags: PayloadTag[] }) | null
}

const convertTagToOption = (tag: PayloadTag): Option => ({
  value: tag.id.toString(),
  label: tag.name,
})

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

export default function CreateSolutionForm({
  challenge,
  userId,
  existingSolution,
}: CreateSolutionFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState(existingSolution?.content || '')
  const editorRef = useRef<{ getCurrentContent: () => Promise<string> }>()
  const [metadata, setMetadata] = useState<SolutionMetadataType>({
    title: existingSolution?.title || '',
    description: existingSolution?.description || '',
    tags: existingSolution?.tags ? existingSolution.tags.map(convertTagToOption) : [],
  })

  // Charger les données existantes si disponibles
  useEffect(() => {
    if (existingSolution) {
      setContent(existingSolution.content)
      setMetadata({
        title: existingSolution.title,
        description: existingSolution.description || '',
        tags: existingSolution.tags.map(convertTagToOption),
      })
    }
  }, [existingSolution])

  const handleSaveContent = useCallback((markdown: string) => {
    setContent(markdown)
  }, [])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      // Récupérer le contenu le plus récent de l'éditeur
      const currentContent = editorRef.current
        ? await editorRef.current.getCurrentContent()
        : content

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

      toast({
        title: 'Success',
        description: response.message || 'Solution saved successfully',
      })
    } catch (error) {
      console.error('Error submitting solution:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit solution',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
        <SolutionMetadata userId={userId} onMetadataChange={setMetadata} initialData={metadata} />
        <div className="h-[600px] border border-border rounded-lg overflow-hidden">
          <SolutionEditor
            ref={editorRef}
            onSaveContent={handleSaveContent}
            initialContent={content}
          />
        </div>
      </div>
    </div>
  )
}
