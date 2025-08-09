'use server'
import 'server-only'

import { z } from 'zod'
import { mutation, query } from '@/core/functions'
import { fromNullable, isSome } from '@/lib/maybe'
import { onboardingRegistry } from './registry'

export type AppRoute = Extract<keyof typeof onboardingRegistry, string>

// Runtime validation aligned to TS: accept only keys present in onboardingRegistry
const appRouteSchema = z.custom<AppRoute>((v) => typeof v === 'string' && v in onboardingRegistry, {
  message: 'Invalid route',
}) as z.ZodType<AppRoute>

/**
 * setPageVisited
 * - Idempotent mutation that marks a (userId, path) as visited.
 * - Creates the record if it does not exist; otherwise, no-op.
 */
export const setPageVisited = mutation({
  name: 'setPageVisited',
  args: z.object({
    userId: z.string().min(1),
    path: appRouteSchema,
  }),
  handler: async ({ payload }, { userId, path }) => {
    const existingDoc = await payload
      .find({
        collection: 'user-page-visits',
        where: {
          and: [{ userId: { equals: userId } }, { path: { equals: path } }],
        },
        limit: 1,
      })
      .then((r) => r.docs[0])

    const maybeExisting = fromNullable(existingDoc)

    if (!isSome(maybeExisting)) {
      await payload.create({
        collection: 'user-page-visits',
        data: { userId, path, visited: true },
      })
    }

    return { visited: true }
  },
})

/**
 * hasVisited
 * - Query that returns true if a (userId, path) record exists; false otherwise.
 */
export const hasVisited = query({
  name: 'hasVisited',
  args: z.object({
    userId: z.string().min(1),
    path: appRouteSchema,
  }),
  handler: async ({ payload }, { userId, path }) => {
    const doc = await payload
      .find({
        collection: 'user-page-visits',
        where: {
          and: [{ userId: { equals: userId } }, { path: { equals: path } }],
        },
        limit: 1,
      })
      .then((r) => r.docs[0])

    return isSome(fromNullable(doc))
  },
})
