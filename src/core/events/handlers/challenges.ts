import { trackAchievementProgress } from "@/core/gamification/achievements/action";
import { User } from "@/core/users/types";
import { Challenge } from "@/payload-types";
import type { Event } from "../type";


export const ChallengeEvents: Event<{challenge: Challenge; user: User}>[] = [
    async (payload) => (await trackAchievementProgress(payload.user.id, 'challenges_completed', 1)),
]



