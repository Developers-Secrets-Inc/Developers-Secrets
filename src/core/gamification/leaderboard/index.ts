'use server'

import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import { ExperienceLog } from '@/payload-types'

/**
 * Calculates the total experience points gained by a user within a specific date range.
 *
 * @param userId - The ID of the user.
 * @param startDate - The start date (inclusive) of the period.
 * @param endDate - The end date (exclusive) of the period.
 * @returns The total experience gained during the period.
 */
export const getWeeklyUserExperience = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  const payload = await getPayload({ config })

  // Construct the query for experience logs
  const query: Where = {
    and: [
      {
        userId: {
          equals: userId,
        },
      },
      {
        timestamp: {
          greater_than_equal: startDate.toISOString(),
        },
      },
      {
        timestamp: {
          less_than: endDate.toISOString(),
        },
      },
    ],
  }

  try {
    const result = await payload.find({
      collection: 'experience-logs',
      where: query,
      limit: 0, // We need potentially many logs, let pagination handle if needed, but sum requires all
      pagination: false, // Ensure we get all matching logs for summation
    })

    // Sum the amounts
    const totalExperience = result.docs.reduce(
      (sum: number, log: ExperienceLog) => sum + (log.amount || 0),
      0,
    )

    return totalExperience
  } catch (error) {
    console.error(
      `Error fetching weekly experience for user ${userId} between ${startDate} and ${endDate}:`,
      error,
    )
    return 0 // Return 0 in case of error
  }
}
