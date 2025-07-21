'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { useState } from 'react'

// Define available tags
const availableTags: Option[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'redis', label: 'Redis' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'aws', label: 'AWS' },
]

export interface SolutionMetadata {
  title: string
  description: string
  tags: Option[]
}

interface SolutionMetadataProps {
  onChange?: (metadata: SolutionMetadata) => void
}

export default function SolutionMetadata({ onChange }: SolutionMetadataProps) {
  const [metadata, setMetadata] = useState<SolutionMetadata>({
    title: '',
    description: '',
    tags: [],
  })

  const handleChange = (field: keyof SolutionMetadata, value: any) => {
    const newMetadata = { ...metadata, [field]: value }
    setMetadata(newMetadata)
    onChange?.(newMetadata)
  }

  return (
    <div className="space-y-4 p-4 bg-[#1f1f1f] border-b">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter solution title..."
          value={metadata.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="bg-[#2d2d2d] border-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter solution description..."
          value={metadata.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="bg-[#2d2d2d] border-0 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <MultipleSelector
          value={metadata.tags}
          onChange={(value) => handleChange('tags', value)}
          defaultOptions={availableTags}
          placeholder="Select tags"
          commandProps={{
            label: 'Select tags',
          }}
          hideClearAllButton={false}
          hidePlaceholderWhenSelected
          emptyIndicator={<p className="text-center text-sm">No matching tags found</p>}
        />
      </div>
    </div>
  )
}
