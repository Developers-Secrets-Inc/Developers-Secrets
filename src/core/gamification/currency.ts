'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Initialise la devise pour un utilisateur
 */
export async function initializeUserCurrency(userId: string): Promise<void> {
  const payload = await getPayload({ config })

  // Vérifier si l'utilisateur a déjà une devise
  const existingUserCurrency = await payload.find({
    collection: 'user-currency',
    where: {
      userId: {
        equals: userId,
      },
    },
  })

  if (existingUserCurrency.docs.length > 0) {
    throw new Error('User currency already initialized')
  }

  // Créer l'entrée pour l'utilisateur
  await payload.create({
    collection: 'user-currency',
    data: {
      userId,
      coins: 0,
      transactionHistory: [],
      lastUpdated: new Date().toISOString(),
    },
  })
}

/**
 * Récupère la devise d'un utilisateur
 */
export async function getUserCurrency(userId: string): Promise<any | null> {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'user-currency',
      where: {
        userId: {
          equals: userId,
        },
      },
    })

    if (result.docs.length === 0) {
      return null
    }

    return result.docs[0]
  } catch (error) {
    console.error('Error fetching user currency:', error)
    return null
  }
}

/**
 * Ajoute des pièces à un utilisateur
 */
export async function addCoins(
  userId: string,
  amount: number,
  source: string,
  details?: string,
): Promise<any> {
  if (amount <= 0) {
    throw new Error('Amount must be positive')
  }

  const payload = await getPayload({ config })

  // Récupérer la devise actuelle de l'utilisateur
  const userCurrency = await getUserCurrency(userId)
  if (!userCurrency) {
    throw new Error('User currency not found')
  }

  // Préparer la transaction
  const transaction = {
    timestamp: new Date().toISOString(),
    type: 'earn',
    amount,
    source,
    details: details || '',
  }

  // Mettre à jour la devise de l'utilisateur
  const updatedUserCurrency = await payload.update({
    collection: 'user-currency',
    where: {
      userId: {
        equals: userId,
      },
    },
    data: {
      coins: userCurrency.coins + amount,
      transactionHistory: [...(userCurrency.transactionHistory || []), transaction],
      lastUpdated: new Date().toISOString(),
    },
  })

  return updatedUserCurrency.docs[0]
}

/**
 * Dépense des pièces d'un utilisateur
 */
export async function spendCoins(
  userId: string,
  amount: number,
  source: string,
  details?: string,
): Promise<any> {
  if (amount <= 0) {
    throw new Error('Amount must be positive')
  }

  const payload = await getPayload({ config })

  // Récupérer la devise actuelle de l'utilisateur
  const userCurrency = await getUserCurrency(userId)
  if (!userCurrency) {
    throw new Error('User currency not found')
  }

  // Vérifier si l'utilisateur a assez de pièces
  if (userCurrency.coins < amount) {
    throw new Error('Not enough coins')
  }

  // Préparer la transaction
  const transaction = {
    timestamp: new Date().toISOString(),
    type: 'spend',
    amount: -amount, // Montant négatif pour une dépense
    source,
    details: details || '',
  }

  // Mettre à jour la devise de l'utilisateur
  const updatedUserCurrency = await payload.update({
    collection: 'user-currency',
    where: {
      userId: {
        equals: userId,
      },
    },
    data: {
      coins: userCurrency.coins - amount,
      transactionHistory: [...(userCurrency.transactionHistory || []), transaction],
      lastUpdated: new Date().toISOString(),
    },
  })

  return updatedUserCurrency.docs[0]
}

/**
 * Ajuste les pièces d'un utilisateur (pour les administrateurs)
 */
export async function adjustCoins(userId: string, amount: number, details?: string): Promise<any> {
  const payload = await getPayload({ config })

  // Récupérer la devise actuelle de l'utilisateur
  const userCurrency = await getUserCurrency(userId)
  if (!userCurrency) {
    throw new Error('User currency not found')
  }

  // Vérifier si l'ajustement est valide
  if (userCurrency.coins + amount < 0) {
    throw new Error('Adjustment would result in negative coins')
  }

  // Préparer la transaction
  const transaction = {
    timestamp: new Date().toISOString(),
    type: 'admin_adjustment',
    amount,
    source: 'admin_adjustment',
    details: details || 'Ajustement administratif',
  }

  // Mettre à jour la devise de l'utilisateur
  const updatedUserCurrency = await payload.update({
    collection: 'user-currency',
    where: {
      userId: {
        equals: userId,
      },
    },
    data: {
      coins: userCurrency.coins + amount,
      transactionHistory: [...(userCurrency.transactionHistory || []), transaction],
      lastUpdated: new Date().toISOString(),
    },
  })

  return updatedUserCurrency.docs[0]
}
