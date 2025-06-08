'use server'
import type {
    Challenge
} from '@/payload-types'
import { unstable_cache } from 'next/cache'
import 'server-only'
import { getAllChallenges } from './challenge-queries'


const getCachedPreviousChallenge = (slug: string) => unstable_cache(
  async (): Promise<Challenge> => {
    const challenges = await getAllChallenges()

    const currentIndex = challenges.findIndex((challenge: Challenge) => challenge.slug === slug)

    if (currentIndex <= 0) {
      return challenges[challenges.length - 1]
    }

    return challenges[currentIndex - 1]
  },
  [`previous-challenge-${slug}`],
  { tags: [`challenge-${slug}`, 'all-challenges'], revalidate: 3600 }
)

export const getPreviousChallenge = async (slug: string): Promise<Challenge> => {
  return await getCachedPreviousChallenge(slug)()
}

const getCachedNextChallenge = (slug: string) => unstable_cache(
  async (): Promise<Challenge> => {
    const challenges = await getAllChallenges()

    const currentIndex = challenges.findIndex((challenge: Challenge) => challenge.slug === slug)

    if (currentIndex === -1 || currentIndex === challenges.length - 1) {
      return challenges[0]
    }

    return challenges[currentIndex + 1]
  },
  [`next-challenge-${slug}`],
  { tags: [`challenge-${slug}`, 'all-challenges'], revalidate: 3600 }
)

export const getNextChallenge = async (slug: string): Promise<Challenge> => {
  return await getCachedNextChallenge(slug)()
}

export const getRandomChallenge = async (excludeSlug?: string): Promise<Challenge> => {
  const challenges = await getAllChallenges()

  let availableChallenges = challenges

  // Exclude the current challenge if provided
  if (excludeSlug) {
    availableChallenges = availableChallenges.filter((challenge: Challenge) => challenge.slug !== excludeSlug)
  }

  if (availableChallenges.length === 0) {
    throw new Error('No challenges available')
  }

  // Select a random challenge
  const randomIndex = Math.floor(Math.random() * availableChallenges.length)
  return availableChallenges[randomIndex]
}


