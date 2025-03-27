'use client'

import { useState, useCallback } from 'react'
import { createUserSolution } from '@/core/challenges/users-solutions'
import { toast } from '@/components/ui/use-toast'
import SolutionEditor from '.'
import SolutionMetadata, { type SolutionMetadata as SolutionMetadataType } from './SolutionMetadata'
import { createTag, getTagIds } from '@/core/tags'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CreateSolutionFormProps {
  challengeId: number
  userId: string
  challengeTitle: string
  challengeSlug: string
}

export default function CreateSolutionForm({
  challengeId,
  userId,
  challengeTitle,
  challengeSlug,
}: CreateSolutionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState('')
  const [metadata, setMetadata] = useState<SolutionMetadataType>({
    title: '',
    description: '',
    tags: [],
  })

  const handleSaveContent = useCallback((markdown: string) => {
    setContent(markdown)
  }, [])

  const handleCreate = async () => {
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
      console.log('Creating solution with content:', content)

      // Create new tags if needed
      const newTags = metadata.tags.filter((tag) => !tag.value.match(/^\d+$/))
      if (newTags.length > 0) {
        await Promise.all(newTags.map((tag) => createTag(tag.label, userId)))
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait for tags to be created
      }

      // Get tag IDs
      const tagsIds = await getTagIds()

      // Create the solution
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

      // Reset form
      setContent('')
      setMetadata({
        title: '',
        description: '',
        tags: [],
      })
    } catch (error) {
      console.error('Error creating solution:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create solution',
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
            onClick={handleCreate}
            disabled={isLoading}
            className={`px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SolutionMetadata userId={userId} onChange={setMetadata} />
        <div className="h-[600px] border border-border rounded-lg overflow-hidden">
          <SolutionEditor onSaveContent={handleSaveContent} />
        </div>
      </div>
    </div>
  )
}
