'use server'

import { CompilationResult } from '@/core/compiler'
import { submitCode } from '.'

export async function handleSubmission(
  code: {
    content: string
    language: string
  },
  tests: {
    input: string
    expectedOutput: string
  }[],
  challengeId: number,
  authorId: string,
) {
  return submitCode(code, tests, challengeId, authorId)
}
