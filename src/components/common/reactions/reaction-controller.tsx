'use client'
import { useReaction } from '@/hooks/reactions/use-reaction' // Assure-toi que c'est le bon chemin
import { GenericReactionButtons } from '@/components/common/reactions/reaction-buttons'
import { Skeleton } from '@/components/ui/skeleton' // Import Skeleton

type ReactionStatus = 'liked' | 'disliked' | 'none'

interface ReactionControllerProps {
  itemId: number
  itemType: 'coursePart' | 'challenge' // Gardé pour une éventuelle future généricité de l'action serveur
  userId: string | null
  initialUserReaction: ReactionStatus
  // Plus de compteurs initiaux
}

export function ReactionController({
  itemId,
  itemType, // Bien qu'inutilisé par le hook actuel, gardons-le
  userId,
  initialUserReaction,
  // Plus de compteurs initiaux
}: ReactionControllerProps) {
  // Call the hook unconditionally at the top
  const reactionHook = useReaction({
    itemId,
    userId: userId ?? '',
    initialUserReaction: initialUserReaction,
  })

  // Handle the case where user is not logged in *after* the hook call
  if (!userId) {
    return (
      <GenericReactionButtons
        userReaction={'none'} // Set a default state for logged out user
        isLoading={true} // Disabled state
        onLikeClick={() => {}}
        onDislikeClick={() => {}}
        error="Please log in to react"
      />
    )
  }

  // Destructure state and actions after the userId check
  const { state, actions } = reactionHook

  // Case 2: Initial load state from useQuery
  if (state.isInitialLoading) {
    return (
      <div className="flex items-center gap-2 h-9">
        {' '}
        {/* Match button height */}
        <Skeleton className="h-full w-16" /> {/* Adjust width as needed */}
        <Skeleton className="h-full w-20" /> {/* Adjust width as needed */}
      </div>
    )
  }

  // If userId is valid, proceed to render with the hook's state and actions
  return (
    <GenericReactionButtons
      userReaction={state.userReaction}
      error={state.error}
      onLikeClick={actions.handleLikeClick}
      onDislikeClick={actions.handleDislikeClick}
    />
  )
}
