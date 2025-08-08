import { z, ZodTypeAny } from 'zod'
import { BasePayload, getPayload } from 'payload'
import payloadConfig from '@payload-config'
import { unstable_cache, revalidateTag } from 'next/cache'
import { QueryCtx } from './types'

// Génère une clé unique à partir du nom et des arguments
export function makeCacheKey(name: string, args: Record<string, any>) {
  return [name, ...Object.entries(args).map(([k, v]) => {
    try {
      if (v === null || v === undefined) {
        return `${k}-null`
      }
      if (typeof v === 'object') {
        try {
          return `${k}-${JSON.stringify(v)}`
        } catch {
          return `${k}-[object]`
        }
      }
      if (typeof v === 'function') {
        return `${k}-[function]`
      }
      return `${k}-${String(v)}`
    } catch {
      // Fallback for any edge cases that might throw
      return `${k}-[unserializable]`
    }
  })].join('-')
}

export function query<Schema extends ZodTypeAny, T>(config: {
  name: string
  args?: Schema
  handler: (
    ctx: QueryCtx,
    args: Schema extends undefined ? undefined : z.infer<Schema>,
  ) => Promise<T> | T
  revalidate?: number | false
  tags?: string[] | ((args: Schema extends undefined ? undefined : z.infer<Schema>) => string[])
}): (args?: Schema extends undefined ? undefined : z.infer<Schema>) => Promise<T> {
  return async (args?: Schema extends undefined ? undefined : z.infer<Schema>) => {
    const payload = await getPayload({ config: payloadConfig })
    const ctx: QueryCtx = { payload, drizzle: payload.db.drizzle }
    if (config.args) config.args.parse(args ?? {})

    const cacheKey = makeCacheKey(config.name, args ?? {})
    
    // Calculate tags based on args only (static tags)
    let tags = [cacheKey]
    if (config.tags) {
      if (Array.isArray(config.tags)) {
        tags = [...tags, ...config.tags]
      } else if (typeof config.tags === 'function') {
        const dynamicTags = config.tags(args ?? ({} as any))
        tags = [...tags, ...dynamicTags]
      }
    }
    
    const cachedFn = unstable_cache(
      async () => {
        const result = await Promise.resolve(config.handler(ctx, args ?? ({} as any)))
        return result
      },
      tags,
      {
        tags: tags,
        revalidate: config.revalidate,
      },
    )

    return await cachedFn()
  }
}


export function mutation<Schema extends ZodTypeAny, T>(config: {
  name: string
  args?: Schema
  handler: (
    ctx: QueryCtx,
    args: Schema extends undefined ? undefined : z.infer<Schema>,
  ) => Promise<T> | T
}): (args?: Schema extends undefined ? undefined : z.infer<Schema>) => Promise<T> {
  return async (args?: Schema extends undefined ? undefined : z.infer<Schema>) => {
    const payload = await getPayload({ config: payloadConfig })
    const ctx: QueryCtx = { payload, drizzle: payload.db.drizzle }
    if (config.args) config.args.parse(args ?? {})

    const result = await Promise.resolve(config.handler(ctx, args ?? ({} as any)))

    const cacheKey = makeCacheKey(config.name, args ?? {})
    revalidateTag(cacheKey)

    return result
  }
}




export function action<Schema extends ZodTypeAny, T>(config: {
  name: string
  args?: Schema
  handler: (
    ctx: QueryCtx,
    args: Schema extends undefined ? undefined : z.infer<Schema>,
  ) => Promise<T> | T
}): (args?: Schema extends undefined ? undefined : z.infer<Schema>) => Promise<T> {
  return async (args?: Schema extends undefined ? undefined : z.infer<Schema>) => {
    const payload = await getPayload({ config: payloadConfig })
    const ctx: QueryCtx = { payload, drizzle: payload.db.drizzle }
    if (config.args) config.args.parse(args ?? {})

    return config.handler(ctx, args ?? ({} as any))
  }
}