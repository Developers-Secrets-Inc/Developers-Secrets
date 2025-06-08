'use server'

import { Challenge } from '@/payload-types'
import {
  getUserIsSolutionUnlocked,
  setUserCompletionStatus,
  getUserCompletionStatus,
} from './user-progression'
import { revalidatePath } from 'next/cache'
import { addExperience, DEFAULT_LEVEL_UP_FORMULA, getGamificationInformations } from '../gamification/level'
import { handleChallengeCompletionForQuests } from '../gamification/quests/actions'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { recordChallengeCompletion } from '../skills/progression'
import { getChallengeById } from './challenge-queries'
import { getNextChallenge } from './navigation'


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
    getChallengeById(challengeId),
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