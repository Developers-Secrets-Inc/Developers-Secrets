'use server'

import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DEFAULT_LEVEL_UP_FORMULA, getGamificationInformations } from '@/core/gamification/level'
import { getUserIsSolutionUnlocked } from '@/core/challenges/user-progression'

import { Challenge } from '@/types/challenge'
import type {
  Challenge as PayloadChallenge,
  UserChallengeProgression,
  CodeVersion,
  Concept,
} from '@/payload-types'
import { Where } from 'payload/types'
import { PaginatedDocs } from 'payload/database'
import { Payload } from 'payload'
import { Result } from '@/core/user/result'
import { CompletionStatus } from './user-progression/types'

class ChallengeNotFoundError extends Error {
  constructor() {
    super('Challenge not found')
  }
}

export const getPreviousChallenge = async (slug: string): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })

  // Get all challenges sorted by creation date
  const challenges = await payload.find({
    collection: 'challenges',
    sort: 'createdAt',
  })

  const docs = challenges.docs

  // Find the index of the current challenge
  const currentIndex = docs.findIndex((challenge) => challenge.slug === slug)

  if (currentIndex <= 0) {
    // If it's the first challenge or not found, return the last challenge (circular navigation)
    return docs[docs.length - 1]
  }

  // Return the previous challenge
  return docs[currentIndex - 1]
}

export const getNextChallenge = async (slug: string): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })

  // Get all challenges sorted by creation date
  const challenges = await payload.find({
    collection: 'challenges',
    sort: 'createdAt',
  })

  const docs = challenges.docs

  // Find the index of the current challenge
  const currentIndex = docs.findIndex((challenge) => challenge.slug === slug)

  if (currentIndex === -1 || currentIndex === docs.length - 1) {
    // If it's the last challenge or not found, return the first challenge (circular navigation)
    return docs[0]
  }

  // Return the next challenge
  return docs[currentIndex + 1]
}

export const getRandomChallenge = async (excludeSlug?: string): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })

  // Get all challenges
  const challenges = await payload.find({
    collection: 'challenges',
    limit: 100, // Set a reasonable limit
  })

  let availableChallenges = challenges.docs

  // Exclude the current challenge if provided
  if (excludeSlug) {
    availableChallenges = availableChallenges.filter((challenge) => challenge.slug !== excludeSlug)
  }

  if (availableChallenges.length === 0) {
    throw new Error('No challenges available')
  }

  // Select a random challenge
  const randomIndex = Math.floor(Math.random() * availableChallenges.length)
  return availableChallenges[randomIndex]
}

export const getPayloadChallenge = async (id: number): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })
  const challenge = await payload.find({
    collection: 'challenges',
    where: {
      id: {
        equals: id,
      },
    },
  })
  if (!challenge.docs.length) {
    throw new ChallengeNotFoundError()
  }
  return challenge.docs[0]
}

export const getChallengeBySlug = async (slug: string): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })
  const challenge = await payload.find({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2, // Populate nested relationships like skillImpacts.skill
  })
  if (!challenge.docs.length) {
    throw new ChallengeNotFoundError()
  }
  return challenge.docs[0]
}

export const addDescriptionComment = async (
  challengeSlug: string,
  comment: {
    authorId: string
    content: string
  },
) => {
  const payload = await getPayload({ config })

  // First, get the challenge to access existing comments
  const challenge = await getChallengeBySlug(challengeSlug)

  // Get existing comments or initialize an empty array if none exist
  const existingComments = challenge.description?.comments || []

  // Now update with both existing comments and the new one
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: challengeSlug,
      },
    },
    data: {
      description: {
        comments: [...existingComments, comment],
      },
    },
  })
}

export const addLikeToChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(challengeId)
  const currentLikes = challenge.engagement?.likes || 0 // Get current likes
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        likes: currentLikes + 1, // Increment likes by 1
      },
    },
  })
}

export const removeLikeFromChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(challengeId)
  const currentLikes = challenge.engagement?.likes || 0 // Get current likes
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        likes: Math.max(0, currentLikes - 1), // Decrement likes by 1, ensuring it doesn't go below 0
      },
    },
  })
}

export const addDislikeToChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(challengeId)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        dislikes: currentDislikes + 1,
      },
    },
  })
}

export const removeDislikeFromChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(challengeId)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        dislikes: Math.max(0, currentDislikes - 1),
      },
    },
  })
}

export const addRatingToChallenge = async (challengeId: number, rating: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(challengeId)

  const currentTotal = challenge.ratings?.total || 0
  const currentCount = challenge.ratings?.count || 0

  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      ratings: {
        total: currentTotal + rating,
        count: currentCount + 1,
        // average will be calculated automatically by the hook
      },
    },
  })
}

export const updateRatingForChallenge = async (
  challengeId: number,
  oldRating: number,
  newRating: number,
): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(challengeId)

  const currentTotal = challenge.ratings?.total || 0

  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      ratings: {
        total: currentTotal - oldRating + newRating,
        // Count stays the same since we're updating an existing rating
        count: challenge.ratings?.count || 0,
        // average will be calculated automatically by the hook
      },
    },
  })
}

// ===============================

export const getAllChallenges = async (): Promise<PayloadChallenge[]> => {
  const payload = await getPayload({ config })
  const challenges = await payload.find({
    collection: 'challenges',
    pagination: false,
  })
  return challenges.docs
}

export const getAllChallengesSlugs = async (): Promise<string[]> => {
  const challenges = await getAllChallenges()
  return challenges.map((challenge) => challenge.slug)
}

export const getNextChallengeUrl = async (currentSlug: string): Promise<string> => {
  const nextChallenge = await getNextChallenge(currentSlug)
  return `/challenges/${nextChallenge.slug}`
}

export const getChallengeExperience = async (challengeId: number): Promise<number> => {
  const challenge = await getPayloadChallenge(challengeId)
  return challenge.baseExperience || 50 // Default to 50 if not set
}

export interface ChallengeCompletionData {
  wasUnlocked: boolean
  challengeExperience: number
  nextChallengeUrl: string
  gamificationInfo: {
    currentLevel: number
    currentExperience: number
    totalExperience: number
    nextLevelExperience: number
  }
}

export const getChallengeCompletionData = async (
  userId: string,
  challengeId: number,
  challengeSlug: string,
): Promise<ChallengeCompletionData> => {
  // Fetch all required data in parallel
  const [challenge, nextChallenge, wasUnlocked, gamificationInfo] = await Promise.all([
    getPayloadChallenge(challengeId),
    getNextChallenge(challengeSlug),
    getUserIsSolutionUnlocked(userId, challengeId),
    getGamificationInformations(userId),
  ])

  return {
    wasUnlocked,
    challengeExperience: challenge.baseExperience || 50,
    nextChallengeUrl: `/challenges/${nextChallenge.slug}`,
    gamificationInfo: {
      currentLevel: gamificationInfo.currentLevel,
      currentExperience: gamificationInfo.currentExperience,
      totalExperience: gamificationInfo.totalExperience,
      nextLevelExperience: await DEFAULT_LEVEL_UP_FORMULA(gamificationInfo.currentLevel),
    },
  }
}

// Define the simplified structure for return (id is number)
export interface SimpleChallenge {
  id: number
  title: string
  slug: string
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible' | string // Allow string for flexibility
}

/**
 * Fetches challenges related to a specific abstract Concept ID.
 * Searches through nested skillImpacts blocks.
 *
 * @param conceptId - The ID of the abstract Concept.
 * @returns A promise resolving to an array of simplified challenge objects.
 */
export const getChallengesForConcept = async (conceptId: number): Promise<SimpleChallenge[]> => {
  if (!conceptId) {
    console.warn('getChallengesForConcept called with invalid conceptId')
    return []
  }

  console.log(`Fetching challenges related to Concept ID: ${conceptId}`)
  const payload = await getPayload({ config })

  try {
    const challengesResult = await payload.find({
      collection: 'challenges',
      limit: 0,
      depth: 2, // Keep depth 2
      pagination: false,
    })

    // Filter in code with correct nested iteration
    const filteredDocs = (challengesResult.docs as PayloadChallenge[]).filter(
      (challenge) =>
        challenge.skillImpacts?.some((skillImpactSet) =>
          skillImpactSet.impacts?.some((impactBlock) => {
            // Use type assertion as any to bypass persistent linter issue
            const block = impactBlock as any

            // Check if it's the correct block type
            if (block.blockType !== 'baseConceptImpact') {
              return false
            }
            // Check if the concept field exists
            if (!block.concept) {
              return false
            }
            // Compare the concept ID
            const impactConceptId =
              typeof block.concept === 'number' ? block.concept : block.concept.id
            return impactConceptId === conceptId
          }),
        ) ?? false,
    )

    // Map the *filtered* documents
    const challenges = filteredDocs
      .map((doc) => ({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        difficulty: doc.difficulty ?? 'medium',
      }))
      .filter((c) => c.id && c.title && c.slug && c.difficulty)

    console.log(`Found ${challenges.length} challenges for concept ${conceptId} after filtering.`)
    return challenges
  } catch (error) {
    console.error(`Error fetching challenges for concept ID ${conceptId}:`, error)
    return [] // Return empty array on error
  }
}

// --- Keep other existing functions in this file ---
// Example: Assuming getChallengeWithDepth exists here
export const getChallengeWithDepth = async (challengeId: number): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })
  const challenge = await payload.findByID({
    collection: 'challenges',
    id: challengeId,
    depth: 3,
  })

  if (!challenge) {
    throw new Error(`Challenge with ID "${challengeId}" not found`)
  }

  return challenge as PayloadChallenge
}

// Add other functions from src/core/challenges/index.ts if they exist

// Interface for the combined data structure
export interface ChallengeWithProgress {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible' | string
  baseExperience: number
  slug: string
  status: 'not_started' | 'in_progress' | 'completed'
  draft?: boolean
}

// Define the pagination structure directly
export interface PaginatedChallengesWithProgress {
  docs: ChallengeWithProgress[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null | undefined
  nextPage: number | null | undefined
}

// Interface for the parameters of the new action
interface GetChallengesWithProgressParams {
  userId: string
  limit?: number
  page?: number
  sort?: string
  filter?: string
}

/**
 * Fetches challenges with their completion status for a specific user,
 * supporting pagination, sorting, and filtering by title.
 */
export const getChallengesWithProgress = async ({
  userId,
  limit = 25,
  page = 1,
  sort = '-baseExperience',
  filter = '',
}: GetChallengesWithProgressParams): Promise<PaginatedChallengesWithProgress> => {
  const payload = await getPayload({ config })

  const challengeWhereClause: Where = {}
  if (filter) {
    challengeWhereClause.title = {
      like: filter,
    }
  }

  const challengesResult = await payload.find({
    collection: 'challenges',
    where: challengeWhereClause,
    limit,
    page,
    sort,
    depth: 0,
    pagination: true,
  })

  const userProgressionsResult = await payload.find({
    collection: 'userChallengeProgression',
    where: {
      userId: { equals: userId },
      challenge: { in: challengesResult.docs.map((doc) => doc.id) },
    },
    limit: 0,
    pagination: false,
    depth: 0,
  })

  const progressionMap = new Map<number, UserChallengeProgression>()
  userProgressionsResult.docs.forEach((prog) => {
    const challengeId = typeof prog.challenge === 'number' ? prog.challenge : prog.challenge?.id
    if (challengeId) {
      progressionMap.set(challengeId, prog)
    }
  })

  const challengesWithProgress: ChallengeWithProgress[] = challengesResult.docs.map((challenge) => {
    const progression = progressionMap.get(challenge.id)
    return {
      id: challenge.id,
      title: challenge.title,
      difficulty: challenge.difficulty ?? 'medium',
      // Ensure baseExperience has a default value if undefined
      baseExperience: challenge.baseExperience ?? 50,
      slug: challenge.slug,
      status: progression?.completionStatus ?? 'not_started',
    }
  })

  // Explicitly check and provide defaults for potentially undefined pagination fields
  const safeTotalDocs = challengesResult.totalDocs ?? 0
  const safeLimit = challengesResult.limit ?? limit
  const safeTotalPages = challengesResult.totalPages ?? Math.ceil(safeTotalDocs / safeLimit)
  const safePage = challengesResult.page ?? page
  const safePagingCounter = challengesResult.pagingCounter ?? (safePage - 1) * safeLimit + 1

  return {
    docs: challengesWithProgress,
    totalDocs: safeTotalDocs,
    limit: safeLimit,
    totalPages: safeTotalPages,
    page: safePage,
    pagingCounter: safePagingCounter,
    hasPrevPage: challengesResult.hasPrevPage ?? safePage > 1,
    hasNextPage: challengesResult.hasNextPage ?? safePage < safeTotalPages,
    prevPage: challengesResult.prevPage ?? (safePage > 1 ? safePage - 1 : null),
    nextPage: challengesResult.nextPage ?? (safePage < safeTotalPages ? safePage + 1 : null),
  }
}

// --- Comment out or remove the old getAllChallenges function ---
/*
export const getAllChallenges = async (): Promise<PayloadChallenge[]> => {
  const payload = await getPayload({ config })
  const challenges = await payload.find({
    collection: 'challenges',
    pagination: false,
  })
  return challenges.docs
}
*/

// Define the input data structure for creating a challenge
// Based on src/collections/Challenges.ts, focusing on required fields for creation
interface CreateChallengeData {
  title: string
  slug: string
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible'
  description: {
    statement: string
    hints?: Array<{ content: string }> // Optional hints
    similarChallenges?: Array<{ challenge: number }> // Use number for ID reference
  }
  // Require at least one code version
  codeVersions: Array<{
    language: string
    initialCode: string
    testCases: Array<{
      input: string
      expectedOutput: string
    }>
  }>
  concepts?: Array<{ concept: string }> // Optional concepts

  // Use optional '?' instead of '| null'
  officialSolution?: {
    statement: string
    comments?: number[] | null
  }
  // Use optional '?' for code and its required fields
  code?: {
    language?: string
    initialCode?: string
    testCases?: Array<{ input: string; expectedOutput: string }>
  }
}

// Define a more specific error type if needed
class ChallengeCreationError extends Error {
  constructor(message: string) {
    super(`Challenge creation failed: ${message}`)
    this.name = 'ChallengeCreationError'
  }
}

/**
 * Creates a new challenge in the Payload CMS.
 * @param challengeData - The data for the new challenge.
 * @returns A Result object containing the created challenge or an error.
 */
export const createChallenge = async (
  challengeData: CreateChallengeData,
): Promise<Result<PayloadChallenge, ChallengeCreationError>> => {
  const payload = await getPayload({ config })

  try {
    // Payload handles field validation based on the collection config
    // The baseExperience hook will run automatically
    const newChallenge = await payload.create({
      collection: 'challenges',
      data: challengeData as any,
      // Optional: Add depth if you need populated relations immediately
      // depth: 1,
    })

    return { success: true, value: newChallenge as PayloadChallenge }
  } catch (error: any) {
    console.error('Error creating challenge:', error)
    // Check for specific Payload validation errors if possible, otherwise return a generic error
    const errorMessage = error?.message || 'An unknown error occurred during challenge creation.'
    return { success: false, error: new ChallengeCreationError(errorMessage) }
  }
}

/**
 * Fetches all challenge progressions for a specific user.
 * @param userId - The Supabase user ID.
 * @returns A promise that resolves to an array of UserChallengeProgression documents.
 */
export const getUserChallengeProgressions = async (
  userId: string,
): Promise<UserChallengeProgression[]> => {
  const payload = await getPayload({ config })
  try {
    const result = await payload.find({
      collection: 'userChallengeProgression',
      where: {
        userId: { equals: userId },
      },
      limit: 0, // Fetch all
      depth: 1, // Get challenge relation (optional, adjust if needed)
      pagination: false,
    })
    return result.docs as UserChallengeProgression[]
  } catch (error) {
    console.error('Error fetching user challenge progressions:', error)
    return [] // Return empty array on error
  }
}
