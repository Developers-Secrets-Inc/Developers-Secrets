'use server'

import 'server-only'

import { Subscription } from '@polar-sh/sdk/models/components/subscription.js'
import { Polar } from '@polar-sh/sdk'

export const getSubscriptionsByCustomerId = async (customerId: string): Promise<Subscription[]> => {
  const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
})

  const subscriptions = await polar.subscriptions.list({
    customerId: customerId,
  })

  return subscriptions.result.items
}


export const revokeUserSubscription = async (customerId: string) => {
  const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
  })

  const subscriptions = await getSubscriptionsByCustomerId(customerId)

  if (subscriptions.length === 0) {
    return { error: 'No subscriptions found' }
  }

  const subscription = subscriptions[0]

  await polar.subscriptions.revoke({
    id: subscription.id,
  })
}

