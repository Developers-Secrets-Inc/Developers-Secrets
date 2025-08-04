'use server'

import { makeCacheKey, mutation, query } from '@/core/functions'
import { Maybe, none, some } from '@/lib/maybe'
import { UserItem } from '@/payload-types'
import { revalidateTag } from 'next/cache'
import 'server-only'
import z from 'zod'

export const getUserItem = query({
  name: 'user-item',
  args: z.object({ itemId: z.number(), userId: z.string().uuid() }),
  handler: async (ctx, args): Promise<Maybe<UserItem>> => {
    const documents = await ctx.payload.find({
      collection: 'user-items',
      where: { userId: { equals: args.userId }, itemId: { equals: args.itemId } },
    })

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
})

export const getUserInventory = query({
  name: 'user-inventory',
  args: z.object({ userId: z.string().uuid() }),
  handler: async (ctx, args): Promise<Maybe<UserItem[]>> => {
    const documents = await ctx.payload.find({
      collection: 'user-items',
      where: { userId: { equals: args.userId } },
    })

    return documents.docs.length !== 0 ? some(documents.docs) : none()
  },
})

export const insertItemInUserInventory = mutation({
  name: 'add-user-item',
  args: z.object({
    itemId: z.number(),
    userId: z.string().uuid(),
    quantity: z.number().default(1),
  }),
  handler: async (ctx, args): Promise<void> => {
    if (await getUserItem({ itemId: args.itemId, userId: args.userId })) {
      throw new Error(
        `Item with ID: ${args.itemId} already exists for user with ID: ${args.userId}`,
      )
    }

    await ctx.payload.create({
      collection: 'user-items',
      data: { userId: args.userId, item: args.itemId, quantity: args.quantity },
    })

    revalidateTag(makeCacheKey('user-inventory', { userId: args.userId }))
  },
})

export const updateItemInUserInventory = mutation({
  name: 'update-user-item',
  args: z.object({
    itemId: z.number(),
    userId: z.string().uuid(),
    quantity: z.number().default(1),
  }),
  handler: async (ctx, args): Promise<void> => {
    if (!(await getUserItem({ itemId: args.itemId, userId: args.userId }))) {
      await insertItemInUserInventory({itemId: args.itemId, userId: args.userId, quantity: args.quantity})
    }

    await ctx.payload.update({
      collection: 'user-items',
      where: {item: { equals: args.itemId }, userId: {equals: args.userId }},
      data: { quantity: args.quantity },
    })

    revalidateTag(makeCacheKey('user-inventory', { userId: args.userId }))
  },
})