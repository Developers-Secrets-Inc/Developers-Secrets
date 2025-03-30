import { NextResponse } from 'next/server'
import { submitCode } from '@/core/challenges/submissions'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, tests, challengeId, authorId } = body

    if (!code || !tests || !challengeId || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await submitCode(code, tests, challengeId, authorId)

    // Transformer le résultat en format TestResult[]
    let response: any = {
      type: 'accepted',
      testResults: []
    }

    if ('error' in result) {
      response = {
        type: 'runtimeError',
        error: result.error,
        lastExpectedOutput: result.lastExpectedOutput
      }
    } else if ('input' in result) {
      response = {
        type: 'wrongAnswer',
        testResults: [{
          passed: false,
          input: result.input,
          output: result.output,
          expectedOutput: result.expectedOutput
        }]
      }
    } else if ('lastExpectedOutput' in result) {
      response = {
        type: 'timeLimitExceeded',
        lastExpectedOutput: result.lastExpectedOutput
      }
    } else {
      response = {
        type: 'accepted',
        testResults: [{
          passed: true,
          input: tests[0].input,
          output: tests[0].expectedOutput,
          expectedOutput: tests[0].expectedOutput
        }]
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in submission:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 