'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { ActiveEffect } from '@/payload-types'

export const createActiveEffect = async (
  userId: string,
  effectType: 'xpBoost' | 'currencyBoost' | 'streakRestore' | 'unlockFeature',
  multiplier: number,
  expiresAt: Date,
) => {
  const payload = await getPayload({ config })

  const result = await payload.create({
    collection: 'active-effects',
    data: {
      userId,
      effectType,
      multiplier,
      expiresAt: expiresAt.toISOString(),
      activatedAt: new Date().toISOString(),
    },
  })

  return result
}

export const getActiveEffects = async (userId: string) => {
  const payload = await getPayload({ config })

  const now = new Date().toISOString()

  const result = await payload.find({
    collection: 'active-effects',
    where: {
      and: [
        {
          userId: {
            equals: userId,
          },
        },
        {
          isActive: {
            equals: true,
          },
        },
        {
          expiresAt: {
            greater_than: now,
          },
        },
      ],
    },
    sort: '-expiresAt', // Get the ones that expire last first
  })

  return result.docs
}

export const getActiveXPBoost = async (userId: string): Promise<number> => {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  const activeBoosts = await payload.find({
    collection: 'active-effects',
    where: {
      and: [
        {
          userId: {
            equals: userId,
          },
        },
        {
          effectType: {
            equals: 'xpBoost',
          },
        },
        {
          isActive: {
            equals: true,
          },
        },
        {
          expiresAt: {
            greater_than: now,
          },
        },
      ],
    },
  })

  // Si plusieurs boosts sont actifs, on prend le plus élevé
  let highestMultiplier = 1
  for (const boost of activeBoosts.docs) {
    if (boost.multiplier > highestMultiplier) {
      highestMultiplier = boost.multiplier
    }
  }

  return highestMultiplier
}

export const findExistingActiveEffect = async (
  userId: string,
  effectType: string,
): Promise<ActiveEffect | null> => {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  const result = await payload.find({
    collection: 'active-effects',
    where: {
      and: [
        { userId: { equals: userId } },
        { effectType: { equals: effectType } },
        { isActive: { equals: true } },
        { expiresAt: { greater_than: now } },
      ],
    },
    limit: 1, // Only need one
  })

  return result.docs[0] || null
}

export const hasPassiveXPBoost = async (userId: string): Promise<boolean> => {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'user-items',
      where: {
        and: [
          { userId: { equals: userId } },
          // Use dot notation for related fields
          { 'item.activationMode': { equals: 'passive' } },
          { 'item.type': { equals: 'xpBoost' } },
        ],
      },
      limit: 1, // We only need to know if at least one exists
      depth: 0, // No need to populate the item details
    })

    return result.docs.length > 0
  } catch (error) {
    console.error('Error checking for passive XP boost:', error)
    return false // Return false in case of error
  }
}

export const getPassiveXPBoostMultiplier = async (userId: string): Promise<number> => {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'user-items',
      where: {
        and: [
          { userId: { equals: userId } },
          { 'item.activationMode': { equals: 'passive' } },
          { 'item.type': { equals: 'xpBoost' } },
          // Ensure the user actually has the item
          { quantity: { greater_than: 0 } },
        ],
      },
      limit: 1,
      depth: 1, // We need the item details (multiplier)
    })

    if (result.docs.length > 0) {
      const item = result.docs[0].item as any // Type assertion needed
      return item.multiplier || 1 // Return multiplier or 1 if not set
    }

    return 1 // No passive boost found
  } catch (error) {
    console.error('Error fetching passive XP boost multiplier:', error)
    return 1 // Return 1 in case of error
  }
}

// Finds the multiplier of a passive item of a specific type owned by the user
export const getPassiveBoostMultiplierByType = async (
  userId: string,
  effectType: string,
): Promise<number> => {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'user-items',
      where: {
        and: [
          { userId: { equals: userId } },
          { 'item.activationMode': { equals: 'passive' } },
          { 'item.type': { equals: effectType } }, // Filter by the specific type
          { quantity: { greater_than: 0 } },
        ],
      },
      limit: 1,
      depth: 1, // Need item details for multiplier
    })

    if (result.docs.length > 0) {
      const item = result.docs[0].item as any // Type assertion needed
      return item.multiplier || 1 // Return multiplier or 1 if not set
    }

    return 1 // No matching passive boost found
  } catch (error) {
    console.error(`Error fetching passive boost multiplier for type ${effectType}:`, error)
    return 1 // Return 1 in case of error
  }
}
