// Export types
export * from '../../types/gamification/level'
export * from '../../types/gamification/item'
export * from '../../types/gamification/shop'
export * from '../../types/gamification/quest'

// Exporter les fonctions et services
export * from './level'
export * from './shop'
export * from './items'
export * from './quest'

// Exporter une fonction utilitaire pour initialiser tous les services pour un utilisateur
import { initializeUser } from './level'
import { virtualCurrencyService } from './shop'
import { shopService, chestService } from './items'
import { questService } from './quest'

/**
 * Initialise tous les services de gamification pour un nouvel utilisateur
 * @param userId ID de l'utilisateur
 */
export async function initializeGamificationForUser(userId: string): Promise<void> {
  // Initialiser le niveau et l'expérience
  await initializeUser(userId)

  // Initialiser la monnaie virtuelle
  await virtualCurrencyService.initializeUserCurrency(userId)

  // Générer les quêtes quotidiennes
  await questService.generateDailyQuests(userId)

  // D'autres initialisations peuvent être ajoutées ici
}
