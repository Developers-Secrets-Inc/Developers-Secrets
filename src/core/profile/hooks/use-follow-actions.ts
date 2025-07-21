import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleFollowUser } from '../actions'
import { useToast } from '@/components/ui/use-toast'
import { User } from '@/types/user'

interface FollowResult {
  success: boolean
  error?: string
  isFollowing?: boolean
}

interface MutationContext {
  previousFollowers: User[] | undefined
  previousFollowing: User[] | undefined
}

export const useFollowActions = (userId: string, targetUserId: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation<FollowResult, Error, void, MutationContext>({
    mutationFn: () => toggleFollowUser(userId, targetUserId),
    onMutate: async () => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ['followers', targetUserId] })
      await queryClient.cancelQueries({ queryKey: ['following', userId] })

      // Sauvegarder l'état précédent
      const previousFollowers = queryClient.getQueryData<User[]>(['followers', targetUserId])
      const previousFollowing = queryClient.getQueryData<User[]>(['following', userId])

      // Mise à jour optimiste des followers
      queryClient.setQueryData<User[]>(['followers', targetUserId], (old) => {
        if (!old) return []
        const currentUser = old.find((user) => user.id === userId)
        if (currentUser) {
          // Si l'utilisateur est déjà dans les followers, on le retire
          return old.filter((user) => user.id !== userId)
        } else {
          // Sinon on l'ajoute
          return [...old, { id: userId } as User]
        }
      })

      // Mise à jour optimiste des following
      queryClient.setQueryData<User[]>(['following', userId], (old) => {
        if (!old) return []
        const targetUser = old.find((user) => user.id === targetUserId)
        if (targetUser) {
          // Si l'utilisateur est déjà dans les following, on le retire
          return old.filter((user) => user.id !== targetUserId)
        } else {
          // Sinon on l'ajoute
          return [...old, { id: targetUserId } as User]
        }
      })

      return { previousFollowers, previousFollowing }
    },
    onError: (err, _, context) => {
      // En cas d'erreur, on restaure l'état précédent
      if (context?.previousFollowers) {
        queryClient.setQueryData(['followers', targetUserId], context.previousFollowers)
      }
      if (context?.previousFollowing) {
        queryClient.setQueryData(['following', userId], context.previousFollowing)
      }
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'action",
      })
    },
    onSettled: () => {
      // Après le succès ou l'échec, on invalide les requêtes pour s'assurer que les données sont à jour
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] })
      queryClient.invalidateQueries({ queryKey: ['following', userId] })
    },
  })
}
