import { trackAchievementProgress } from "@/core/gamification/achievements/action"
import type { Event } from "../type"
import { addCurrency } from "@/core/gamification/marketplace/currency"


export const ChallengeEvents: Event<{challengeId: number, userId: string}>[] = [
    async (payload) => (await trackAchievementProgress(payload.userId, 'challenges_completed', 1)),
]



