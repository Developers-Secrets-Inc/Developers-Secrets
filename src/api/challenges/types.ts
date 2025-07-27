import { Challenge, UserChallengeCompletionStatus } from "@/payload-types"

export type ChallengeWithCompletionStatus = Challenge & {
  completionStatus: UserChallengeCompletionStatus['completionStatus']
}
