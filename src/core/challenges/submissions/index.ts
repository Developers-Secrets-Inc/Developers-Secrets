'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { AcceptedSubmission, WrongAnswerSubmission, TimeLimitExceededSubmission, RunTimeErrorSubmission } from './index.client'


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



// ========== CREATE METHODS ==========

type BaseSubmissionInformations = {
  challengeId: number 
  authorId: string 
  testsPassed: number 
  testsTotal: number 
  code: { language: string, content: string }
}

type AcceptedSubmissionInformations = BaseSubmissionInformations & {
  type: 'accepted'
}

type WrongAnswerSubmissionInformations = BaseSubmissionInformations & {
  type: 'wrongAnswer'
  input: string
  output: string
  expectedOutput: string
}

type TimeLimitExceededSubmissionInformations = BaseSubmissionInformations & {
  type: 'timeLimitExceeded'
  lastExpectedOutput: { output: string }[]
}

type RunTimeErrorSubmissionInformations = BaseSubmissionInformations & {
  type: 'runtimeError'
  error: string
  lastExpectedOutput: { output: string }[]
}

export const createAcceptedSubmission = async (submissionInformations: AcceptedSubmissionInformations): Promise<AcceptedSubmission> => {}
export const createWrongAnswerSubmission = async (submissionsInformations: WrongAnswerSubmissionInformations): Promise<WrongAnswerSubmission> => {}
export const createTimeLimitExceededSubmission = async (submissionsInformations: TimeLimitExceededSubmissionInformations): Promise<TimeLimitExceededSubmission> => {}
export const createRuntimeErrorSubmission = async (submissionsInformations: RunTimeErrorSubmissionInformations): Promise<RunTimeErrorSubmission> => {}