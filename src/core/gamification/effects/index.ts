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
