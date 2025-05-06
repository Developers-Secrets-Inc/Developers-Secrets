'use server'

import { Challenge } from '@/payload-types'
import {
  getUserIsSolutionUnlocked,
  setUserCompletionStatus,
  getUserCompletionStatus,
} from './user-progression'
import { revalidatePath } from 'next/cache'
import { addExperience } from '../gamification/level'
import { handleChallengeCompletionForQuests } from '../gamification/quests/actions'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { recordChallengeCompletion } from '../skills/progression'

import { getPayload } from 'payload'
import config from '@payload-config'

import { getSessionUser } from '@/core/user'
import { isError, Result } from '@/core/user/result'
import { createChallenge, CreateChallengeData } from '@/core/challenges'

/**
 * Handles all the logic when a challenge is completed by a user.
 * This function is called when a user successfully submits a solution that passes all tests.
 * It's designed to be modular and will handle all completion-related actions.
 */
export const handleChallengeCompletion = async (
  challenge: Challenge,
  userId: string,
  skillSlug: string,
) => {
  try {
    // Check if the challenge is already completed
    const completionStatus = await getUserCompletionStatus(userId, challenge.id)
    const isSolutionUnlocked = await getUserIsSolutionUnlocked(userId, challenge.id)

    // Only give experience if the challenge hasn't been completed before
    if (completionStatus !== 'completed' && !isSolutionUnlocked) {
      await addExperience(userId, challenge.baseExperience ?? 50)
    }

    await setUserCompletionStatus(userId, challenge.id, 'completed')

    // Update quest progression for challenge completion quests
    await handleChallengeCompletionForQuests(userId)

    await trackAchievementProgress(userId, 'challenges_completed', 1)

    await recordChallengeCompletion(userId, challenge.id, skillSlug)

    revalidatePath(`/challenges/${challenge.slug}`)

    // TODO: Future implementations
    // - Track statistics
    // - Unlock achievements
    // etc.
  } catch (error) {
    console.error('Error handling challenge completion:', error)
    throw error
  }
}

export const importChallengesAction = async (
  jsonContent: string,
): Promise<Result<{ count: number }, Error>> => {
  // 1. Check Authorization
  const sessionUserResult = await getSessionUser()
  if (isError(sessionUserResult) || sessionUserResult.value.informations.role !== 'admin') {
    return { success: false, error: new Error('Unauthorized: Admin role required.') }
  }

  // 2. Parse JSON
  let challengesToCreate: CreateChallengeData[]
  let parsedData: unknown
  try {
    parsedData = JSON.parse(jsonContent)
    if (!Array.isArray(parsedData)) {
      // If it's not an array, maybe it's a single object? Wrap it.
      if (typeof parsedData === 'object' && parsedData !== null) {
        challengesToCreate = [parsedData as CreateChallengeData] // Treat single object as array of one
      } else {
        throw new Error('Invalid format: Input must be a JSON array or a single JSON object.')
      }
    } else {
      // Trusting the structure matches CreateChallengeData
      challengesToCreate = parsedData as CreateChallengeData[]
    }
  } catch (error: any) {
    return { success: false, error: new Error(`JSON Parsing Error: ${error.message}`) }
  }

  // 3. Create Challenges
  let importedCount = 0
  const creationErrors: string[] = []
  const payload = await getPayload({ config })

  for (const challengeData of challengesToCreate) {
    try {
      // --- NEW: Replace escaped newlines before creation ---
      if (
        challengeData.description?.statement &&
        typeof challengeData.description.statement === 'string'
      ) {
        challengeData.description.statement = challengeData.description.statement.replace(
          /\\n/g,
          '\n',
        )
      }
      if (
        challengeData.officialSolution?.statement &&
        typeof challengeData.officialSolution.statement === 'string'
      ) {
        challengeData.officialSolution.statement = challengeData.officialSolution.statement.replace(
          /\\n/g,
          '\n',
        )
      }
      // --- End of New Code ---

      // Directly pass the *modified* data, relying on createChallenge/Payload for validation
      // We still need the 'as any' due to the persistent type issues elsewhere
      const createResult = await createChallenge(challengeData as any) // Pass modified data

      if (isError(createResult)) {
        const title = (challengeData as any)?.title || 'Untitled Challenge (Error)'
        console.error(`Failed to create challenge "${title}": ${createResult.error.message}`)
        creationErrors.push(`"${title}": ${createResult.error.message}`)
      } else {
        importedCount++
      }
    } catch (error: any) {
      const title = (challengeData as any)?.title || 'Untitled Challenge (Unexpected Error)'
      console.error(`Unexpected error creating challenge "${title}": ${error.message}`)
      creationErrors.push(`"${title}": Unexpected error - ${error.message}`)
    }
  }

  // 4. Return Result
  if (creationErrors.length > 0) {
    // Partial success or total failure, return specific errors
    const errorMessage = `Import finished with ${creationErrors.length} errors out of ${challengesToCreate.length} challenges. Successfully imported: ${importedCount}. Errors: ${creationErrors.join('; ')}`
    return { success: false, error: new Error(errorMessage) }
  }

  if (importedCount === 0 && challengesToCreate.length > 0) {
    // Handle case where loop finished but nothing was imported (all failed?)
    return {
      success: false,
      error: new Error('No challenges were successfully imported, check logs for creation errors.'),
    }
  }

  // Check if no challenges were provided in the input array
  if (challengesToCreate.length === 0) {
    return { success: true, value: { count: 0 } } // Successful import of nothing
  }

  return { success: true, value: { count: importedCount } }
}
