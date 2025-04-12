'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { ChallengeCategory } from '@/payload-types'

export const getChallengeCategories = async (): Promise<ChallengeCategory[]> => {
  const payload = await getPayload({ config })
  const challengeCategories = await payload.find({
    collection: 'challenge-categories',
  })

  return challengeCategories.docs
}

export const getCategoryBySlug = async (slug: string): Promise<ChallengeCategory | null> => {
  const categories = await getChallengeCategories()
  return categories.find((category) => category.slug === slug) || null
}

export const getSimilarCategories = async (
  currentCategorySlug: string,
  limit: number = 3,
): Promise<ChallengeCategory[]> => {
  const categories = await getChallengeCategories()

  // Filter out the current category and locked categories
  const availableCategories = categories.filter(
    (category) => category.slug !== currentCategorySlug && !category.isLocked,
  )

  // Shuffle the array
  const shuffledCategories = [...availableCategories].sort(() => Math.random() - 0.5)

  // Return the first n categories
  return shuffledCategories.slice(0, limit)
}
