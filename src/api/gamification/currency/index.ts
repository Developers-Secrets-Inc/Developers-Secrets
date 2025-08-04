'use server'

import { query } from '@/core/functions'
import { Maybe, none, some } from '@/lib/maybe'
import 'server-only'
import z from 'zod'


export const getUserCurrency = query({
    name: 'user-currency',
    args: z.object({ userId: z.string().uuid() }),
    handler: async (ctx, args): Promise<Maybe<number>> => {
        const documents = await ctx.payload.find({
            collection: 'user-currency',
            where: { userId: { equals: args.userId }},
            depth: 0,
            limit: 1,
            select: { quantity: true }
        })

        return documents.docs[0] ? some(documents.docs[0].quantity) : none()
    }
})