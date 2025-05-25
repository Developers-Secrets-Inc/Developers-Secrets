'use client' // C'est un hook client

import { useQuery, useQueryClient, QueryFilters } from '@tanstack/react-query'
import type { Challenge } from '@/payload-types'
// Importer la Server Action ou la fonction qui récupère le challenge
import { getRandomUncompletedChallenge } from '@/core/skills/recommendations' // Utiliser la fonction existante pour l'exemple

// Définir une clé de requête unique
const recommendedChallengeQueryKey = (userId: string) => ['recommendedChallenge', userId]

type UseRecommendedChallengeOptions = {
  userId: string // L'ID de l'utilisateur est essentiel pour la requête
  initialData: Challenge | null // Ajouter le challenge initial passé par le serveur
}

export const useRecommendedChallenge = ({
  userId,
  initialData,
}: UseRecommendedChallengeOptions) => {
  const queryClient = useQueryClient()

  // Utiliser useQuery pour charger et gérer le state du challenge
  const {
    data: recommendedChallenge, // Le challenge recommandé
    isLoading, // Indique le chargement initial (devrait être false si initialData est fourni)
    error, // Indique une erreur lors du fetch initial
    refetch, // Fonction pour re-fetch si nécessaire (moins pertinent ici, on utilisera plutôt setQueryData)
  } = useQuery({
    queryKey: recommendedChallengeQueryKey(userId),
    // La fonction de requête asynchrone
    queryFn: async () => {
      // Appelle la fonction serveur pour obtenir le challenge
      const challenge = await getRandomUncompletedChallenge(userId)
      // React Query attend une promesse qui résout avec les données ou rejette avec une erreur
      if (!challenge) {
        // Si aucun challenge n'est trouvé, on peut renvoyer null ou undefined,
        // ou rejeter une erreur selon comment on veut gérer l'état "pas de challenge"
        // Renvoyer null permet d'avoir `data: null`
        return null
      }
      return challenge
    },
    // Utiliser les données initiales du serveur
    initialData: initialData,
    // Options de React Query (facultatif, mais utile)
    staleTime: 1000 * 60 * 5, // Les données sont considérées comme "fraîches" pendant 5 minutes
    gcTime: 1000 * 60 * 10, // Les données non utilisées sont garbage collected après 10 minutes
    enabled: !!userId, // N'exécute la requête que si userId est disponible
  })

  // Fonction pour gérer la demande d'un nouveau challenge après feedback
  // Cette fonction serait appelée par les boutons de feedback dans le composant UI
  const fetchNewRecommendationWithFeedback = async (feedbackType: string) => {
    // Optionnel: Indiquer un état de chargement spécifique pour cette opération si l'on veut un indicateur distinct de isLoading
    // Cependant, isLoading du useQuery passera à true si on invalide la requête.
    // Si la Server Action retourne directement le nouveau challenge, on peut juste mettre à jour le cache.

    // Appeler la Server Action qui gère le feedback et renvoie le nouveau challenge
    // Assumer l'existence d'une Server Action `getNewRecommendedChallengeAndLogFeedback`
    // import { getNewRecommendedChallengeAndLogFeedback } from '@/core/skills/recommendations';
    try {
      // const newChallenge = await getNewRecommendedChallengeAndLogFeedback(userId, feedbackType);
      // Pour l'exemple, on réutilise getRandomUncompletedChallenge, mais idéalement,
      // l'appel Server Action ici gérerait aussi le feedback côté serveur.
      const newChallenge = await getRandomUncompletedChallenge(userId) // Remplacez par l'appel à votre SA

      // Mettre à jour le cache de React Query avec le nouveau challenge
      // Cela va déclencher un re-render du composant utilisant ce hook
      queryClient.setQueryData(recommendedChallengeQueryKey(userId), newChallenge)

      // Optionnel: invalider la requête si la Server Action ne retourne pas le nouveau challenge directement,
      // forçant React Query à re-fetch via queryFn.
      // await queryClient.invalidateQueries(recommendedChallengeQueryKey(userId));
    } catch (err) {
      console.error('Failed to fetch new recommended challenge with feedback:', err)
      // Gérer l'erreur, peut-être mettre à jour un état d'erreur local ou utiliser une notification globale
      // React Query gère déjà l'erreur du fetch initial via l'état 'error'.
    } finally {
      // Nettoyage si nécessaire
    }
  }

  return {
    recommendedChallenge, // Les données du challenge
    isLoading, // État de chargement initial (faux si initialData est présent)
    error, // Objet d'erreur
    fetchNewRecommendationWithFeedback, // Fonction pour re-fetch via les boutons
    // Corriger l'utilisation de isFetching
    isFetching: queryClient.isFetching({ queryKey: recommendedChallengeQueryKey(userId) }) > 0,
  }
}
