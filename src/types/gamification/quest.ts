
export enum ChestRarity {
  COMMON = 'common',
  RARE = 'rare',
  LEGENDARY = 'legendary',
}

export const QuestsPerDay: Record<ChestRarity, number> = {
  [ChestRarity.COMMON]: 2,
  [ChestRarity.RARE]: 1,
  [ChestRarity.LEGENDARY]: 1,
}

export enum QuestObjectiveType {
  COMPLETE_COURSE = 'complete_course',
  SOLVE_PROBLEM = 'solve_problem',
  EARN_EXPERIENCE = 'earn_experience',
  MAINTAIN_STREAK = 'maintain_streak',
  COMPLETE_DAILY_CHALLENGE = 'complete_daily_challenge',
  HELP_OTHER_USERS = 'help_other_users',
  SHARE_CONTENT = 'share_content',
  INVITE_FRIENDS = 'invite_friends',
  VISIT_CONSECUTIVE_DAYS = 'visit_consecutive_days',
  PURCHASE_ITEM = 'purchase_item',
}

export enum QuestRewardType {
  EXPERIENCE = 'experience',
  CURRENCY = 'currency',
  CHEST = 'chest',
  ITEM = 'item',
}

export type QuestTemplate = {
  questId: string
  title: string
  description: string
  difficulty: ChestRarity
  objectiveType: QuestObjectiveType
  objectiveValue: number
  rewardType: QuestRewardType
  rewardValue: number | string
  durationHours?: number
}

export type ActiveQuest = {
  userId: string
  questId: string
  progress: number
  isCompleted: boolean
  expirationDate: Date
  assignedDate: Date
}

export type QuestReward = {
  rewardId: string
  type: QuestRewardType
  value: number | string
}

export type CompletedQuest = {
  userId: string
  questId: string
  completedDate: Date
  reward: QuestReward
}

export const QuestTemplates: Record<ChestRarity, QuestTemplate[]> = {
  [ChestRarity.COMMON]: [
    {
      questId: 'common_quest_1',
      title: 'Résoudre un problème',
      description: 'Résoudre un problème de programmation',
      difficulty: ChestRarity.COMMON,
      objectiveType: QuestObjectiveType.SOLVE_PROBLEM,
      objectiveValue: 1,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.COMMON,
    },
    {
      questId: 'common_quest_2',
      title: "Gagner de l'expérience",
      description: "Gagner 50 points d'expérience",
      difficulty: ChestRarity.COMMON,
      objectiveType: QuestObjectiveType.EARN_EXPERIENCE,
      objectiveValue: 50,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.COMMON,
    },
    {
      questId: 'common_quest_3',
      title: 'Connexion quotidienne',
      description: 'Se connecter à la plateforme',
      difficulty: ChestRarity.COMMON,
      objectiveType: QuestObjectiveType.VISIT_CONSECUTIVE_DAYS,
      objectiveValue: 1,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.COMMON,
    },
  ],
  [ChestRarity.RARE]: [
    {
      questId: 'rare_quest_1',
      title: 'Résoudre plusieurs problèmes',
      description: 'Résoudre 3 problèmes de programmation',
      difficulty: ChestRarity.RARE,
      objectiveType: QuestObjectiveType.SOLVE_PROBLEM,
      objectiveValue: 3,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.RARE,
    },
    {
      questId: 'rare_quest_2',
      title: 'Maintenir un streak',
      description: 'Maintenir un streak de 3 jours',
      difficulty: ChestRarity.RARE,
      objectiveType: QuestObjectiveType.MAINTAIN_STREAK,
      objectiveValue: 3,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.RARE,
    },
    {
      questId: 'rare_quest_3',
      title: "Aider d'autres utilisateurs",
      description: 'Aider 2 autres utilisateurs',
      difficulty: ChestRarity.RARE,
      objectiveType: QuestObjectiveType.HELP_OTHER_USERS,
      objectiveValue: 2,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.RARE,
    },
  ],
  [ChestRarity.LEGENDARY]: [
    {
      questId: 'legendary_quest_1',
      title: 'Maître du code',
      description: 'Résoudre 5 problèmes de programmation',
      difficulty: ChestRarity.LEGENDARY,
      objectiveType: QuestObjectiveType.SOLVE_PROBLEM,
      objectiveValue: 5,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.LEGENDARY,
    },
    {
      questId: 'legendary_quest_2',
      title: 'Streak légendaire',
      description: 'Maintenir un streak de 7 jours',
      difficulty: ChestRarity.LEGENDARY,
      objectiveType: QuestObjectiveType.MAINTAIN_STREAK,
      objectiveValue: 7,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.LEGENDARY,
    },
    {
      questId: 'legendary_quest_3',
      title: 'Inviter des amis',
      description: 'Inviter 3 amis à rejoindre la plateforme',
      difficulty: ChestRarity.LEGENDARY,
      objectiveType: QuestObjectiveType.INVITE_FRIENDS,
      objectiveValue: 3,
      rewardType: QuestRewardType.CHEST,
      rewardValue: ChestRarity.LEGENDARY,
    },
  ],
}

export interface QuestService {
  generateDailyQuests(userId: string): Promise<ActiveQuest[]>
  getActiveQuests(userId: string): Promise<ActiveQuest[]>
  updateQuestProgress(userId: string, questId: string, progress: number): Promise<ActiveQuest>
  completeQuest(userId: string, questId: string): Promise<QuestReward>
  getCompletedQuests(userId: string): Promise<CompletedQuest[]>
}
