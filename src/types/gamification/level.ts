
/**
 * Represents the gamification information for a user
 */
export type UserGamificationInformation = {
  userId: string
  currentLevel: number
  currentExperience: number
  totalExperience: number
  lastLevelUpDate: Date
}
