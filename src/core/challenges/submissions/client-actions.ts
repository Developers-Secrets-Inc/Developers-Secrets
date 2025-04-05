'use client'

import {
  AcceptedSubmission,
  RunTimeErrorSubmission,
  TimeLimitExceededSubmission,
  WrongAnswerSubmission,
} from './index.client'
import { handleSubmission as serverHandleSubmission } from './actions'

export async function handleSubmission(
  submission:
    | AcceptedSubmission
    | RunTimeErrorSubmission
    | WrongAnswerSubmission
    | TimeLimitExceededSubmission,
  challengeId: number,
  authorId: string,
) {
  try {
    return await serverHandleSubmission(submission, challengeId, authorId)
  } catch (error) {
    console.error('Error in client handleSubmission:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit',
    }
  }
}
