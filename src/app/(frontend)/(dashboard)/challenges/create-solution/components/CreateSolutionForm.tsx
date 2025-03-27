'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  createUserSolution,
  updateUserSolutionContent,
  updateUserSolutionDescription,
  updateUserSolutionTitle,
  updateTags,
} from '@/core/challenges/users-solutions'
import { toast } from '@/components/ui/use-toast'
import SolutionEditor from '.'
import SolutionMetadata, { type SolutionMetadata as SolutionMetadataType } from './SolutionMetadata'
import { createTag, getTagIds } from '@/core/tags'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { UserSolution } from '@/payload-types'

interface CreateSolutionFormProps {
  challengeId: number
  userId: string
  challengeTitle: string
  challengeSlug: string
  existingSolution: UserSolution | null
}

export default function CreateSolutionForm({
  challengeId,
  userId,
  challengeTitle,
  challengeSlug,
  existingSolution,
}: CreateSolutionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState(existingSolution?.content || '')
  const [metadata, setMetadata] = useState<SolutionMetadataType>({
    title: existingSolution?.title || '',
    description: existingSolution?.description || '',
    tags:
      existingSolution?.tags?.map((tagId) => ({
        value: tagId.toString(),
        label: tagId.toString(),
      })) || [],
  })

  // Charger les données existantes si disponibles
  useEffect(() => {
    if (existingSolution) {
      setContent(existingSolution.content)
      setMetadata({
        title: existingSolution.title,
        description: existingSolution.description || '',
        tags:
          existingSolution.tags?.map((tagId) => ({
            value: tagId.toString(),
            label: tagId.toString(), // Idéalement, on devrait récupérer les noms des tags
          })) || [],
      })
    }
  }, [existingSolution])

  const handleSaveContent = useCallback((markdown: string) => {
    setContent(markdown)
  }, [])

  const handleSubmit = async () => {
    try {
      if (!content.trim()) {
        toast({
          title: 'Error',
          description: 'Please write some content for your solution',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)

      // Create new tags if needed
      const newTags = metadata.tags.filter((tag) => !tag.value.match(/^\d+$/))
      if (newTags.length > 0) {
        await Promise.all(newTags.map((tag) => createTag(tag.label, userId)))
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait for tags to be created
      }

      // Get tag IDs
      const tagsIds = await getTagIds()

      if (existingSolution) {
        // Update existing solution
        await Promise.all([
          updateUserSolutionTitle(existingSolution.id.toString(), metadata.title.trim()),
          updateUserSolutionDescription(
            existingSolution.id.toString(),
            metadata.description.trim(),
          ),
          updateUserSolutionContent(existingSolution.id.toString(), content.trim()),
          updateTags(existingSolution.id.toString(), tagsIds),
        ])

        toast({
          title: 'Success',
          description: 'Solution updated successfully!',
        })
      } else {
        // Create new solution
        const solution = {
          challengeId,
          authorId: userId,
          title: metadata.title.trim() || 'Untitled Solution',
          description: metadata.description.trim() || 'No description provided',
          content: content.trim(),
          tagsIds,
        }

        await createUserSolution(solution)

        toast({
          title: 'Success',
          description: 'Solution created successfully!',
        })

        // Reset form only for new solutions
        setContent('')
        setMetadata({
          title: '',
          description: '',
          tags: [],
        })
      }
    } catch (error) {
      console.error('Error handling solution:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to handle solution',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Main Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 max-w-7xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link
              href={`/challenges/${challengeSlug}`}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Challenge
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate">{challengeTitle}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading
              ? existingSolution
                ? 'Updating...'
                : 'Creating...'
              : existingSolution
                ? 'Update'
                : 'Create'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SolutionMetadata userId={userId} onChange={setMetadata} initialData={metadata} />
        <div className="h-[600px] border border-border rounded-lg overflow-hidden">
          <SolutionEditor onSaveContent={handleSaveContent} initialContent={content} />
        </div>
      </div>
    </div>
  )
}
