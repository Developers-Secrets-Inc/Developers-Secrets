
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type QuestRewardItem = {
    id: string
    name: string
    quantity: number
    description?: string
}

export type Quest = {
    id: string 
    name: string 
    description: string 
    difficulty: QuestDifficulty
    reward: {
        experiencePoints: number
        items?: Array<QuestRewardItem>
    }
    timeRemaining: number
}