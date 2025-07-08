'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Skill } from '@/payload-types'

export const getSkillBySlug = async (slug: string) => {
  const payload = await getPayload({ config })
  const skill = await payload.find({
    collection: 'skills',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (skill.docs.length === 0) {
    throw new Error(`Skill with slug "${slug}" not found`)
  }

  return skill.docs[0]
}

/**
 * Fetches all available skills from the database.
 * @returns A promise resolving to an array of objects containing skill id (as string), name, and slug.
 */
export const getAllSkills = async (): Promise<{ id: string; name: string; slug: string }[]> => {
  const payload = await getPayload({ config })
  try {
    const skillsResult = await payload.find({
      collection: 'skills',
      limit: 0,
      depth: 0,
      pagination: false,
    })

    return skillsResult.docs
      .map((doc) => ({
        id: String(doc.id),
        name: doc.name,
        slug: doc.slug,
      }))
      .filter((skill) => skill.id && skill.name && skill.slug)
  } catch (error) {
    console.error('Error fetching all skills:', error)
    return []
  }
}
