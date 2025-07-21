import { User, UserRole } from './user'

/**
 * Rôles possibles d'un membre dans une guilde
 */
export type GuildMemberRole =
  | 'owner' // Propriétaire de la guilde
  | 'admin' // Administrateur avec des droits étendus
  | 'moderator' // Modérateur avec des droits limités
  | 'member' // Membre standard

/**
 * Statut d'un membre dans une guilde
 */
export type GuildMemberStatus =
  | 'active' // Membre actif
  | 'inactive' // Membre inactif (n'a pas participé depuis longtemps)
  | 'pending' // En attente d'approbation
  | 'banned' // Membre banni

/**
 * Raison du bannissement
 */
export type BanReason =
  | 'inappropriate_behavior' // Comportement inapproprié
  | 'spam' // Spam
  | 'harassment' // Harcèlement
  | 'multiple_violations' // Violations multiples des règles
  | 'other' // Autre raison

/**
 * Informations sur un membre banni
 */
export type BannedMember = {
  user: User // Utilisateur ou ID d'utilisateur
  bannedAt: string // Date du bannissement
  bannedBy: User // Modérateur ayant effectué le bannissement
  reason: BanReason // Raison du bannissement
  details?: string // Détails supplémentaires sur le bannissement
  expiresAt?: string // Date d'expiration du bannissement (optionnel, pour les bans temporaires)
  appealStatus?: 'none' | 'pending' | 'rejected' // Statut d'un éventuel appel
}

/**
 * Permissions d'un membre dans une guilde
 */
export type GuildMemberPermission = {
  canInvite: boolean // Peut inviter de nouveaux membres
  canRemoveMembers: boolean // Peut supprimer des membres
  canEditGuild: boolean // Peut modifier les informations de la guilde
  canManageMessages: boolean // Peut gérer les messages
  canManageRoles: boolean // Peut gérer les rôles des membres
}

/**
 * Statistiques d'un membre dans une guilde
 */
export type GuildMemberStats = {
  joinedAt: string // Date d'adhésion
  lastActiveAt: string // Dernière activité
  coursesCompleted: number // Nombre de formations terminées
  challengesCompleted: number // Nombre de défis terminés
  contributionPoints: number // Points de contribution
  rank: number // Classement dans la guilde
}

/**
 * Représente un membre d'une guilde
 * Extension du type User avec des informations spécifiques à la guilde
 */
export type GuildMember = {
  user: User | string // Utilisateur ou ID d'utilisateur
  guildId: string // ID de la guilde
  displayName?: string // Nom d'affichage dans la guilde (peut être différent du nom d'utilisateur)
  role: GuildMemberRole // Rôle dans la guilde
  status: GuildMemberStatus // Statut dans la guilde
  permissions: GuildMemberPermission // Permissions spécifiques
  stats: GuildMemberStats // Statistiques dans la guilde

  // Badges obtenus dans la guilde
  badges?: Array<{
    id: string
    name: string
    description: string
    imageUrl: string
    earnedAt: string
  }>

  // Notes personnelles du membre (visibles uniquement par lui-même)
  personalNotes?: string

  // Date d'expiration (pour les membres temporaires)
  expiresAt?: string
}

/**
 * Type de visibilité d'une guilde
 */
export type GuildVisibility =
  | 'public' // Visible par tous, n'importe qui peut demander à rejoindre
  | 'private' // Visible uniquement sur invitation
  | 'unlisted' // Non listée, accessible uniquement via lien direct

/**
 * Difficulté d'une quête
 */
export type GuildQuestDifficulty =
  | 'easy' // Facile - Pour les débutants
  | 'medium' // Moyenne - Pour les membres réguliers
  | 'hard' // Difficile - Pour les membres expérimentés
  | 'expert' // Expert - Pour les membres les plus actifs

/**
 * Représente une quête de guilde simplifiée
 */
export type GuildQuest = {
  id: string
  guildId: string

  // Contenu de la quête
  statement: string // Énoncé de la quête
  difficulty: GuildQuestDifficulty // Niveau de difficulté

  // Récompense
  experiencePoints: number // Points d'expérience gagnés à la complétion

  // Temps
  deadline: string // Date limite pour compléter la quête

  // Métadonnées
  createdAt: string
  completedAt?: string
}

/**
 * Niveau de guilde avec ses avantages
 */
export type GuildLevel = {
  level: number
  experienceRequired: number // XP nécessaire pour atteindre ce niveau
  title: string // Titre du niveau (ex: "Guilde Novice", "Guilde Experte")

  // Avantages débloqués à ce niveau
  perks: Array<{
    name: string
    description: string
  }>
}

/**
 * Progression de niveau d'une guilde
 */
export type GuildLevelProgress = {
  currentLevel: number
  currentExperience: number
  experienceToNextLevel: number
  totalExperience: number
}

/**
 * Représente une guilde
 */
export type Guild = {
  id: string
  name: string
  description: string
  slug: string

  // Logo et bannière de la guilde
  logoUrl?: string
  bannerUrl?: string

  visibility: GuildVisibility

  // Métadonnées
  metadata: {
    createdAt: string
    updatedAt: string
    createdBy: User | string // Créateur de la guilde
  }

  // Membres de la guilde
  members: GuildMember[] | string[] // Liste des membres ou leurs IDs

  // Liste des membres bannis
  bannedMembers: BannedMember[] // Liste des membres bannis avec leurs informations

  // Paramètres de la guilde
  settings: {
    // Conditions d'adhésion
    joinRequirements: {
      requiresApproval: boolean // Nécessite l'approbation d'un admin
      minimumUserRole?: UserRole // Rôle utilisateur minimum requis
      inviteOnly: boolean // Uniquement sur invitation
      maxMembers?: number // Nombre maximum de membres
    }

    // Paramètres de modération
    moderation: {
      autoban: boolean // Bannissement automatique après X avertissements
      warningsBeforeBan: number // Nombre d'avertissements avant bannissement automatique
      tempBanDuration?: number // Durée par défaut d'un bannissement temporaire (en jours)
      allowAppeals: boolean // Autoriser les appels de bannissement
    }
  }

  // Système de niveaux et quêtes
  levelSystem: {
    currentProgress: GuildLevelProgress
    availableLevels: GuildLevel[]

    // Quêtes
    activeQuests: GuildQuest[] // Quêtes en cours
    completedQuests: string[] // IDs des quêtes terminées
    questHistory: Array<{
      questId: string
      completedAt: string
      experienceEarned: number
    }>
  }

  // Statistiques de la guilde
  stats: {
    memberCount: number // Nombre total de membres
    activeMembers: number // Nombre de membres actifs (derniers 30 jours)
    averageCompletionRate: number // Taux moyen de complétion des formations
    totalChallengesCompleted: number // Nombre total de défis complétés
    totalQuestsCompleted: number // Nombre total de quêtes complétées
    createdAt: string // Date de création
  }

  // Tags associés à la guilde
  tags?: string[]
}
