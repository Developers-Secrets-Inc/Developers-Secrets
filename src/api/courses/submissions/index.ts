'use server'

import { mutation, query } from '@/core/functions'
import { Maybe } from '@/lib/maybe'
import { CoursePartSubmission } from '@/payload-types'
import 'server-only'
import z from 'zod'


export const getSubmission = query({
    name: 'submission',
    args: z.object({ id: z.number() }),
    handler: async (ctx, args): Promise<Maybe<CoursePartSubmission>> => {

    }
})


export const getSubmissions = query({
    name: 'submissions',
    handler: async (ctx, args): Promise<Maybe<CoursePartSubmission[]>> => {

    }
})


export const createSubmission = mutation({
    name: 'submissions',
    args: z.object({})
    handler: async (ctx, args) => {

    }
})