'use server'

import { createTag, getTagIds } from '@/core/tags'
import {
  createUserSolution,
  updateSolutionStatus as updateSolutionStatusCore,
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
  status: 'drafted' | 'published'
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

const handleTagsCreation = async (tags: Option[], userId: string): Promise<string[]> => {
  const newTags = tags.filter((tag) => !tag.value.match(/^\d+$/))
  if (newTags.length > 0) {
    await Promise.all(newTags.map((tag) => createTag(tag.label, userId)))
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  const allTagIds = await getTagIds()
  const finalTagIds = tags
    .map((tagOpt) => {
      if (tagOpt.value.match(/^\d+$/)) {
        return tagOpt.value
      }
      const foundTag = allTagIds.find((t) => t.name === tagOpt.label)
      return foundTag ? foundTag.id : null
    })
    .filter((id): id is string => id !== null)

  return finalTagIds
}

const updateExistingSolution = async (
  solutionId: string,
  content: string,
  metadata: SolutionMetadata,
  status: 'drafted' | 'published',
  tagsIds: string[],
): Promise<SolutionResponse> => {
  try {
    console.log('Starting solution update with ID:', solutionId)

    await updateUserSolutionTitle(solutionId, metadata.title.trim())
    await updateUserSolutionDescription(solutionId, metadata.description.trim())
    await updateUserSolutionContent(solutionId, content.trim())
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
      status: 'drafted',
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
  status,
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

    const finalTagIds = await handleTagsCreation(metadata.tags, userId)

    if (existingSolutionId) {
      return await updateExistingSolution(
        existingSolutionId,
        content,
        metadata,
        status,
        finalTagIds,
      )
    } else {
      return await createNewSolution(content, metadata, challengeId, userId, finalTagIds)
    }
  } catch (error) {
    console.error('Error handling solution:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to handle solution',
    }
  }
}

export async function updateSolutionStatus(
  solutionId: string,
  newStatus: 'drafted' | 'published',
): Promise<void> {
  console.log(`Updating status for solution ${solutionId} to ${newStatus}`)
  try {
    await updateSolutionStatusCore(solutionId, newStatus)
    console.log(`Status updated successfully for solution ${solutionId}`)
  } catch (error) {
    console.error(`Error updating status for solution ${solutionId}:`, error)
    throw new Error(
      `Failed to update solution status: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
