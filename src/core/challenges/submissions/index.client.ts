'use client'

import { submitCode as submitCodeAction } from './actions'

/**
 * Submits the user's code to the secure server-side execution environment.
 * This function no longer runs code or tests on the client. It delegates
 * all execution and validation to the `submitCode` server action.
 *
 * @param options - An object containing the raw data to be submitted.
 * @returns The authoritative result from the server, including compilation and test outcomes.
 */
export const submitCode = async (options: {
  userId: string
  challengeId: number
  code: string
  language: string
}) => {
  // Directly call the server action and return its promise.
  // The server will handle execution, validation, and recording the submission.
  return await submitCodeAction(options)
}
