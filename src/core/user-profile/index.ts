'use server'

import { getGamificationInformations, getUserNextLevelExperience } from '@/core/gamification/level'
import {
  getCalendarDays,
} from '@/core/challenges/user-progression'
import { getTotalCompletedChallengesCount } from '../challenges/user-progression/completion-status'

export async function getUserProfileData(userId: string) {
  const [userGamificationsInformation, calendarDays, nextLevelExperience, totalCompletedCount] =
    await Promise.all([
      getGamificationInformations(userId),
      getCalendarDays(userId),
      getUserNextLevelExperience(userId),
      getTotalCompletedChallengesCount(userId),
    ])
  return {
    userGamificationsInformation,
    calendarDays,
    nextLevelExperience,
    totalCompletedCount,
  }
}
