import { useQuery } from '@tanstack/react-query'
import { getNavigationParts } from '@/core/courses/parts'
import { getChapterBySlug } from '@/core/courses/chapters'
import { checkChapterPrerequisites } from '@/core/courses/progression/actions'
import { useUser } from '@/core/users/hooks/use-user'

interface UseNextPartButtonProps {
  currentCourseSlug: string
  currentChapterSlug: string
  currentPartSlug: string
  initialNextPartUrl?: string | null
}

export function useNextPartButton({
  currentCourseSlug,
  currentChapterSlug,
  currentPartSlug,
  initialNextPartUrl = null,
}: UseNextPartButtonProps) {
  const { user, isLoading: isUserLoading } = useUser()
  const userId = user?.id ?? null

  const {
    data,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    queryKey: ['nextPartButton', userId, currentCourseSlug, currentChapterSlug, currentPartSlug],
    queryFn: async () => {
      const navigation = await getNavigationParts(
        currentCourseSlug,
        currentChapterSlug,
        currentPartSlug,
      )
      const next = navigation.next
      if (!next.chapterSlug || !next.partSlug) {
        return {
          nextPartUrl: null,
          isLocked: false,
          isEndOfChapter: true,
        }
      }
      const nextPartUrl = `/courses/${currentCourseSlug}/${next.chapterSlug}/${next.partSlug}`

      const isDifferentChapter = next.chapterSlug !== currentChapterSlug
      let isLocked = false
      if (isDifferentChapter && userId) {
        const nextChapter = await getChapterBySlug(currentCourseSlug, next.chapterSlug)
        isLocked = !(await checkChapterPrerequisites(userId, nextChapter.id))
      }
      return {
        nextPartUrl,
        isLocked,
        isEndOfChapter: false,
      }
    },
    enabled: !!user && !isUserLoading, // Only run if user is loaded
    initialData: initialNextPartUrl
      ? { nextPartUrl: initialNextPartUrl, isLocked: false, isEndOfChapter: false }
      : undefined,
    staleTime: 5 * 60 * 1000,
  })

  return {
    nextPartUrl: data?.nextPartUrl ?? null,
    isLocked: data?.isLocked ?? false,
    isEndOfChapter: data?.isEndOfChapter ?? false,
    isLoading: isUserLoading || isQueryLoading,
    refetch,
  }
}
