'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { CoursePartUserProgression } from '@/payload-types'

export const createCoursePartUserProgression = async (
  userId: string,
  partId: number,
): Promise<CoursePartUserProgression> => {
  const payload = await getPayload({ config })
  const result = await payload.create({
    collection: 'coursePartUserProgression',
    data: {
      userId,
      part: partId,
      engagementStatus: 'none',
      completionStatus: 'not_started',
    },
  })
  return result
}

export const getUserPartProgress = async (userId: string, partId: number) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'coursePartUserProgression',
    where: { userId: { equals: userId }, part: { equals: partId } },
  })
  return result.docs[0]
}

