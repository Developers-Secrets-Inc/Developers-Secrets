'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

export const getLearningPaths = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'learning-paths',
      depth: 2, // pour peupler les relations courses
    })
    return result.docs
  },
  ['learning-paths'],
  { revalidate: 5 },
)

export const getLearningPathsWithoutCache = async () => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'learning-paths',
    depth: 2, // pour peupler les relations courses
  })
  return result.docs
}

// TODO: Add error handling if there is no learning path found or multiple learning paths found
export const getLearningPathBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'learning-paths',
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs[0]
  },
  ['learning-path-by-slug'],
  { revalidate: 5 },
)
