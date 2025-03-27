'use server'

import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Tag } from '@/payload-types'
import {
  TagNotFoundError,
  TagAlreadyExistsError,
  TagNotEligibleForPublicError,
  TagUpdateError,
} from './errors'

// Types basiques pour les tags

export const createTag = async (name: string, creatorId: string): Promise<void> => {
  const payload = await getPayload({ config })

  try {
    // Vérifier si le tag existe déjà
    const existingTag = await payload.find({
      collection: 'tags',
      where: {
        name: { equals: name },
      },
    })

    if (existingTag.docs && existingTag.docs.length > 0) {
      throw new TagAlreadyExistsError(name)
    }

    await payload.create({
      collection: 'tags',
      data: {
        name,
        creatorId,
        status: 'test',
        usageCount: 0,
        lastUsedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof TagAlreadyExistsError) {
      throw error
    }
    console.error('Error creating tag:', error)
    throw new TagUpdateError(error instanceof Error ? error.message : 'Unknown error')
  }
}

export const getTags = async (): Promise<Tag[]> => {
  const payload = await getPayload({ config })

  const tags = await payload.find({
    collection: 'tags',
  })

  return tags.docs as Tag[]
}

export const getTagIds = async (): Promise<number[]> => {
  const tags = await getTags()
  return tags.map((tag) => tag.id)
}

export const getTagByName = async (name: string): Promise<Tag> => {
  const payload = await getPayload({ config })

  try {
    const tag = await payload.find({
      collection: 'tags',
      where: {
        name: { equals: name },
      },
    })

    if (!tag.docs || tag.docs.length === 0) {
      throw new TagNotFoundError(name)
    }

    return tag.docs[0] as Tag
  } catch (error) {
    if (error instanceof TagNotFoundError) {
      throw error
    }
    console.error('Error getting tag:', error)
    throw new TagUpdateError(error instanceof Error ? error.message : 'Unknown error')
  }
}

export const setTagToPublic = async (tag: Tag): Promise<void> => {
  const payload = await getPayload({ config })

  // Vérification des critères
  if (tag.usageCount < 10) {
    throw new TagNotEligibleForPublicError('must have at least 10 uses')
  }

  const createdAtDiff = Date.now() - new Date(tag.lastUsedAt).getTime()
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
  if (createdAtDiff < sevenDaysInMs) {
    throw new TagNotEligibleForPublicError('must be at least 7 days old')
  }

  try {
    await payload.update({
      collection: 'tags',
      id: tag.id,
      data: {
        status: 'public',
      },
    })
  } catch (error) {
    console.error('Error updating tag status:', error)
    throw new TagUpdateError(error instanceof Error ? error.message : 'Unknown error')
  }
}

export const increaseTagUsage = async (tag: Tag, quantity: number = 1): Promise<void> => {
  const payload = await getPayload({ config })

  try {
    await payload.update({
      collection: 'tags',
      id: tag.id,
      data: {
        usageCount: (tag.usageCount || 0) + quantity,
        lastUsedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error increasing tag usage:', error)
    throw new TagUpdateError(error instanceof Error ? error.message : 'Unknown error')
  }
}
