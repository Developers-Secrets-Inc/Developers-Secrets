'use server'

import { getSkillConceptTreeData } from './tree' // Import the main function
import { getChallengesForConcept, SimpleChallenge } from '@/core/challenges' // Import new function and type
import { getSessionUser } from '@/core/user' // Import function to get user session
import { revalidatePath } from 'next/cache' // Optional: if needed later

// React Flow types might be useful here for return type annotation
import type { Node, Edge } from 'reactflow'

/**
 * Server Action to fetch the processed skill concept tree data for the logged-in user.
 * @param skillSlug - The slug of the skill to fetch the tree for.
 * @returns A promise resolving to an object containing nodes and edges, or an error object.
 */
export const fetchSkillTreeAction = async (
  skillSlug: string,
): Promise<{ nodes: Node[]; edges: Edge[]; error?: string | null }> => {
  // 1. Get user session
  const userResult = await getSessionUser()

  if (!userResult.success || !userResult.value) {
    console.error('fetchSkillTreeAction: User not authenticated.')
    // Decide return value: empty data or specific error
    return { nodes: [], edges: [], error: 'User not authenticated' }
  }

  const userId = userResult.value.id

  if (!userId) {
    console.error('fetchSkillTreeAction: User ID not found in session.')
    return { nodes: [], edges: [], error: 'User ID not found' }
  }

  // 2. Call the backend function
  try {
    const { nodes, edges } = await getSkillConceptTreeData(skillSlug, userId)
    // Optional: revalidatePath('/skills') or similar if data is highly dynamic
    return { nodes, edges, error: null }
  } catch (error) {
    console.error(`fetchSkillTreeAction: Error fetching tree data for ${skillSlug}:`, error)
    // Return generic error or more specific info if safe
    return { nodes: [], edges: [], error: 'Failed to fetch skill tree data' }
  }
}

/**
 * Server Action to fetch challenges related to a specific concept.
 * @param conceptId - The ID of the concept.
 * @returns A promise resolving to an object containing challenges or an error object.
 */
export const fetchChallengesForConceptAction = async (
  conceptId: number,
): Promise<{ challenges: SimpleChallenge[] | null; error?: string | null }> => {
  // Optional: Could re-verify user session here if strict access control is needed
  console.log(`Action: Fetching challenges for concept ID: ${conceptId}`)

  if (!conceptId || typeof conceptId !== 'number') {
    return { challenges: null, error: 'Invalid Concept ID provided' }
  }

  try {
    const challenges = await getChallengesForConcept(conceptId)
    console.log(`Action: Found ${challenges.length} challenges for concept ${conceptId}.`)
    return { challenges: challenges, error: null }
  } catch (error) {
    console.error(
      `fetchChallengesForConceptAction: Error fetching challenges for concept ${conceptId}:`,
      error,
    )
    return { challenges: null, error: 'Failed to fetch challenges for concept' }
  }
}
