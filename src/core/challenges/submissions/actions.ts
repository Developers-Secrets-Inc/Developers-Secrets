'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import {
  RunTimeErrorSubmission,
  TimeLimitExceededSubmission,
  WrongAnswerSubmission,
  AcceptedSubmission,
} from './index.client'

export async function handleSubmission(
  submission:
    | AcceptedSubmission
    | RunTimeErrorSubmission
    | WrongAnswerSubmission
    | TimeLimitExceededSubmission,
  challengeId: number,
  authorId: string,
) {
  const payload = await getPayload({ config })

  const submissionData: {
    challenge: number
    authorId: string
    testsPassed: number
    testsTotal: number
    code: { language: string; content: string }
    submissionType: 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'
    error?: string
    lastExpectedOutput?: { output: string }[]
    input?: string
    output?: string
    expectedOutput?: string
  } = {
    challenge: challengeId,
    authorId,
    testsPassed: submission.testsPassed,
    testsTotal: submission.testsTotal,
    code: submission.code,
    submissionType: submission.type,
  }

  // Handle specific fields based on submission type
  if (submission.type === 'runtimeError') {
    submissionData.error = submission.error
    submissionData.lastExpectedOutput = submission.lastExpectedOutput
  } else if (submission.type === 'wrongAnswer') {
    submissionData.input = submission.input
    submissionData.output = submission.output
    submissionData.expectedOutput = submission.expectedOutput
  } else if (submission.type === 'timeLimitExceeded') {
    submissionData.lastExpectedOutput = submission.lastExpectedOutput
  }

  try {
    // Create the submission in the database
    const result = await payload.create({
      collection: 'challenge-submissions',
      data: submissionData,
    })

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error saving submission:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save submission',
    }
  }
}
