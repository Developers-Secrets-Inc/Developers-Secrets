import { useContext } from "react"
import { ChallengeStatusContext } from "../components/challenge-status-provider"

export const useChallengeStatus = () => {
    const context = useContext(ChallengeStatusContext)
    if (!context) {
      throw new Error('useChallengeStatus must be used within a ChallengeStatusProvider')
    }
    return context
  }
  