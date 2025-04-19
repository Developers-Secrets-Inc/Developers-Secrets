'use server'

import "server-only"

import { MarketplaceItem } from "@/payload-types"
import { getPayload } from "payload"
import config from "@payload-config"


export const getMarketplaceItems = async (): Promise<MarketplaceItem[]> => {
  const payload = await getPayload({ config })

  const marketplaceItems = await payload.find({
    collection: 'marketplace-items',
  })

  return marketplaceItems.docs
}

