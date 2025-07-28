'use server'

import 'server-only'

import { query } from '@/core/functions'
import z from 'zod'
import { CourseOutline } from './types'


export const getCourseOutline = query({
    name: 'course-outline',
    args: z.object({ course_slug: z.string() }),
    handler: async (ctx, args): Promise<CourseOutline> => {
        // 1. Get course name and chapters list 
        // 2. For each chapter, get name and parts 
        // 3. For each part, get name, slug and completion status
        return {courseName: "Python", chapters: []}
    },
    // revalidate: 1
})

export const getChapterOutline = query({
    name: "chapter-outline",
    args: z.object({ chapter_slug: z.string() }),
    handler: async (ctx, args) => {

    }
})

export const getPreviousPart = query({
    name: 'part',
    args: z.object({course_slug: z.string(), part_slug: z.string()}),
    handler: async (ctx, args): Promise<{name: string, slug: string}> => {}
})


export const getNextPart = query({
    name: 'part',
    args: z.object({course_slug: z.string(), part_slug: z.string()}),
    handler: async (ctx, args): Promise<{name: string, slug: string}> => {}
})
