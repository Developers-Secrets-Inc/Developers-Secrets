'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { CoursePartUserProgression, UserChapterProgress } from '@/payload-types'

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
      isSolutionUnlocked: false,
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

// --- UserChapterProgress Functions ---

export const createUserChapterProgress = async (
  userId: string,
  chapterId: number,
): Promise<UserChapterProgress> => {
  const payload = await getPayload({ config })
  const result = await payload.create({
    collection: 'userChapterProgress',
    data: {
      userId,
      chapter: chapterId,
      completionStatus: 'not_started',
    },
  })
  return result
}

export const getUserChapterProgress = async (
  userId: string,
  chapterId: number,
): Promise<UserChapterProgress | null> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'userChapterProgress',
    where: { userId: { equals: userId }, chapter: { equals: chapterId } },
    limit: 1,
  })
  return result.docs[0] || null
}
