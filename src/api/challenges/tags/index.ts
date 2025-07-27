'use server'

import { query } from '@/core/functions'
import { none, some } from '@/lib/maybe'
import 'server-only'
import z from 'zod'


export const getChallengeTagBySlug = query({
    name: 'challenge-tag-by-slug',
    args: z.object({ slug: z.string() }),
    handler: async (ctx, args) => {
        const documents = await ctx.payload.find({
            collection: 'challenge-tags',
            where: { slug: { equals: args.slug } },
            limit: 1,
            depth: 0
        })

        return documents.docs[0] ? some(documents.docs[0]) : none()
    },
}) 

export const getChallengeTagProgression = query({
    name: 'challenge-tag-by-slug',
    args: z.object({ tagId: z.number(), userId: z.string().uuid() }),
    handler(ctx, args) {
        // get all challenges from tag and get their progression status
    },
}) 