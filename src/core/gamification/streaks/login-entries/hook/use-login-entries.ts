'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { DailyLoginEntry } from '@/payload-types'
import { setTodayLogin, getUserLoginEntries, getActiveDaysCount } from '..'

const QUERY_KEYS = {
  LOGIN_ENTRIES: 'login-entries',
  ACTIVE_DAYS: 'active-days',
}

export const useLoginEntries = (userId?: string) => {
  const queryClient = useQueryClient()

  // Récupérer les entrées de connexion
  const {
    data: loginEntries = [],
    isLoading: isLoadingEntries,
    error: entriesError,
  } = useQuery<DailyLoginEntry[]>({
    queryKey: [QUERY_KEYS.LOGIN_ENTRIES, userId],
    queryFn: () => (userId ? getUserLoginEntries(userId) : []),
    enabled: !!userId,
  })

  // Récupérer le nombre de jours actifs
  const {
    data: activeDays = 0,
    isLoading: isLoadingActiveDays,
    error: activeDaysError,
  } = useQuery<number>({
    queryKey: [QUERY_KEYS.ACTIVE_DAYS, userId],
    queryFn: () => (userId ? getActiveDaysCount(userId) : 0),
    enabled: !!userId,
  })

  // Mutation pour enregistrer une connexion pour aujourd'hui
  const { mutateAsync: recordTodayLogin, isPending: isRecording } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User ID is required')
      return setTodayLogin(userId)
    },
    onSuccess: () => {
      // Invalider et rafraîchir les requêtes concernées
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOGIN_ENTRIES, userId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVE_DAYS, userId],
      })
    },
  })

  // Vérifier si l'utilisateur s'est connecté aujourd'hui
  const hasLoggedInToday = useCallback(() => {
    if (!loginEntries.length) return false
    const today = new Date().toISOString().split('T')[0]
    return loginEntries.some((entry) => entry.date === today)
  }, [loginEntries])

  return {
    // Données
    loginEntries,
    activeDays,
    hasLoggedInToday: hasLoggedInToday(),

    // États de chargement
    isLoading: isLoadingEntries || isLoadingActiveDays,
    isRecording,

    // Erreurs
    error: entriesError || activeDaysError,

    // Actions
    recordTodayLogin,

    // Pour une utilisation avancée
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGIN_ENTRIES, userId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVE_DAYS, userId] })
    },
  }
}

export default useLoginEntries
