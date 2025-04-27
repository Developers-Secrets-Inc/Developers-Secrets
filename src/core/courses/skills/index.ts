'use server'

import type { CoursePart } from '@/payload-types' // Import CoursePart type
import config from '@payload-config'
import { getPayload } from 'payload'
// Import the actual update functions from the skills progression module
import {
  updateUserConceptProgression,
  updateUserImplementationProgression,
} from '@/core/skills/progression'

/**
 * Records the completion of a course part by a user and updates the progression
 * of associated concepts based on the defined skill impacts.
 *
 * @param userId - The ID of the user (Supabase).
 * @param partId - The numeric ID of the completed course part.
 */
export const recordCoursePartCompletion = async (userId: string, partId: number): Promise<void> => {
  console.log(`Recording course part completion for user: ${userId}, part: ${partId}`)

  if (!userId || !partId) {
    console.error(
      'Invalid arguments provided to recordCoursePartCompletion: userId or partId missing.',
    )
    return
  }

  const payload = await getPayload({ config })

  try {
    // 1. Fetch the CoursePart with its skillImpacts populated
    // Depth 3 might be needed: part -> skillImpacts -> block -> relationship (implConcept/concept)
    const coursePart = await payload.findByID({
      collection: 'courseParts',
      id: partId,
      depth: 3, // Adjust depth as needed to ensure impacts and their relationships are populated
    })

    if (!coursePart) {
      console.error(`CoursePart with ID ${partId} not found.`)
      return
    }

    // 2. Check if skillImpacts exist and have blocks
    if (!coursePart.skillImpacts || coursePart.skillImpacts.length === 0) {
      console.log(`No skill impacts defined for CoursePart ${partId}. No progression applied.`)
      return
    }

    console.log(
      `Found ${coursePart.skillImpacts.length} impact blocks to process for part ${partId}.`,
    )

    // 3. Iterate over the impact blocks and apply updates
    for (const impactBlock of coursePart.skillImpacts) {
      if (impactBlock.blockType === 'skillConceptImpact') {
        // Ensure the relationship is populated correctly (object with id)
        const implementationConceptRelation = impactBlock.implementationConcept
        const implementationConceptId =
          typeof implementationConceptRelation === 'object' &&
          implementationConceptRelation !== null
            ? implementationConceptRelation.id
            : typeof implementationConceptRelation === 'number' // Handle if only ID is stored (less likely with depth 3)
              ? implementationConceptRelation
              : null

        const amount = impactBlock.progressAmount

        if (implementationConceptId && amount && amount > 0) {
          // The implementationConcept object itself contains the link to the skill
          // No need to pass skillSlug separately
          console.log(
            `  -> Applying skillConceptImpact: User ${userId}, ImplConcept ${implementationConceptId}, Amount ${amount}`,
          )
          // Call the imported function that handles implementation progression and propagation
          await updateUserImplementationProgression(userId, implementationConceptId, amount)
        } else {
          console.warn(`  -> Skipping skillConceptImpact block due to missing data:`, impactBlock)
        }
      } else if (impactBlock.blockType === 'baseConceptImpact') {
        // Ensure the relationship is populated correctly (object with id)
        const conceptRelation = impactBlock.concept
        const conceptId =
          typeof conceptRelation === 'object' && conceptRelation !== null
            ? conceptRelation.id
            : typeof conceptRelation === 'number' // Handle if only ID is stored
              ? conceptRelation
              : null

        const amount = impactBlock.progressAmount

        if (conceptId && amount && amount > 0) {
          console.log(
            `  -> Applying baseConceptImpact: User ${userId}, Concept ${conceptId}, Amount ${amount}`,
          )
          // Call the imported function for direct base concept progression
          await updateUserConceptProgression(userId, conceptId, amount)
        } else {
          console.warn(`  -> Skipping baseConceptImpact block due to missing data:`, impactBlock)
        }
      }
    }

    console.log(`Finished processing skill impacts for user ${userId}, part ${partId}.`)
  } catch (error) {
    console.error(
      `Error recording course part completion for user ${userId}, part ${partId}:`,
      error,
    )
    // Handle or rethrow the error as appropriate
  }
}
