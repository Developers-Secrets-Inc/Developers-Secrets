import { getUserSolution } from '@/core/challenges/users-solutions'
import { Challenge, Tag, UserSolution } from '@/payload-types'
import { useEffect, useState } from 'react'
import { type Option } from '@/components/ui/multiselect'

type Metadata = {
  title: string
  description: string
  tags: Option[]
}

type SolutionStatus = 'drafted' | 'published'

const convertTagToOption = (tag: Tag): Option => ({
  value: tag.id.toString(),
  label: tag.status === 'test' ? `${tag.name} (private)` : tag.name,
})

export const useUserSolution = (
  challenge: Challenge,
  userId: string,
): {
  metadata: Metadata
  content: string
  status: SolutionStatus
  setStatus: (status: SolutionStatus) => void
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
  const [status, setStatus] = useState<SolutionStatus>('drafted')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        setIsLoading(true)
        const solution: (Omit<UserSolution, 'tags'> & { tags: Tag[] }) | null =
          await getUserSolution(challenge.id, userId)
        if (solution) {
          setMetadata({
            title: solution.title || '',
            description: solution.description || '',
            tags: solution.tags.map(convertTagToOption),
          })
          setContent(solution.content || '')
          setStatus((solution.status as SolutionStatus) || 'drafted')
        } else {
          setStatus('drafted')
        }
      } catch (error) {
        console.error('Error fetching solution:', error)
        setStatus('drafted')
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
    status,
    setStatus,
    isLoading,
    setIsLoading,
  }
}
