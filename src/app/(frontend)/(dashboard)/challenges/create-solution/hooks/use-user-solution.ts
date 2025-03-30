import { getUserSolution } from '@/core/challenges/users-solutions'
import { Challenge, Tag } from '@/payload-types'
import { useEffect, useState } from 'react'
import { type Option } from '@/components/ui/multiselect'

type Metadata = {
  title: string
  description: string
  tags: Option[]
}

const convertTagToOption = (tag: Tag): Option => ({
  value: tag.id.toString(),
  label: tag.name,
})

export const useUserSolution = (
  challenge: Challenge,
  userId: string,
): {
  metadata: Metadata
  content: string
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  setMetadata: (metadata: Metadata) => void
  setContent: (content: string) => void
} => {
  const [metadata, setMetadata] = useState<Metadata>({
    title: '',
    description: '',
    tags: [],
  })
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        setIsLoading(true)
        const solution = await getUserSolution(challenge.id, userId)
        if (solution) {
          setMetadata({
            title: solution.title || '',
            description: solution.description || '',
            tags: solution.tags.map(convertTagToOption),
          })
          setContent(solution.content || '')
        }
      } catch (error) {
        console.error('Error fetching solution:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSolution()
  }, [challenge.id, userId])

  return {
    metadata,
    setMetadata,
    content,
    setContent,
    isLoading,
    setIsLoading,
  }
}
