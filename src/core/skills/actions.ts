'use server'

import { getSkillConceptTreeData } from './tree' // Import the main function
import { getChallengesForConcept, SimpleChallenge } from '@/core/challenges' // Import new function and type
import { getSessionUser } from '@/core/user' // Import function to get user session
import { revalidatePath } from 'next/cache' // Optional: if needed later
import { getPayload } from 'payload'
import config from '@payload-config'

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

/**
 * Server action to fetch all concepts linked to a given skill (by slug).
 * For onboarding: fetch all concepts implemented in Python.
 * Returns: Array<{ id: number, name: string, slug: string }>
 */
export const getConceptsForSkill = async (skillSlug: string) => {
  const payload = await getPayload({ config })

  // 1. Find the skill by slug
  const skillResult = await payload.find({
    collection: 'skills',
    where: { slug: { equals: skillSlug } },
    limit: 1,
    depth: 0,
  })
  if (!skillResult.docs.length) return []
  const skillId = skillResult.docs[0].id

  // 2. Find all ImplementationConcepts for this skill
  const implConceptsResult = await payload.find({
    collection: 'implementationConcepts',
    where: { implementationSkill: { equals: skillId } },
    limit: 0,
    depth: 1, // Need concept populated
    pagination: false,
  })
  const conceptIds = new Set<number>()
  for (const implConcept of implConceptsResult.docs) {
    const concept = implConcept.concept
    if (typeof concept === 'object' && concept.id) {
      conceptIds.add(concept.id)
    } else if (typeof concept === 'number') {
      conceptIds.add(concept)
    }
  }
  if (!conceptIds.size) return []

  // 3. Fetch all concepts by IDs
  const conceptsResult = await payload.find({
    collection: 'concepts',
    where: { id: { in: Array.from(conceptIds) } },
    limit: conceptIds.size,
    depth: 0,
    pagination: false,
  })
  return conceptsResult.docs.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
}
