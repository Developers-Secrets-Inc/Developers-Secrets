'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Option } from '@/components/ui/multiselect'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import useUserSolutionMetadata from '../hooks/use-user-solution-metadata'
import { UserSolutionTags } from './user-solution-tags'



const UserSolutionTitle = ({
  initialTitle,
  onTitleChange,
}: {
  initialTitle: string
  onTitleChange: (title: string) => void
}) => {
  const [title, setTitle] = useState(initialTitle)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    onTitleChange(newTitle)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        placeholder="Enter solution title..."
        value={title}
        onChange={handleTitleChange}
        className="bg-background/50"
        aria-label="Title"
        aria-required="true"
      />
    </div>
  )
}

const UserSolutionDescription = ({
  initialDescription,
  onDescriptionChange,
}: {
  initialDescription: string
  onDescriptionChange: (description: string) => void
}) => {
  const [description, setDescription] = useState(initialDescription)

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    setDescription(newDescription)
    onDescriptionChange(newDescription)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        placeholder="Enter solution description..."
        value={description}
        onChange={handleDescriptionChange}
        className="bg-background/50 min-h-[100px]"
        aria-label="Description"
        aria-required="true"
      />
    </div>
  )
}


export interface SolutionMetadata {
  title: string
  description: string
  tags: Option[]
}

interface SolutionMetadataProps {
  onMetadataChange?: (metadata: SolutionMetadata) => void
  userId: string
  initialData?: SolutionMetadata
}

export default function SolutionMetadata({ onMetadataChange, userId, initialData }: SolutionMetadataProps) {
  const { metadata, updateField } = useUserSolutionMetadata(initialData)

  const handleChange = (
    field: keyof SolutionMetadata,
    value: SolutionMetadata[keyof SolutionMetadata],
  ) => {
    updateField(field, value)
    onMetadataChange?.({ ...metadata, [field]: value })
  }

  console.log('Inside SolutionMetadata', metadata)

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <UserSolutionTitle
        initialTitle={metadata.title}
        onTitleChange={(title) => handleChange('title', title)}
      />

      <UserSolutionDescription
        initialDescription={metadata.description}
        onDescriptionChange={(description) => handleChange('description', description)}
      />

      <UserSolutionTags
        initialTags={metadata.tags}
        onTagsChange={(tags) => handleChange('tags', tags)}
        userId={userId}
      />
    </div>
  )
}
