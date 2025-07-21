import { User } from './user'

/**
 * Type représentant les différentes permissions de messages
 */
export type MessagePermission = 'everybody' | 'friends' | 'invitation_only' | 'nobody'

/**
 * Type représentant les différentes visibilités de profil
 */
export type ProfileVisibility = 'public' | 'friends' | 'guild_members' | 'nobody'

/**
 * Type représentant une relation de suivi entre deux utilisateurs
 */
export type UserFollow = {
  id: string
  follower: User // L'utilisateur qui suit
  following: User // L'utilisateur qui est suivi
  createdAt: Date
  isMutual: boolean // Indique si les deux utilisateurs se suivent mutuellement (amis)
}

/**
 * Type représentant un blocage entre deux utilisateurs
 */
export type UserBlock = {
  id: string
  blocker: User // L'utilisateur qui bloque
  blocked: User // L'utilisateur qui est bloqué
  reason?: string // Raison optionnelle du blocage
  createdAt: Date
}

/**
 * Type représentant une invitation de message
 * Utilisé lorsqu'un utilisateur tente d'envoyer un message à quelqu'un
 * qui ne l'autorise pas selon ses permissions, mais qui a activé les invitations
 */
export type MessageInvitation = {
  id: string
  sender: User
  recipient: User
  content: string
  createdAt: Date
  status: 'pending' | 'accepted' | 'rejected'
  responseDate?: Date
}

/**
 * Type représentant un message entre deux utilisateurs
 */
export type UserMessage = {
  id: string
  sender: User
  recipient: User
  content: string
  createdAt: Date
  isRead: boolean
  readAt?: Date
  isReported: boolean
  reportReason?: string
  reportedAt?: Date
}

/**
 * Type représentant les paramètres sociaux d'un utilisateur
 */
export type UserSocialSettings = {
  user: User
  messagePermission: MessagePermission
  profileVisibility: ProfileVisibility
  acceptInvitations: boolean
  maxInvitationMessages: number // Nombre maximum de messages d'invitation qu'un utilisateur peut envoyer
  followers: UserFollow[] // Personnes qui suivent cet utilisateur
  following: UserFollow[] // Personnes que cet utilisateur suit
  blockedUsers: UserBlock[] // Personnes que cet utilisateur a bloquées
  blockedBy: UserBlock[] // Personnes qui ont bloqué cet utilisateur
  pendingInvitations: MessageInvitation[] // Invitations de message en attente
  notificationsEnabled: boolean // Si l'utilisateur souhaite recevoir des notifications
  messageNotificationsEnabled: boolean // Si l'utilisateur souhaite recevoir des notifications pour les messages
  followNotificationsEnabled: boolean // Si l'utilisateur souhaite recevoir des notifications pour les nouveaux followers
  guildVisibilityOverride: boolean // Si true, le profil est automatiquement visible par les membres de la guilde
}

/**
 * Type représentant l'historique des messages entre deux utilisateurs
 * Utilisé pour déterminer si un utilisateur peut envoyer un message en mode 'nobody'
 */
export type MessageHistory = {
  id: string
  user1: User
  user2: User
  lastMessageDate: Date
  lastMessageSender: User // Dernier utilisateur ayant envoyé un message
  messageCount: number
  messages: UserMessage[] // Historique des messages
}

/**
 * Type pour vérifier si un utilisateur peut envoyer un message à un autre
 */
export type MessagePermissionCheck = {
  canSendMessage: boolean
  requiresInvitation: boolean
  reason?: string
}

/**
 * Type représentant une notification
 */
export type Notification = {
  id: string
  recipient: User
  type: 'follow' | 'message' | 'invitation' | 'friend_request' | 'friend_accepted'
  relatedUser?: User
  content?: string
  createdAt: Date
  isRead: boolean
  readAt?: Date
}

/**
 * Type représentant un signalement de message
 */
export type MessageReport = {
  id: string
  reporter: User
  reportedUser: User
  message: UserMessage
  reason: string
  details?: string
  createdAt: Date
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
  reviewedBy?: User
  reviewedAt?: Date
  actionTaken?: 'none' | 'warning' | 'temporary_ban' | 'permanent_ban' | 'message_block'
}

/**
 * Type représentant une recommandation d'ami
 */
export type FriendRecommendation = {
  id: string
  user: User
  recommendedUser: User
  score: number // Score de pertinence de la recommandation
  reason: 'mutual_friends' | 'similar_interests' | 'popular_user' | 'new_user'
  mutualFriends?: User[] // Amis en commun (si la raison est 'mutual_friends')
  shownAt?: Date // Date à laquelle la recommandation a été montrée à l'utilisateur
  dismissed: boolean // Si l'utilisateur a ignoré cette recommandation
}

/**
 * Type représentant les statistiques sociales d'un utilisateur
 */
export type UserSocialStats = {
  user: User
  followerCount: number
  followingCount: number
  friendCount: number // Nombre de relations mutuelles
  messagesSent: number
  messagesReceived: number
  averageResponseTime: number // Temps moyen de réponse en minutes
  lastActiveAt: Date
}

/**
 * Type représentant une sanction appliquée à un utilisateur suite à des signalements
 */
export type UserSanction = {
  id: string
  user: User
  type: 'warning' | 'message_restriction' | 'temporary_ban' | 'permanent_ban'
  reason: string
  appliedBy: User
  appliedAt: Date
  expiresAt?: Date // Pour les sanctions temporaires
  isActive: boolean
  relatedReports?: MessageReport[] // Signalements liés à cette sanction
}
