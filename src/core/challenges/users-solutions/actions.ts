'use server'

import { createTag, getTagIds } from '@/core/tags'
import {
  createUserSolution,
  updateUserSolutionTitle,
  updateUserSolutionDescription,
  updateUserSolutionContent,
  updateTags,
} from '@/core/challenges/users-solutions'
import { Option } from '@/components/ui/multiselect'

interface SolutionMetadata {
  title: string
  description: string
  tags: Option[]
}

interface SubmitSolutionParams {
  content: string
  metadata: SolutionMetadata
  existingSolutionId?: string
  challengeId: number
  userId: string
}

interface SolutionResponse {
  success: boolean
  message?: string
  error?: string
  resetForm?: boolean
}

const handleTagsCreation = async (tags: Option[], userId: string) => {
  const newTags = tags.filter((tag) => !tag.value.match(/^\d+$/))
  if (newTags.length > 0) {
    await Promise.all(newTags.map((tag) => createTag(tag.label, userId)))
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait for tags to be created
  }
  return await getTagIds()
}

const updateExistingSolution = async (
  solutionId: string,
  content: string,
  metadata: SolutionMetadata,
  tagsIds: string[],
): Promise<SolutionResponse> => {
  try {
    console.log('Starting solution update with ID:', solutionId)
    console.log('Content to update:', content)
    console.log('Metadata to update:', metadata)
    console.log('Tags to update:', tagsIds)

    // Effectuer les mises à jour une par une pour mieux tracer les erreurs
    console.log('Updating title...')
    await updateUserSolutionTitle(solutionId, metadata.title.trim())

    console.log('Updating description...')
    await updateUserSolutionDescription(solutionId, metadata.description.trim())

    console.log('Updating content...')
    await updateUserSolutionContent(solutionId, content.trim())

    console.log('Updating tags...')
    await updateTags(solutionId, tagsIds.map(Number))

    console.log('Solution update completed successfully')
    return {
      success: true,
      message: 'Solution updated successfully!',
    }
  } catch (error) {
    console.error('Error updating solution:', error)
    throw error
  }
}

async function createNewSolution(
  content: string,
  metadata: SolutionMetadata,
  challengeId: number,
  userId: string,
  tagsIds: string[],
): Promise<SolutionResponse> {
  try {
    const solution = {
      challengeId,
      authorId: userId,
      title: metadata.title.trim() || 'Untitled Solution',
      description: metadata.description.trim() || 'No description provided',
      content: content.trim(),
      tagsIds: tagsIds.map(Number),
    }

    await createUserSolution(solution)

    return {
      success: true,
      message: 'Solution created successfully!',
      resetForm: true,
    }
  } catch (error) {
    throw error
  }
}

export async function submitUserSolution({
  content,
  metadata,
  existingSolutionId,
  challengeId,
  userId,
}: SubmitSolutionParams): Promise<SolutionResponse> {
  try {
    if (!content.trim()) {
      return {
        success: false,
        error: 'Please write some content for your solution',
      }
    }

    // Handle tags creation and get IDs
    const tagsIds = await handleTagsCreation(metadata.tags, userId)

    // Handle solution submission
    if (existingSolutionId) {
      return await updateExistingSolution(
        existingSolutionId,
        content,
        metadata,
        tagsIds.map(String),
      )
    } else {
      return await createNewSolution(content, metadata, challengeId, userId, tagsIds.map(String))
    }
  } catch (error) {
    console.error('Error handling solution:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to handle solution',
    }
  }
}

