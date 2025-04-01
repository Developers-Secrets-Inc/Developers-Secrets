'use server'

import { getPayload } from 'payload'
import config from '@payload-config'


export const getSubmissions = async (challengeId: number, userId: string) => {
  const payload = await getPayload({ config })
  const submissions = await payload.find({
    collection: 'challenge-submissions',
    where: { challenge: { equals: challengeId }, authorId: { equals: userId } },
  })

  return submissions.docs
}

export const getSubmission = async (submissionId: number) => {
  const payload = await getPayload({ config })
  const submission = await payload.findByID({
    collection: 'challenge-submissions',
    id: submissionId,
  })

  return submission
}
