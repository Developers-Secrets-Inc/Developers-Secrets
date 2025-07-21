'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { CoursePartUserProgression } from '@/payload-types'

type ReactionStatus = 'liked' | 'disliked' | 'none'

export const getUserPartReaction = async (
  userId: string,
  partId: number,
): Promise<ReactionStatus> => {
  const payload = await getPayload({ config })
  try {
    const result = await payload.find({
      collection: 'coursePartUserProgression',
      where: {
        and: [{ userId: { equals: userId } }, { part: { equals: partId } }],
      },
      limit: 1,
      depth: 0,
    })
    if (result.docs.length > 0) {
      const status = result.docs[0].engagementStatus
      return status === 'liked' || status === 'disliked' || status === 'none' ? status : 'none'
    }
    return 'none'
  } catch (error) {
    console.error(`Error getting reaction status for user ${userId}, part ${partId}:`, error)
    return 'none'
  }
}

export const updateUserPartReaction = async (
  userId: string,
  partId: number,
  newStatus: ReactionStatus,
): Promise<{ success: boolean; newUserStatus?: ReactionStatus; error?: string }> => {
  const payload = await getPayload({ config })

  try {
    const existingResult = await payload.find({
      collection: 'coursePartUserProgression',
      where: {
        and: [{ userId: { equals: userId } }, { part: { equals: partId } }],
      },
      limit: 1,
      depth: 0,
    })

    let finalStatusApplied = newStatus

    if (existingResult.docs.length > 0) {
      const existingDoc = existingResult.docs[0]
      if (existingDoc.engagementStatus !== newStatus) {
        await payload.update({
          collection: 'coursePartUserProgression',
          id: existingDoc.id,
          data: {
            engagementStatus: newStatus,
          },
        })
        finalStatusApplied = newStatus
      } else {
        finalStatusApplied = existingDoc.engagementStatus
      }
    } else {
      await payload.create({
        collection: 'coursePartUserProgression',
        data: {
          userId: userId,
          part: partId,
          engagementStatus: newStatus,
          completionStatus: 'not_started',
        },
      })
      finalStatusApplied = newStatus
    }
    return { success: true, newUserStatus: finalStatusApplied }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : 'Unknown server error during reaction update'
    console.error(`Error updating reaction for user ${userId}, part ${partId}:`, errorMsg)
    return { success: false, error: errorMsg }
  }
}
