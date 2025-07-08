'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { UserOnboarding } from '@/payload-types'
import { TimeCoding, CodingLevel } from './types'

export const createInitialOnboarding = async (userId: string): Promise<UserOnboarding> => {
  const payload = await getPayload({ config })

  // Check if an onboarding document already exists for this user
  const existingOnboarding = await payload.find({
    collection: 'user-onboarding',
    where: {
      userId: { equals: userId },
    },
    limit: 1,
  })

  if (existingOnboarding.docs.length > 0) {
    console.warn(
      `Onboarding document already exists for user ID: ${userId}. Returning existing document.`,
    )
    return existingOnboarding.docs[0] // Return existing document
  }

  // Create the new document and return the created document
  const newOnboarding = await payload.create({
    collection: 'user-onboarding',
    data: {
      userId,
      skipped: false,
      // Initialize other fields with default empty values as needed
      codingLevel: 'beginner', // Default value
      timeCoding: 'less-than-6-months', // Default value
      selectedLanguages: [],
      selectedConcepts: [],
      selectedGoals: [],
      selectedTechnologiesToLearn: [],
    },
  })

  console.log(`Created initial onboarding document for user ID: ${userId}`)
  return newOnboarding
}

export const getOnboarding = async (userId: string): Promise<UserOnboarding | null> => {
  const payload = await getPayload({ config })

  try {
    const onboarding = await payload.find({
      collection: 'user-onboarding',
      where: {
        userId: { equals: userId }, // Use equals operator for filtering
      },
      limit: 1,
    })

    return onboarding.docs.length > 0 ? onboarding.docs[0] : null // Return document or null
  } catch (error) {
    console.error(`Error fetching onboarding document for user ID ${userId}:`, error)
    return null // Return null in case of any error during fetch
  }
}

export const updateOnboarding = async (
  userId: string,
  data: Partial<UserOnboarding>,
): Promise<void> => {
  // Try to get the existing onboarding document
  let onboarding = await getOnboarding(userId)

  // If it doesn't exist, create it
  if (!onboarding) {
    onboarding = await createInitialOnboarding(userId)
    // If creation also fails, we cannot proceed
    if (!onboarding || !onboarding.id) {
      console.error(
        `Failed to get or create onboarding document for user ID: ${userId}. Cannot update.`,
      )
      return // Exit if still no document or document ID
    }
  }

  const payload = await getPayload({ config })

  console.log('data', data)
  console.log('onboardingId for update', onboarding.id)

  try {
    // Use the document ID from the retrieved/created onboarding document
    await payload.update({
      collection: 'user-onboarding',
      id: onboarding.id, // Use the actual document ID
      data,
    })
    console.log(`Updated onboarding document ${onboarding.id} for user ${userId}`)
  } catch (error) {
    console.error(`Error updating onboarding document ${onboarding.id} for user ${userId}:`, error)
    // Depending on desired behavior, you might re-throw or handle specifically
  }
}

export const setCodingLevel = async (userId: string, codingLevel: CodingLevel): Promise<void> => {
  await updateOnboarding(userId, { codingLevel })
}

export const setTimeCoding = async (userId: string, timeCoding: TimeCoding): Promise<void> => {
  await updateOnboarding(userId, { timeCoding })
}

export const addSelectedLanguages = async (
  userId: string,
  selectedLanguages: { value: string; label: string }[],
): Promise<void> => {
  await updateOnboarding(userId, { selectedLanguages })
}

export const addSelectedConcepts = async (
  userId: string,
  selectedConcepts: { value: string; label: string }[],
): Promise<void> => {
  await updateOnboarding(userId, { selectedConcepts })
}

// Add similar Server Actions for Goals and TechnologiesToLearn
export const addSelectedGoals = async (
  userId: string,
  selectedGoals: { value: string; label: string }[],
): Promise<void> => {
  await updateOnboarding(userId, { selectedGoals })
}

export const addSelectedTechnologiesToLearn = async (
  userId: string,
  selectedTechnologiesToLearn: { value: string; label: string }[],
): Promise<void> => {
  await updateOnboarding(userId, { selectedTechnologiesToLearn })
}

// Server Action to handle skipping onboarding
export const skipOnboarding = async (userId: string): Promise<void> => {
  await updateOnboarding(userId, { skipped: true })
}

export const getOrCreateUserOnboarding = async (userId: string): Promise<UserOnboarding> => {
  const payload = await getPayload({ config })
  // Try to find existing onboarding
  const result = await payload.find({
    collection: 'user-onboarding',
    where: { userId: { equals: userId } },
    limit: 1,
    depth: 0,
  })
  if (result.docs.length > 0) return result.docs[0]
  // Create if not found
  return await payload.create({
    collection: 'user-onboarding',
    data: { userId, skipped: false },
  })
}

export const addOrUpdateSelectedTechnologies = async (
  userId: string,
  technologies: { value: string; label: string }[],
): Promise<void> => {
  const payload = await getPayload({ config })
  const onboarding = await getOrCreateUserOnboarding(userId)
  await payload.update({
    collection: 'user-onboarding',
    id: onboarding.id,
    data: { selectedLanguages: technologies },
  })
}

export const addOrUpdateSelectedConcepts = async (
  userId: string,
  concepts: { value: string; label: string }[],
): Promise<void> => {
  const payload = await getPayload({ config })
  const onboarding = await getOrCreateUserOnboarding(userId)
  await payload.update({
    collection: 'user-onboarding',
    id: onboarding.id,
    data: { selectedConcepts: concepts },
  })
}
