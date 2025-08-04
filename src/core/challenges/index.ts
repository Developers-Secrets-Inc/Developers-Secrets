'use server'

import { getUserIsSolutionUnlocked } from '@/core/challenges/user-progression'
import { DEFAULT_LEVEL_UP_FORMULA, getGamificationInformations } from '@/core/gamification/level'
import config from '@payload-config'
import { getPayload } from 'payload'
import 'server-only'

import { Result } from '@/core/user/result'
import type {
  Challenge as PayloadChallenge,
  UserChallengeProgression
} from '@/payload-types'
import { getChallengeBySlug } from './challenge-queries'
import { ChallengeNotFoundError } from './errors'
import { getChallengeById } from './challenge-queries'
import { getNextChallenge } from './navigation'


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




// ===============================

export const getNextChallengeUrl = async (currentSlug: string): Promise<string> => {
  const nextChallenge = await getNextChallenge(currentSlug)
  return `/challenges/${nextChallenge.slug}`
}

export const getChallengeExperience = async (challengeId: number): Promise<number> => {
  const challenge = await getChallengeById(challengeId)
  return challenge.baseExperience || 50 // Default to 50 if not set
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
  isPro: boolean
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

  const challengeWhereClause = {}
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
