import { useState, useEffect, useCallback } from 'react'

// Helper function to format timestamp to "time ago" string
const formatTimeAgo = (timestamp: number | null): string => {
  if (timestamp === null) {
    return 'Not visited yet'
  }
  const now = Date.now()
  const seconds = Math.round((now - timestamp) / 1000)

  if (seconds < 60) return 'Visited just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `Visited ${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Visited ${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `Visited ${days}d ago`
  const weeks = Math.round(days / 7)
  if (weeks < 4) return `Visited ${weeks}w ago`
  const months = Math.round(days / 30)
  if (months < 12) return `Visited ${months}mo ago`
  const years = Math.round(days / 365)
  return `Visited ${years}y ago`
}

export function useCourseLastVisitDate(courseSlug: string) {
  const [lastVisitedText, setLastVisitedText] = useState<string>('Loading...')

  const fetchLastVisit = useCallback(() => {
    if (typeof window !== 'undefined' && courseSlug) {
      const storedTimestamp = localStorage.getItem(`lastVisitedTimestamp_${courseSlug}`)
      const timestamp = storedTimestamp ? parseInt(storedTimestamp, 10) : null
      setLastVisitedText(formatTimeAgo(timestamp))
    } else {
      setLastVisitedText(formatTimeAgo(null))
    }
  }, [courseSlug])

  useEffect(() => {
    fetchLastVisit()
  }, [fetchLastVisit])

  return [lastVisitedText, fetchLastVisit] as const
}
