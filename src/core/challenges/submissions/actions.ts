'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { executeCodeInE2B, E2BTestResult, CompilationResult } from '@/core/compiler/e2b-service'
import { getChallengeById } from '@/core/challenges/challenge-queries'
import { Challenge } from '@/payload-types'
import { ChallengeNotFoundError } from '../errors'

async function _createSubmissionRecord(options: {
  challenge: Challenge
  authorId: string
  code: { language: string; content: string }
  compilationResult: CompilationResult
  testResults: E2BTestResult[]
}) {
  const payload = await getPayload({ config })
  const { challenge, authorId, code, compilationResult, testResults } = options

  const testsPassed = testResults.filter((r) => r.success).length
  const testsTotal = testResults.length

  let submissionType: 'accepted' | 'wrongAnswer' | 'runtimeError' = 'accepted'
  if (compilationResult.error) {
    submissionType = 'runtimeError'
  } else if (testsPassed < testsTotal) {
    submissionType = 'wrongAnswer'
  }

  const failedTest = testResults.find((r) => !r.success)

  const submissionData = {
    challenge: challenge.id,
    authorId,
    testsPassed,
    testsTotal,
    code,
    submissionType,
    error: compilationResult.error || undefined,
    input: submissionType === 'wrongAnswer' ? failedTest?.input : undefined,
    output: submissionType === 'wrongAnswer' ? failedTest?.actualOutput : undefined,
    expectedOutput: submissionType === 'wrongAnswer' ? failedTest?.expectedOutput : undefined,
  }

  try {
    await payload.create({
      collection: 'challenge-submissions',
      data: submissionData,
    })
  } catch (error) {
    console.error('Failed to create submission record:', error)
  }
}


export async function submitCode(options: {
  userId: string
  challengeId: number
  code: string
  language: string
}): Promise<{ compilationResult: CompilationResult; testResults: E2BTestResult[] }> {
  const { userId, challengeId, code, language } = options

  let challenge: Challenge
  try {
    challenge = await getChallengeById(challengeId)
  } catch (error) {
    if (error instanceof ChallengeNotFoundError) {
      return {
        compilationResult: { success: false, output: '', error: 'Challenge not found.' },
        testResults: [],
      }
    }
    console.error(`Failed to retrieve challenge ${challengeId}:`, error)
    return {
      compilationResult: {
        success: false,
        output: '',
        error: 'An error occurred while fetching the challenge.',
      },
      testResults: [],
    }
  }

  const codeVersion = challenge.codeVersions?.find((v) => v.language === language)
  if (!codeVersion) {
    return {
      compilationResult: {
        success: false,
        output: '',
        error: `Language version for "${language}" not found for this challenge.`,
      },
      testResults: [],
    }
  }

  const testCases =
    codeVersion.testCases?.map((t) => ({ input: t.input, expectedOutput: t.expectedOutput })) || []

  console.log('testCases', codeVersion.testCases)

  const { compilationResult, testResults } = await executeCodeInE2B(code, language, testCases)

  await _createSubmissionRecord({
    challenge,
    authorId: userId,
    code: { language, content: code },
    compilationResult,
    testResults,
  })

  return { compilationResult, testResults }
}
