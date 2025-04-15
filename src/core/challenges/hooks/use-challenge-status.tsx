import { useContext } from 'react'
import { ChallengeStatusContext } from '../components/challenge-status-provider'

export const useChallengeStatus = () => {
  const context = useContext(ChallengeStatusContext)
  if (!context) {
    throw new Error('useChallengeStatus must be used within a ChallengeStatusProvider')
  }
  return {
    status: context.visualStatus, // Pour la rétrocompatibilité
    visualStatus: context.visualStatus,
    persistedStatus: context.persistedStatus,
    updateVisualStatus: context.updateVisualStatus,
    updatePersistedStatus: context.updatePersistedStatus,
  }
}
