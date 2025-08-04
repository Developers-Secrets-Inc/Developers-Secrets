'use server'

import 'server-only'

import config from '@payload-config'
import { BasePayload, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { TIME } from '@/lib/time'

type PayloadInstance = InstanceType<typeof BasePayload>

export const find: PayloadInstance['find'] = async (options) => {
  const payload = await getPayload({ config })

  const cachedFind = unstable_cache(
    async () => {
      return await payload.find({
        ...options,
      })
    },
    [`payload-find-${JSON.stringify(options)}`],
    { revalidate: TIME.ONE_DAY },
  )

  const elements = await cachedFind()

  return elements
}



