'use server'

import 'server-only'

import { mutation } from '@/core/functions'
import z from 'zod'

type Message = {
    content: string 
    metadata?: any
}

import {
    AcceptedSubmission,
    RunTimeErrorSubmission,
    WrongAnswerSubmission,
    TimeLimitExceededSubmission
} from '@/core/compiler/submissions' 

export const handleSubmission = mutation({
    name: 'handle-submission',
    args: z.object({
        submission: z.custom({ type: 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded', testsPassed: z.number(), testsTotal: z.number(), code: z.object({ language: z.string(), content: z.string() }) })
    }),
    handler: async (_, args): Promise<{success: boolean, message: Message}> => {
        
    }
})