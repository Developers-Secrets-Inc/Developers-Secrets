'use client'

import { GenericLikeButton } from './like-button' // Assure-toi que les chemins sont corrects
import { GenericDislikeButton } from './dislike-button' // Assure-toi que les chemins sont corrects

type EngagementStatus = 'liked' | 'disliked' | 'none'

interface GenericReactionButtonsProps {
  // L'état de la réaction de l'utilisateur actuel
  userReaction: EngagementStatus
  // Fonctions à appeler lors des clics
  onLikeClick: () => void
  onDislikeClick: () => void
  // État de chargement global (peut désactiver les deux boutons)
  isLoading?: boolean
  // Optionnel: Affichage d'une erreur
  error?: string | null
}

export const GenericReactionButtons = ({
  userReaction,
  onLikeClick,
  onDislikeClick,
  isLoading,
  error,
}: GenericReactionButtonsProps) => {
  return (
    <div className="flex flex-col gap-1 items-start">
      {' '}
      {/* Ajusté pour aligner l'erreur */}
      <div className="flex items-center gap-2">
        <GenericLikeButton
          isActive={userReaction === 'liked'}
          onClick={onLikeClick}
          isLoading={isLoading}
        />
        <GenericDislikeButton
          isActive={userReaction === 'disliked'}
          onClick={onDislikeClick}
          isLoading={isLoading}
        />
      </div>
      {/* Afficher l'erreur si elle existe */}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  )
}
