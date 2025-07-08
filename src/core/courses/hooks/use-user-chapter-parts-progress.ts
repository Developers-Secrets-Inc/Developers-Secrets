'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllUserPartCompletionStatusesForChapter } from '@/core/courses/progression/completion-status'
import { useSessionUser } from '@/core/user/hooks/use-user'
import { ChapterPartStatusInfo } from '@/core/courses/parts'

interface UseUserChapterPartsProgressProps {
  chapterParts: { id: number; name: string; slug: string }[]
  userId?: string | null
}

export function useUserChapterPartsProgress({
  chapterParts,
  userId: userIdProp,
}: UseUserChapterPartsProgressProps) {
  const { user, isLoading: isUserLoading } = useSessionUser()
  const userId = userIdProp ?? user?.id ?? null

  const partIds = chapterParts.map((p) => p.id)

  const { data, isLoading, error } = useQuery({
    queryKey: ['userChapterPartsProgress', userId, partIds],
    queryFn: async () => {
      if (!userId || partIds.length === 0) {
        // Si pas d'utilisateur, tout est not_started
        return chapterParts.map((part) => ({
          ...part,
          status: 'not_started',
        })) as ChapterPartStatusInfo[]
      }
      const statusMap = await getAllUserPartCompletionStatusesForChapter(userId, partIds)
      return chapterParts.map((part) => ({
        ...part,
        status: statusMap[part.id] || 'not_started',
      })) as ChapterPartStatusInfo[]
    },
    enabled: !!userId && partIds.length > 0 && !isUserLoading,
    staleTime: 5 * 60 * 1000,
  })

  return {
    partsWithStatus: data ?? chapterParts.map((part) => ({ ...part, status: 'not_started' })),
    isLoading: isLoading || isUserLoading,
    error: error instanceof Error ? error.message : null,
  }
}

