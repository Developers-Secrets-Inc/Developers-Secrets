import { getChallengeConcepts } from "@/api/challenges/concepts"
import type { Event } from "../type"
import { increaseConceptProgression } from "@/api/skills"


export const ChallengeEvents: Event<{challengeId: number, userId: string}>[] = [
    async (payload) => {
        const challengeConcepts = await getChallengeConcepts(payload.challengeId)

        if (!challengeConcepts.conceptProgressions) return undefined

        console.log("Trying")

        await Promise.all(challengeConcepts.conceptProgressions.map(async (conceptProgression) => (
            await increaseConceptProgression(
                payload.userId, 
                typeof conceptProgression.concept === 'number' ? conceptProgression.concept : conceptProgression.concept.id,
                conceptProgression.completionPercentage
            )
        )))

        console.log("Success")
    }
]



