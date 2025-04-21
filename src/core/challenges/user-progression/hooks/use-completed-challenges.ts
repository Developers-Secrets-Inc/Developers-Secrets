'use client'

import { getCompletedChallengesForDate } from ".."
import { useEffect } from "react"
import { useState } from "react"

export type CompletedChallengeInfo = {
    id: number
    title: string
    slug: string
    difficulty: 'easy' | 'medium' | 'hard' | 'horrible'
  }

export const useCompletedChallenges = (userId: string, date: string | null) => {
    const [challenges, setChallenges] = useState<CompletedChallengeInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      // Ne fetch que si on a une date valide
      if (!date) {
        setIsLoading(false)
        setChallenges([])
        setError(null)
        return
      }
  
      const fetchChallenges = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const fetchedChallenges = await getCompletedChallengesForDate(userId, date)
          setChallenges(fetchedChallenges)
        } catch (err) {
          console.error('Failed to fetch challenges for date:', err)
          setError('Could not load challenges for this day.')
          setChallenges([])
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchChallenges()
    }, [userId, date]) // Dépendances du useEffect
  
    return { challenges, isLoading, error }
  }