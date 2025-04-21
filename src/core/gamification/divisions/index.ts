'use server'

import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Division, UserInformation, WeeklyLeaderboardMember } from '@/payload-types'
import { getWeeklyUserExperience } from '../leaderboard' // Use the function from leaderboard index
import { getUserInformation } from '../../user' // Assuming a way to get user info by ID
import { Where } from 'payload/types'

/**
 * Finds the ID of the next higher or lower division based on rankOrder.
 *
 * @param currentDivisionId - The ID of the user's current division.
 * @param direction - Whether to find the division to 'promote' to or 'demote' to.
 * @returns The ID of the target division, or null if no higher/lower division exists.
 */
export const findTargetDivision = async (
  currentDivisionId: number,
  direction: 'promote' | 'demote',
): Promise<number | null> => {
  const payload = await getPayload({ config })

  try {
    // 1. Fetch all divisions and sort them by rankOrder
    const allDivisions = await payload.find({
      collection: 'divisions',
      sort: 'rankOrder', // Sort by the new field
      limit: 0,
      pagination: false,
    })

    if (!allDivisions.docs || allDivisions.docs.length === 0) {
      console.error('No divisions found in the system.')
      return null
    }

    // 2. Find the index of the current division
    const currentIndex = allDivisions.docs.findIndex(
      (division) => division.id === currentDivisionId,
    )

    if (currentIndex === -1) {
      console.error(`Current division with ID ${currentDivisionId} not found.`)
      return null
    }

    // 3. Determine the target index based on direction
    let targetIndex = -1
    if (direction === 'promote') {
      targetIndex = currentIndex + 1
    } else {
      // demote
      targetIndex = currentIndex - 1
    }

    // 4. Check bounds and return the target division ID or null
    if (targetIndex >= 0 && targetIndex < allDivisions.docs.length) {
      return allDivisions.docs[targetIndex].id
    } else {
      // Already at the highest or lowest division
      return null
    }
  } catch (error) {
    console.error('Error finding target division:', error)
    return null
  }
}

/**
 * Represents a ranked user entry in the division leaderboard.
 */
export type RankedLeaderboardUser = {
  rank: number
  userId: string
  name: string // From UserInformation
  avatar?: string // From UserInformation
  initials?: string // From UserInformation
  weeklyExperience: number
}

/**
 * Fetches the current user's division leaderboard group and ranks members based on live weekly XP.
 *
 * @param userId - The ID of the user whose leaderboard to fetch.
 * @returns An array of ranked users or null if the user isn't on a leaderboard.
 */
export const getUserDivisionLeaderboard = async (
  userId: string,
): Promise<RankedLeaderboardUser[] | null> => {
  const payload = await getPayload({ config })
  const now = new Date()

  try {
    // 1. Find the user's current leaderboard membership for this week
    // Determine current week start/end (similar logic to create job)
    const dayOfWeek = now.getUTCDay()
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const currentWeekStartDate = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + diffToMonday,
      0,
      0,
      0,
      0,
    )

    const currentMembership = await payload.find({
      collection: 'weekly-leaderboard-members',
      where: {
        userId: { equals: userId },
        // Ensure we get the leaderboard for the *current* week
        'leaderboard.startDate': { equals: currentWeekStartDate.toISOString() },
      },
      limit: 1,
      depth: 1, // Need leaderboard info
    })

    if (!currentMembership.docs || currentMembership.docs.length === 0) {
      console.log(
        `User ${userId} not found in any leaderboard for the current week starting ${currentWeekStartDate.toISOString()}`,
      )
      return null // User might not be in a division or the job hasn't run yet
    }

    const memberRecord = currentMembership.docs[0]
    const leaderboardId =
      typeof memberRecord.leaderboard === 'object'
        ? memberRecord.leaderboard.id
        : memberRecord.leaderboard

    if (!leaderboardId) {
      console.error(`Leaderboard ID missing for member record ${memberRecord.id}`)
      return null
    }

    // 2. Fetch all members of that specific leaderboard
    const allMembers = await payload.find({
      collection: 'weekly-leaderboard-members',
      where: {
        leaderboard: { equals: leaderboardId },
      },
      limit: 0, // Get all members
      pagination: false,
      depth: 0, // Don't need nested leaderboard info again
    })

    // 3. Fetch live weekly XP and basic user info for each member
    const memberDataPromises = allMembers.docs.map(async (member: WeeklyLeaderboardMember) => {
      const [weeklyXp, userInfo] = await Promise.all([
        getWeeklyUserExperience(member.userId, currentWeekStartDate, now), // Use current date as end for live data
        getUserInformation(member.userId).catch(() => null), // Fetch user info, handle potential errors
      ])
      return {
        userId: member.userId,
        weeklyExperience: weeklyXp,
        name: userInfo?.name || 'Unknown User',
        avatar: userInfo?.avatar || undefined,
        initials: userInfo?.initials || '??',
      }
    })

    const memberData = await Promise.all(memberDataPromises)

    // 4. Sort members by live weekly XP
    memberData.sort((a, b) => b.weeklyExperience - a.weeklyExperience)

    // 5. Assign ranks
    const rankedUsers: RankedLeaderboardUser[] = memberData.map((member, index) => ({
      rank: index + 1,
      ...member,
    }))

    return rankedUsers
  } catch (error) {
    console.error(`Error fetching leaderboard data for user ${userId}:`, error)
    return null
  }
}
