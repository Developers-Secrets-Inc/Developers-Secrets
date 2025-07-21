'use server'

import 'server-only'

import { MarketplaceItem } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getMarketplaceItems = async (): Promise<MarketplaceItem[]> => {
  const payload = await getPayload({ config })

  const marketplaceItems = await payload.find({
    collection: 'marketplace-items',
    where: {
      isAvailable: { equals: true }, // Only fetch available items
      // Optional: Add date filtering if needed
      // startDate: { less_than_equal: new Date().toISOString() },
      // endDate: { greater_than_equal: new Date().toISOString() },
    },
    sort: '-purchaseCount', // Sort by purchase count descending
    depth: 1, // Ensure item details are populated
  })

  return marketplaceItems.docs
}
