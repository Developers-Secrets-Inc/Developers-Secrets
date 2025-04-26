'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getUserPartProgress, createCoursePartUserProgression } from '.'
import { CoursePartUserProgression } from '@/payload-types'

type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

export const getUserPartCompletionStatus = async (userId: string, partId: number) => {
  const userPartProgress = await getUserPartProgress(userId, partId)
  return userPartProgress.completionStatus
}

export const updateUserPartCompletionStatus = async (
  userId: string,
  partId: number,
  newStatus: CompletionStatus,
): Promise<CoursePartUserProgression> => {
  const payload = await getPayload({ config })

  if (!(await getUserPartProgress(userId, partId))) {
    await createCoursePartUserProgression(userId, partId)
  }

  const result = await payload.update({
    collection: 'coursePartUserProgression',
    where: { userId: { equals: userId }, part: { equals: partId } },
    data: { completionStatus: newStatus },
  })

  return result.docs[0]
}


