// Import server-side data fetching functions
import { getMarketplaceItems } from '@/core/gamification/marketplace'
import { getUserCurrency } from '@/core/gamification/marketplace/currency'
import { getUserInventory } from '@/core/gamification/inventory'
import { getSessionUser } from '@/core/user' // To get userId

// Import the client layer component
import { SocialGroupClientLayer } from './social-group-client-layer'

// Import necessary types
import { MarketplaceItem, UserItem } from '@/payload-types'

// Refactored SocialGroup as an async Server Component
export const SocialGroup = async () => {
  // Fetch user ID first
  const userResult = await getSessionUser()
  const userId = userResult.success ? userResult.value.id : null

  let results: PromiseSettledResult<any>[] = []
  if (userId) {
    // Fetch marketplace and inventory data if user is logged in
    results = await Promise.allSettled([
      getMarketplaceItems(),
      getUserCurrency(userId),
      getUserInventory(userId),
    ])
  } else {
    // If no user, set results as if fetches were rejected/empty
    results = [
      { status: 'fulfilled', value: [] }, // Empty marketplace items
      { status: 'fulfilled', value: 0 }, // 0 currency
      { status: 'fulfilled', value: [] }, // Empty inventory
    ]
  }

  // Process results, handling potential errors
  const initialMarketplaceItems = results[0].status === 'fulfilled' ? results[0].value : null
  const initialMarketplaceError =
    results[0].status === 'rejected' ? 'Failed to load marketplace items.' : null
  if (results[0].status === 'rejected') {
    console.error('getMarketplaceItems failed:', results[0].reason)
  }

  const initialUserCurrency = results[1].status === 'fulfilled' ? results[1].value : null
  const initialCurrencyError =
    results[1].status === 'rejected' ? 'Failed to load user currency.' : null
  if (results[1].status === 'rejected') {
    console.error('getUserCurrency failed:', results[1].reason)
  }

  const initialUserInventory = results[2].status === 'fulfilled' ? results[2].value : null
  const initialInventoryError =
    results[2].status === 'rejected' ? 'Failed to load user inventory.' : null
  if (results[2].status === 'rejected') {
    console.error('getUserInventory failed:', results[2].reason)
  }

  // Combine marketplace and currency errors for MarketplaceDialog
  const finalMarketplaceError = initialMarketplaceError || initialCurrencyError

  // Pass fetched data and userId to the client layer component
  return (
    <SocialGroupClientLayer
      userId={userId}
      initialMarketplaceItems={initialMarketplaceItems}
      initialUserCurrency={initialUserCurrency}
      initialUserInventory={initialUserInventory}
      initialMarketplaceError={finalMarketplaceError}
      initialInventoryError={initialInventoryError}
    />
  )
}
