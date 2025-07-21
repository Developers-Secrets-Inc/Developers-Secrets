import type { TaskHandler } from 'payload'
import type { Division } from '../payload-types'
import { getWeeklyUserExperience } from '../core/gamification/leaderboard'
import { findTargetDivision } from '../core/gamification/divisions'
import { addCurrency } from '../core/gamification/marketplace/currency'

// Handler logic moved from payload.config.ts
export const processWeeklyResultsHandler: TaskHandler<'processWeeklyLeaderboardResults'> = async ({
  req,
}) => {
  const payload = req.payload
  console.log('Starting processWeeklyLeaderboardResults task...')

  try {
    // 1. Identify the week that just ended
    const now = new Date()
    // Calculate the start date of the *previous* week (assuming this runs right after the week ends)
    const dayOfWeek = now.getUTCDay() // 0 = Sunday, 1 = Monday, ...
    const diffToLastMonday = dayOfWeek === 0 ? -13 : -6 - dayOfWeek // Days to subtract to get to the Monday *before* the one that just started
    const lastWeekStartDate = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + diffToLastMonday,
      0,
      0,
      0,
      0,
    )
    const lastWeekEndDate = new Date(lastWeekStartDate)
    lastWeekEndDate.setDate(lastWeekStartDate.getDate() + 7)

    // Get the corresponding week identifier
    const year = lastWeekStartDate.getUTCFullYear()
    const weekNum = Math.ceil(
      ((lastWeekStartDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7,
    )
    const weekIdentifier = `${year}-W${weekNum.toString().padStart(2, '0')}`

    console.log(
      `Processing results for week: ${weekIdentifier}, Start: ${lastWeekStartDate.toISOString()}, End: ${lastWeekEndDate.toISOString()}`,
    )

    // 2. Find all unprocessed leaderboards for that week
    const leaderboardsToProcess = await payload.find({
      collection: 'weekly-division-leaderboards',
      where: {
        weekIdentifier: { equals: weekIdentifier },
        isProcessed: { equals: false }, // Only get unprocessed ones
      },
      limit: 0, // Process all leaderboards for the week
      pagination: false,
      depth: 1, // Need division details (thresholds, rewards)
    })

    console.log(
      `Found ${leaderboardsToProcess.docs.length} leaderboards to process for week ${weekIdentifier}.`,
    )

    // 3. Process each leaderboard
    for (const leaderboard of leaderboardsToProcess.docs) {
      console.log(
        `Processing leaderboard ID: ${leaderboard.id} for division ID: ${typeof leaderboard.division === 'object' ? leaderboard.division.id : leaderboard.division}`,
      )
      const divisionDetails = leaderboard.division as Division // Type assertion

      if (!divisionDetails || typeof leaderboard.division !== 'object') {
        console.error(
          `  Skipping leaderboard ${leaderboard.id}: Division details not populated or invalid.`,
        )
        continue
      }
      const currentDivisionId = divisionDetails.id

      // 4. Fetch members of this leaderboard
      const members = await payload.find({
        collection: 'weekly-leaderboard-members',
        where: {
          leaderboard: { equals: leaderboard.id },
        },
        limit: 0, // Get all members
        pagination: false,
      })

      // 5. Calculate weekly XP for each member
      const memberScores = await Promise.all(
        members.docs.map(async (member) => {
          const weeklyXp = await getWeeklyUserExperience(
            member.userId,
            lastWeekStartDate,
            lastWeekEndDate,
          )
          return { ...member, calculatedXp: weeklyXp }
        }),
      )

      // 6. Sort members by score (descending) and assign rank
      memberScores.sort((a, b) => b.calculatedXp - a.calculatedXp)

      const rankedMembers = memberScores.map((member, index) => ({
        ...member,
        calculatedRank: index + 1,
      }))

      // 7. Update member records (XP & Rank) and apply promotion/demotion
      const memberUpdatePromises = rankedMembers.map(async (member) => {
        try {
          // Update member's weekly XP and final rank
          await payload.update({
            collection: 'weekly-leaderboard-members',
            id: member.id,
            data: {
              weeklyExperience: member.calculatedXp,
              finalRank: member.calculatedRank,
            },
          })

          // --- Promotion/Demotion Logic --- START
          const totalMembers = members.docs.length
          const rankPercentile = (member.calculatedRank / totalMembers) * 100
          let targetDivisionId: number | null = null

          // Check for Promotion
          if (rankPercentile <= divisionDetails.promotionThreshold) {
            console.log(
              `  User ${member.userId} ranked ${member.calculatedRank}/${totalMembers} (${rankPercentile.toFixed(1)}%), checking for promotion from division ${currentDivisionId}.`,
            )
            targetDivisionId = await findTargetDivision(currentDivisionId, 'promote')
            if (targetDivisionId) {
              console.log(`    Promoting user ${member.userId} to division ${targetDivisionId}.`)
            }
          }
          // Check for Demotion (only if not promoted)
          else if (rankPercentile >= 100 - divisionDetails.demotionThreshold) {
            console.log(
              `  User ${member.userId} ranked ${member.calculatedRank}/${totalMembers} (${rankPercentile.toFixed(1)}%), checking for demotion from division ${currentDivisionId}.`,
            )
            targetDivisionId = await findTargetDivision(currentDivisionId, 'demote')
            if (targetDivisionId) {
              console.log(`    Demoting user ${member.userId} to division ${targetDivisionId}.`)
            }
          }

          // Update UserGamification if division changed
          if (targetDivisionId !== null && targetDivisionId !== currentDivisionId) {
            await payload.update({
              collection: 'user-gamification',
              where: {
                userId: { equals: member.userId },
              },
              data: {
                division: targetDivisionId,
              },
            })
          }
          // --- Promotion/Demotion Logic --- END

          // --- Reward Logic --- START
          const finalRank = member.calculatedRank
          // Ensure divisionDetails.rewards exists and is an array before iterating
          if (divisionDetails.rewards && Array.isArray(divisionDetails.rewards)) {
            for (const rewardTier of divisionDetails.rewards) {
              // Check if the rank falls within the tier's range
              if (finalRank >= rewardTier.rankStart && finalRank <= rewardTier.rankEnd) {
                if (rewardTier.coinAmount && rewardTier.coinAmount > 0) {
                  console.log(
                    `    Awarding ${rewardTier.coinAmount} coins to user ${member.userId} for rank ${finalRank}.`,
                  )
                  try {
                    await addCurrency(
                      member.userId,
                      rewardTier.coinAmount,
                      `Weekly Division Reward (Rank ${finalRank})`,
                    )
                  } catch (currencyError) {
                    console.error(
                      `      Failed to add currency reward for user ${member.userId}:`,
                      currencyError,
                    )
                  }
                }
                // Add logic for item rewards here if needed in the future
                break // Stop checking tiers once a matching one is found
              }
            }
          }
          // --- Reward Logic --- END
        } catch (updateError) {
          console.error(
            `  Error processing member ${member.userId} for leaderboard ${leaderboard.id}:`,
            updateError,
          )
        }
      })

      await Promise.all(memberUpdatePromises)

      // 8. Mark leaderboard as processed
      try {
        await payload.update({
          collection: 'weekly-division-leaderboards',
          id: leaderboard.id,
          data: {
            isProcessed: true,
          },
        })
        console.log(`  Successfully processed leaderboard ID: ${leaderboard.id}`)
      } catch (processError) {
        console.error(`  Error marking leaderboard ${leaderboard.id} as processed:`, processError)
      }
    }

    console.log('Finished processWeeklyLeaderboardResults task.')
  } catch (error) {
    console.error('Error running processWeeklyLeaderboardResults task:', error)
    throw error // Re-throwing marks job as failed
  }
}
