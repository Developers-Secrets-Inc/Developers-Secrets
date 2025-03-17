import { User } from './user'
import { Skill } from './skills'

/**
 * Type représentant un test pour un challenge
 */
export type ChallengeTest = {
  id: string
  description: string
  input: string
  expectedOutput: string
}

/**
 * Type représentant le code associé à un challenge
 */
export type ChallengeCode = {
  initial_code: string
  language: 'javascript' | 'typescript' | 'python'
  tests: ChallengeTest[]
}

/**
 * Type représentant un vote sur une solution
 */
export type SolutionVote = {
  id: string
  user: User
  type: 'upvote' | 'downvote'
  createdAt: Date
}

/**
 * Type représentant une solution créée par un utilisateur
 */
export type UserSolution = {
  id: string
  user: User
  content: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  votes: SolutionVote[]
  upvotesCount: number // Nombre total d'upvotes
  downvotesCount: number // Nombre total de downvotes
  comments: UserSolutionComment[]
}

/**
 * Type représentant un commentaire sur une solution utilisateur
 */
export type UserSolutionComment = {
  id: string
  user: User
  content: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Type représentant l'association entre un challenge et un skill avec son pourcentage de développement
 */
export type ChallengeSkill = {
  skill: Skill
  developmentPercentage: number // Pourcentage de développement du skill dans ce challenge (0-100)
}

/**
 * Type représentant un challenge
 */
export type Challenge = {
  id: string
  slug: string
  title: string
  statement: string
  solution: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  code: ChallengeCode
  skills: ChallengeSkill[] // Modifié pour utiliser ChallengeSkill au lieu de Skill[]
  userSolutions: UserSolution[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Type représentant le statut d'un challenge pour un utilisateur
 */
export type ChallengeStatus = 'not_started' | 'in_progress' | 'completed'

/**
 * Type représentant la progression d'un utilisateur sur un challenge
 */
export type UserChallengeProgression = {
  id: string
  user: User
  challenge: Challenge
  status: ChallengeStatus
  savedCode: string
  startedAt: Date
  completedAt?: Date
  lastUpdated: Date
  attempts: number
  successfulTests: string[] // IDs of tests that have passed
}

/**
 * Type représentant le suivi des challenges complétés par jour
 */
export type DailyChallengeCompletion = {
  id: string
  user: User
  date: Date
  completedChallenges: Challenge[]
  completedCount: number
  experienceMultiplier: number // Multiplicateur d'expérience basé sur le nombre de challenges complétés
}

/**
 * Type représentant les paliers de multiplicateur d'expérience
 */
export type ExperienceMultiplierTier = {
  id: string
  minimumChallenges: number // Nombre minimum de challenges à compléter pour atteindre ce palier
  multiplier: number // Valeur du multiplicateur d'expérience
  name: string // Nom du palier (ex: "Débutant", "Intermédiaire", "Expert", "Maître")
  description: string // Description du palier
}

/**
 * Type représentant les statistiques globales d'un utilisateur sur les challenges
 */
export type UserChallengeStats = {
  user: User
  totalCompletedChallenges: number
  totalAttemptedChallenges: number
  currentDailyStreak: number // Nombre de jours consécutifs avec au moins un challenge complété
  longestDailyStreak: number
  lastCompletionDate?: Date
  averageChallengesPerDay: number
  dailyCompletions: DailyChallengeCompletion[] // Historique des complétions quotidiennes
}




export type Article = {
  title: string 
  statement: string
}

export type Exercice = {
  solution: string 
  code: {
    initial_code: string 
    language: 'javascript' | 'typescript' | 'python'
    tests: {
      input: string
      expectedOutput: string
    }[]
  }
}

export type NewChallenge = {
  id: string 
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible'

  article: Article 
  exercice: Exercice
}