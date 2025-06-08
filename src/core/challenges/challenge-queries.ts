'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import { ChallengeNotFoundError } from './errors'
import { Challenge } from '@/payload-types'

import { unstable_cache } from 'next/cache'

const CHALLENGE_COLLECTION_NAME = 'challenges'


export const getAllChallenges = unstable_cache(
  async (pagination: boolean = false): Promise<Challenge[]> => {
    const payload = await getPayload({ config })
    const challenges = await payload.find({
      collection: CHALLENGE_COLLECTION_NAME,
      pagination,
    })
    return challenges.docs
  },
  ['all-challenges'],
  { 
    tags: ['all-challenges'],
    revalidate: 3600
  },
)

export const getAllChallengesSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config })
    const challenges = await payload.find({
      collection: CHALLENGE_COLLECTION_NAME,
      select: { slug: true },
    })
    return challenges.docs.map((challenge) => challenge.slug)
  },
  ['all-challenges-slugs'],
  { 
    tags: ['all-challenges-slugs'],
    revalidate: 3600
  },
)

const getCachedChallengeById = (id: number, depth: number = 1) => unstable_cache(
  async (): Promise<Challenge> => {
    const payload = await getPayload({ config })
    const challenge = await payload.findByID({
      collection: CHALLENGE_COLLECTION_NAME,
      id,
      depth,
    })

    if (!challenge) {
      throw new ChallengeNotFoundError()
    }

    return challenge
  },
  [id.toString(), depth.toString()],
  { 
    tags: [`challenge-${id}`],
    revalidate: 3600
  }
)

export const getChallengeById = async (id: number, depth: number = 1) => {
  return await getCachedChallengeById(id, depth)()
}

const getCachedChallengeBySlug = (slug: string, depth: number = 2) => unstable_cache(
  async (): Promise<Challenge> => {
    const payload = await getPayload({ config })
    const challenge = await payload.find({
      collection: CHALLENGE_COLLECTION_NAME,
      where: {
        slug: {
          equals: slug,
        },
      },
      depth,
    })
    if (!challenge.docs.length) {
      throw new ChallengeNotFoundError()
    }
    return challenge.docs[0]
  },
  [slug, depth.toString()],
  { 
    tags: [`challenge-${slug}`],
    revalidate: 3600
  }
)


export const getChallengeBySlug = async (slug: string, depth: number = 2) => {
  return await getCachedChallengeBySlug(slug, depth)()
}
  