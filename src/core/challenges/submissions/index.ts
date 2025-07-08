'use server'

import { ChallengeSubmission } from '@/payload-types'
import config from '@payload-config'
import { getPayload, PaginatedDocs } from 'payload'

export const getSubmissions = async (
  challengeId: number,
  userId: string,
  page: number = 1,
  perPage: number = 8,
): Promise<PaginatedDocs<ChallengeSubmission>> => {
  const payload = await getPayload({ config })
  const submissions = await payload.find({
    collection: 'challenge-submissions',
    where: { challenge: { equals: challengeId }, authorId: { equals: userId } },
    page,
    limit: perPage,
    sort: '-createdAt', // Assuming you want to sort by creation date
  })

  return submissions
}

export const getSubmission = async (submissionId: number) => {
  const payload = await getPayload({ config })
  const submission = await payload.findByID({
    collection: 'challenge-submissions',
    id: submissionId,
  })

  return submission
}
