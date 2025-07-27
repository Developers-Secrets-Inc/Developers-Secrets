import { getChallengeCategory, getChallengeCategoryPopulatedWithChallenges } from "."
import { getChallengeCategoryProgression } from "./progression"

const progression = {
    getUnique: {
        bySlug: getChallengeCategoryProgression
    }
}

export const categories = {
    getUnique: {
      bySlug: getChallengeCategory,
      bySlugWithChallenges: getChallengeCategoryPopulatedWithChallenges,
    },
    userProgression: progression
  }
  