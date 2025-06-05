'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { CoursePartUserProgression, UserChapterProgress } from '@/payload-types'
import { getCourseParts, getCoursePartsIds } from '..'

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

export const getUserPartCompletionStatus = async (userId: string, partId: number) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'coursePartUserProgression',
    where: { userId: { equals: userId }, part: { equals: partId } },
    select: {
      completionStatus: true,
    },
  })
  return result.docs[0]
}



export const getUserCourseProgression = async (userId: string, courseId: number): Promise<number> => {
  const courseParts = await getCoursePartsIds(courseId)

  console.log(courseParts)

  const userPartProgress = await Promise.all(
    courseParts.map((partId) => getUserPartCompletionStatus(userId, partId)),
  )

  console.log(userPartProgress)

  const completedParts = userPartProgress.filter(
    (progress) => progress?.completionStatus === 'completed',
  )

  return Math.round((completedParts.length / courseParts.length) * 100)
}




export const hasUserStartedCourse = async (userId: string, courseId: number) => {
  const courseParts = await getCoursePartsIds(courseId)

  const userPartProgress = await Promise.all(
    courseParts.map((partId) => getUserPartCompletionStatus(userId, partId)),
  )

  return userPartProgress.some((progress) => progress?.completionStatus === 'completed' || progress?.completionStatus === 'in_progress')
}

