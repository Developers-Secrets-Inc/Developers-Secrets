'use server'

import { submitCode } from './index.client'

type Language = 'python' | 'javascript' | 'typescript'

type CodeSubmission = {
  content: string
  language: Language
}

type Test = {
  input: CodeSubmission
  expectedOutput: CodeSubmission
}


export async function handleSubmission(
  code: CodeSubmission,
  tests: Test[],
  challengeId: string | number,
  authorId: string,
) {
  const submission = await submitCode(code, tests)
  return submission
}




