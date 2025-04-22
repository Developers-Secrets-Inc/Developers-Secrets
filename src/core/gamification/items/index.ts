'use server'

import 'server-only'

import { Item } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getItem = async (itemId: number): Promise<Item | null> => {
  const payload = await getPayload({ config })
  const item = await payload.findByID({ collection: 'items', id: itemId })
  return item || null
}