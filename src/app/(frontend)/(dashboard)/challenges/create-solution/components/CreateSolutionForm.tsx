'use client'

import { FC, useState } from 'react'
import SolutionEditor from '.'
import SolutionMetadata, { type SolutionMetadata as SolutionMetadataType } from './SolutionMetadata'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface CreateSolutionFormProps {
  challengeId: number
  userId: string
}

const CreateSolutionForm: FC<CreateSolutionFormProps> = ({ challengeId, userId }) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState<string>('')
  const [metadata, setMetadata] = useState<SolutionMetadataType>({
    title: '',
    description: '',
    tags: [],
  })

  const handleSaveContent = (markdown: string) => {
    setContent(markdown)
  }

  const handleMetadataChange = (newMetadata: SolutionMetadataType) => {
    setMetadata(newMetadata)
  }

  const validateForm = (): string | null => {
    if (!metadata.title.trim()) {
      return 'Title is required'
    }
    if (!metadata.description.trim()) {
      return 'Description is required'
    }
    if (!content.trim()) {
      return 'Solution content is required'
    }
    if (metadata.tags.length === 0) {
      return 'At least one tag is required'
    }
    return null
  }

  const handleCreate = async () => {
    const error = validateForm()
    if (error) {
      toast({
        title: 'Validation Error',
        description: error,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const solution = {
        challengeId,
        userId,
        title: metadata.title.trim(),
        description: metadata.description.trim(),
        content: content.trim(),
        tagIds: metadata.tags.map((tag) => tag.value),
      }

      // TODO: Appeler l'API pour créer la solution
      console.log('Creating solution:', solution)

      toast({
        title: 'Success',
        description: 'Solution created successfully',
      })
    } catch (error) {
      console.error('Error creating solution:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create solution',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Create Solution</h1>
        <Button onClick={handleCreate} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </div>
      <SolutionMetadata onChange={handleMetadataChange} userId={userId} />
      <div className="flex-1">
        <SolutionEditor onSaveContent={handleSaveContent} />
      </div>
    </div>
  )
}

export default CreateSolutionForm
